import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(process.argv[2] || path.join(import.meta.dirname, '..'));
const indexPath = process.argv[3] || 'index.html';
const expectedQuizCount = Number(process.argv[4] || 77);
const indexFullPath = path.join(root, indexPath);

const severityOrder = { High: 0, Medium: 1, Low: 2 };
const findings = [];

function addFinding(severity, file, line, title, detail) {
  findings.push({ severity, file, line, title, detail });
}

function lineOf(lines, pattern) {
  const re = pattern instanceof RegExp ? pattern : new RegExp(pattern);
  const idx = lines.findIndex((line) => re.test(line));
  return idx >= 0 ? idx + 1 : 0;
}

function countMatches(text, re) {
  return [...text.matchAll(re)].length;
}

function extractInlineScripts(html) {
  return [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
}

function tagBalance(html, tag) {
  const open = countMatches(html, new RegExp(`<${tag}(\\s|>|/)`, 'gi'));
  const close = countMatches(html, new RegExp(`</${tag}>`, 'gi'));
  return { open, close, balanced: open === close };
}

function makeMockElement(id = '') {
  return {
    id,
    children: [],
    style: {},
    className: '',
    textContent: '',
    innerHTML: '',
    value: '',
    scrollTop: 0,
    addEventListener() {},
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    setAttribute(name, value) {
      this[name] = value;
    },
  };
}

function runBrowserSmoke(scriptBody) {
  const elements = new Map();
  const getElement = (id) => {
    if (!elements.has(id)) elements.set(id, makeMockElement(id));
    return elements.get(id);
  };
  const timers = [];
  const context = {
    console,
    localStorage: {
      data: new Map(),
      getItem(key) {
        return this.data.has(key) ? this.data.get(key) : null;
      },
      setItem(key, value) {
        this.data.set(key, String(value));
      },
      removeItem(key) {
        this.data.delete(key);
      },
    },
    document: {
      getElementById: getElement,
      createElement: (tag) => makeMockElement(tag),
      querySelectorAll: () => [],
      addEventListener() {},
    },
    setTimeout(fn) {
      timers.push(fn);
      return timers.length;
    },
    clearTimeout() {},
    setInterval(fn) {
      timers.push(fn);
      return timers.length;
    },
    clearInterval() {},
    navigator: { userAgent: 'codex-review-node' },
  };
  context.window = context;
  context.globalThis = context;

  const inspectSnippet = `
;globalThis.__codexReview = {
  quizCount: typeof QUIZZES !== 'undefined' ? QUIZZES.length : null,
  quizIds: typeof QUIZZES !== 'undefined' ? QUIZZES.map(q => q.id) : [],
  emptyGoalCount: typeof QUIZZES !== 'undefined' ? QUIZZES.filter(q => q.freeform && q.freeform.goalState && Object.keys(q.freeform.goalState).length === 0).length : null,
  commandCount: typeof CMDS !== 'undefined' ? Object.keys(CMDS).length : null,
  hasQuizEngine: typeof QuizEngine !== 'undefined',
  hasQuizStorage: typeof QuizStorage !== 'undefined',
};`;

  vm.createContext(context);
  new vm.Script(scriptBody + inspectSnippet, { filename: indexPath }).runInContext(context, { timeout: 1000 });
  return context.__codexReview;
}

if (!fs.existsSync(indexFullPath)) {
  addFinding('High', indexPath, 0, 'Missing application file', `Could not find ${indexPath}.`);
} else {
  const html = fs.readFileSync(indexFullPath, 'utf8');
  const lines = html.split(/\r?\n/);
  const scripts = extractInlineScripts(html);

  if (scripts.length === 0) {
    addFinding('High', indexPath, 0, 'Missing inline script', 'The simulator has no executable JavaScript block.');
  }

  for (const tag of ['div', 'span', 'script', 'style']) {
    const balance = tagBalance(html, tag);
    if (!balance.balanced) {
      addFinding(
        'High',
        indexPath,
        lineOf(lines, new RegExp(`<${tag}(\\s|>|/)|</${tag}>`, 'i')),
        `Unbalanced <${tag}> tags`,
        `Open=${balance.open}, Close=${balance.close}. Browser parsing may break UI or scripts.`,
      );
    }
  }

  if (/<(?:script|link)\b[^>]*(?:src|href)=["']https?:\/\//i.test(html)) {
    addFinding(
      'Medium',
      indexPath,
      lineOf(lines, /<(?:script|link)\b[^>]*(?:src|href)=["']https?:\/\//i),
      'External dependency detected',
      'Project rules require a single vanilla HTML file with no external libraries.',
    );
  }

  const scriptBody = scripts.join('\n');
  try {
    new vm.Script(scriptBody, { filename: indexPath });
  } catch (error) {
    addFinding('High', indexPath, error.lineNumber || 0, 'JavaScript syntax error', error.message);
  }

  let runtimeInfo = null;
  try {
    runtimeInfo = runBrowserSmoke(scriptBody);
  } catch (error) {
    addFinding('High', indexPath, error.lineNumber || 0, 'Browser smoke runtime error', error.message);
  }

  const quizIds = runtimeInfo?.quizIds ?? [...html.matchAll(/id:'(Q\d{3})'/g)].map((match) => match[1]);
  if (quizIds.length !== expectedQuizCount) {
    addFinding(
      'Medium',
      indexPath,
      lineOf(lines, /const QUIZZES=\[/),
      'Unexpected quiz count',
      `Expected ${expectedQuizCount} quiz definitions, found ${quizIds.length}.`,
    );
  }

  const duplicateIds = [...new Set(quizIds.filter((id, idx) => quizIds.indexOf(id) !== idx))];
  for (const id of duplicateIds) {
    addFinding('High', indexPath, lineOf(lines, new RegExp(`id:'${id}'`)), 'Duplicate quiz id', `${id} appears more than once.`);
  }

  const emptyGoalCount = runtimeInfo?.emptyGoalCount ?? countMatches(html, /goalState:\{\}/g);
  if (emptyGoalCount > 0 && /if\(allMet\)this\._complete\(\)/.test(html)) {
    addFinding(
      'High',
      indexPath,
      lineOf(lines, /goalState:\{\}/),
      'Free mode can auto-complete empty goals',
      `${emptyGoalCount} freeform definitions use empty goalState, while _checkFree treats an empty object as all conditions met.`,
    );
  }

  const pipeStart = lineOf(lines, /if\(segs\.length>1\)/);
  if (pipeStart > 0) {
    const pipeEnd = lineOf(lines, /const parts=input\.split/);
    const pipeWindow = lines.slice(pipeStart - 1, pipeEnd > pipeStart ? pipeEnd - 1 : pipeStart + 120).join('\n');
    if (!/QuizEngine\.onCmd\(input\)/.test(pipeWindow)) {
      addFinding(
        'High',
        indexPath,
        pipeStart,
        'Piped commands skip quiz validation',
        'The pipe branch returns before notifying QuizEngine, so steps requiring commands like env | grep SAP cannot pass.',
      );
    }
  }

  if (/_save\(\)\{localStorage\.setItem/.test(html)) {
    addFinding(
      'Medium',
      indexPath,
      lineOf(lines, /_save\(\)\{localStorage\.setItem/),
      'localStorage save is not guarded',
      'Completion can fail before the success UI if localStorage.setItem throws.',
    );
  }

  if (/running:\(\)=>.*\|\|true/.test(html)) {
    addFinding(
      'Low',
      indexPath,
      lineOf(lines, /running:\(\)=>.*\|\|true/),
      'Always-true service status expression',
      'Expressions like sapOn||true are intentional only if sapstartsrv should always be active; otherwise they hide stopped states.',
    );
  }

  const readmePath = path.join(root, 'README.md');
  if (fs.existsSync(readmePath)) {
    const readme = fs.readFileSync(readmePath, 'utf8');
    if (/v4/.test(readme) && /Terminal v3/.test(html)) {
      addFinding(
        'Low',
        indexPath,
        lineOf(lines, /Terminal v3/),
        'Version label mismatch',
        'README references v4/Phase 3 while the app still displays v3.',
      );
    }
  }
}

findings.sort((a, b) => (
  severityOrder[a.severity] - severityOrder[b.severity]
  || a.file.localeCompare(b.file)
  || a.line - b.line
));

const reportDir = path.join(root, '.ai-collab');
fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(reportDir, 'CODEX_REVIEW_REPORT.md');
const actualQuizCount = fs.existsSync(indexFullPath)
  ? countMatches(fs.readFileSync(indexFullPath, 'utf8'), /id:'Q\d{3}'/g)
  : 0;

const report = [
  '# Codex Review Report',
  '',
  `- Generated: ${new Date().toISOString()}`,
  `- Engine: Node.js ${process.version}`,
  `- Target: ${indexPath}`,
  `- Expected quiz count: ${expectedQuizCount}`,
  `- Actual quiz count: ${actualQuizCount}`,
  '',
  '## Findings',
  '',
  findings.length === 0
    ? 'No automated findings.'
    : findings.map((finding) => {
      const location = finding.line > 0 ? `${finding.file}:${finding.line}` : finding.file;
      return `- **${finding.severity}** \`${location}\` - ${finding.title}\n  ${finding.detail}`;
    }).join('\n'),
  '',
  '## Suggested Manual Checks',
  '',
  '- Open index.html in a browser and check the console for syntax/runtime errors.',
  '- Start one step-mode quiz that requires a pipe command, then confirm the step advances.',
  '- Start one free-mode quiz with an empty goalState and confirm it does not auto-complete on the first unrelated command.',
  '- Complete a quiz with browser storage disabled or full, and confirm the completion UI still appears.',
  '',
].join('\n');

fs.writeFileSync(reportPath, report, 'utf8');
console.log(`Codex review report written to ${reportPath}`);
console.log('');

if (findings.length === 0) {
  console.log('No automated findings.');
  process.exit(0);
}

for (const finding of findings) {
  const location = finding.line > 0 ? `${finding.file}:${finding.line}` : finding.file;
  console.log(`${finding.severity.padEnd(6)} ${location.padEnd(22)} ${finding.title}`);
}

process.exit(findings.some((finding) => finding.severity === 'High') ? 2 : 1);
