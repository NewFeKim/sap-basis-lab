# sapcontrol 오류 대응 가이드

## 1. 인증 방식

sapstartsrv는 두 가지 인증 방식을 지원한다.

| 방식 | 설명 |
|------|------|
| Trusted Connect | 자격증명 없이 실행 시 우선 시도. `/tmp/.sapstream5<NR>13` 파일 기반 |
| HTTP Basic Auth | Trusted Connect 실패 시 폴백. 자격증명 없으면 401 반환 |

- Linux/Unix: `/tmp/.sapstream5<인스턴스번호>13`
- Windows: `\\.\pipe\sapcontrol_<인스턴스번호>`

---

## 2. 명령어 기본 문법 (이 문서 기준)

```bash
sapcontrol -nr <인스턴스번호> -function <함수명> [옵션]
```

| 옵션 | 설명 |
|------|------|
| `-nr` | 인스턴스 번호 지정 |
| `-function` | 실행할 함수(method) 지정 |
| `-debug` | 디버그 모드 실행 (네트워크 문제 진단용) |

> 전체 옵션 목록은 SAP Note 877795 참조

---

## 3. 지원 함수 목록 (이 문서 기준)

| 함수명 | 설명 | 파라미터 |
|--------|------|----------|
| `RestartService` | sapstartsrv 서비스 재시작 | 없음 |

> 전체 함수 목록은 SAP Note 877795 참조

---

## 4. 오류 유형 및 해결 방법

### 4.1 `FAIL: HTTP error, HTTP/1.1 401 Unauthorized`

Trusted Connect 실패로 인한 인증 오류

| 원인 | 해결 방법 |
|------|-----------|
| (a) `/tmp/.sapstream5<NR>13` 파일을 다른 유저가 선점 | 파일 수동 삭제 후 `RestartService` 실행 |
| (b) sapstartsrv 기동 후 해당 파일이 외부 cleanup으로 삭제됨 | `/tmp` 자동 정리 비활성화 후 sapstartsrv 재시작 |
| (c) `<sid>adm` 이 아닌 다른 유저로 실행 | 반드시 `<sid>adm` 유저로 실행 |

```bash
# (a) 해결 예시
sapcontrol -nr <NR> -function RestartService
```

---

### 4.2 `FAIL: Invalid Credentials`

비밀번호를 정확히 입력했음에도 protected method 실행 시 인증 실패

| 원인 | 해결 방법 |
|------|-----------|
| `sapuxuserchk` 권한 문제 | SAP Note 927637 기준으로 권한 확인 |
| 도메인 유저(NIS, ADS) 사용 | shadow user 여부 확인 (도메인 유저는 지원 안 됨) |
| PAM 서비스가 인증 차단 | OS 레벨 PAM 로그 확인 |

---

### 4.3 Connection 오류

#### (a) `FAIL: NIECONN_REFUSED (Connection refused)`

| 점검 항목 |
|-----------|
| sapstartsrv 프로세스 실행 여부 확인 |
| SAP Note 1348820 참조 |
| SAP Note 1916333 참조 |

#### (b) `FAIL: NIECONN_REFUSED (Connection timed out)`

```bash
# 디버그 모드로 네트워크 문제 진단
sapcontrol -nr <NR> -function <WEBMETHODS> -debug
```

디버그 실행 시 아래 오류가 나타나고 `.sapstream` 파일이 재시작 후에도 미갱신되는 경우:

```
*** ERROR => NiPConnect2: SiPeekPendConn failed for hdl 1/sock 3
(SI_ECONN_REFUSE/111; I4; ST; 127.0.0.1:52013)
(SI_ECONN_REFUSE/111; UD; ST; /tmp/.sapstream52013)
```

해결 순서:
1. sapstartsrv 프로세스 kill
2. 관련 `.sapstream` 파일 삭제
3. sapstartsrv 재시작

---

### 4.4 기타 문제

| 점검 항목 |
|-----------|
| SAP Note 877795 에서 기지 문제 여부 확인 |
| 트레이스 파일 `sapstartsrv.log` 분석 |

---

## 5. 관련 SAP Notes

| Note 번호 | 내용 |
|-----------|------|
| 877795 | sapcontrol 전체 함수/옵션/exit status 목록 |
| 927637 | sapuxuserchk 권한 설정 |
| 1348820 | Connection refused 관련 |
| 1916333 | Connection refused 관련 |
