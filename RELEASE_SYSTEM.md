# Script Deploy - Release System

인프라 진단 스크립트 배포를 위한 정적 JSON 기반 릴리즈 시스템

## 개요

GitHub API Rate Limit 문제를 해결하기 위해 정적 JSON 파일 기반의 릴리즈 시스템을 구축했습니다.
파일 해시 비교를 통해 실제 변경된 스크립트만 추적하고, 웹 UI에 변경 사항을 시각적으로 표시합니다.

## 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                        release.ps1 실행                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. GitHub 릴리즈 생성 + 파일 업로드                              │
│  2. 각 파일 MD5 해시 계산                                        │
│  3. 이전 releases.json의 해시와 비교                             │
│  4. 변경된 파일 목록 (changelog) 생성                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  releases.json 업데이트                                          │
│  - 각 파일: hash, modifiedDate 포함                              │
│  - changelog: new/updated 파일 목록                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Git commit & push → GitHub Pages 자동 배포                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  웹페이지 (app.js)                                               │
│  - releases.json fetch                                           │
│  - NEW/UPDATED 배지 표시                                         │
│  - 파일별 수정일 표시                                            │
│  - Changelog 섹션 렌더링                                         │
└─────────────────────────────────────────────────────────────────┘
```

## 파일 구조

```
infrascriptdeploypage/
├── index.html          # 메인 페이지
├── app.js              # 프론트엔드 로직
├── style.css           # 스타일
├── releases.json       # 릴리즈 데이터 (자동 생성)
├── release.ps1         # 릴리즈 도구 (gitignore)
├── .env                # GitHub 토큰 (gitignore)
└── res/
    └── SEEDGEN CI (PNG).png
```

## releases.json 구조

```json
{
  "latest": {
    "version": "v26010916",
    "date": "2026-01-09",
    "url": "https://github.com/seedgen-public/deploy/releases/tag/v26010916",
    "changelog": [
      { "name": "MySQL_Linux.sh", "type": "updated" },
      { "name": "NewScript.ps1", "type": "new" }
    ],
    "categories": {
      "OS": [
        {
          "name": "Linux.sh",
          "os": "Linux",
          "brand": "linux",
          "url": "https://github.com/.../Linux.sh",
          "hash": "a1b2c3d4e5f6...",
          "modifiedDate": "2026-01-05"
        }
      ],
      "DBMS": [...],
      "WEB/WAS": [...],
      "PC": [...]
    }
  },
  "history": [
    {
      "version": "v26010915",
      "date": "2026-01-09",
      "fileCount": 14,
      "url": "https://github.com/..."
    }
  ]
}
```

### 필드 설명

| 필드 | 설명 |
|------|------|
| `hash` | 파일 내용의 MD5 해시 (변경 감지용) |
| `modifiedDate` | 파일이 마지막으로 수정된 날짜 |
| `changelog` | 이번 릴리즈에서 변경된 파일 목록 |
| `type` | `new` (신규) 또는 `updated` (수정) |

## 카테고리 분류 규칙

파일명 기반으로 카테고리를 자동 분류합니다. **체크 순서가 중요합니다.**

```
1. DBMS 체크 (먼저)
   - MySQL, Oracle, MSSQL, PostgreSQL, MariaDB, Tibero

2. WEB/WAS 체크
   - Apache, Nginx, Tomcat, IIS, JEUS, WebtoB, Jboss, Weblogic

3. PC 체크
   - WindowsPC, PC_Check

4. OS 체크 (마지막)
   - Linux, Ubuntu, WindowsServer
```

**예시:**
- `MySQL_Linux.sh` → DBMS (MySQL 먼저 매칭)
- `JEUS_Linux.sh` → WEB/WAS (JEUS 먼저 매칭)
- `Linux.sh` → OS

## 사용법

### 1. 환경 설정

`.env` 파일 생성:
```
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

토큰 발급: https://github.com/settings/tokens/new?scopes=repo

### 2. 릴리즈 실행

```powershell
.\release.ps1
```

또는 토큰 직접 전달:
```powershell
.\release.ps1 -Token "ghp_xxxxxxxxxxxx"
```

### 3. 실행 흐름

1. 토큰 검증
2. 스크립트 파일 검색 (`D:\codex\infra2025\scripts`)
3. 파일 선택 UI (Out-GridView)
4. 버전/제목 입력
5. GitHub 릴리즈 생성
6. 파일 업로드
7. MD5 해시 계산 & 변경 감지
8. releases.json 생성 (BOM 없는 UTF-8)
9. Git commit & push

### 4. 콘솔 출력 예시

```
================================
   Script Deploy - Release Tool
================================

토큰 검증 중...
인증 성공: username

스크립트 파일 검색 중...
42개 파일 발견

[파일 선택 UI]

선택된 파일 (14개):
  - Linux.sh [1. OS/Linux]
  - MySQL_Linux.sh [2. DBMS/MySQL]
  ...

릴리즈 버전 입력 (예: v1.0.0): v26010916

릴리즈 생성 중...
릴리즈 생성 완료: https://github.com/...

업로드 중: Linux.sh...
  완료: https://github.com/.../Linux.sh

파일 해시 계산 중...

releases.json 생성 중...
변경된 파일:
  [UPDATED] MySQL_Linux.sh
  [NEW] NewScript.ps1
releases.json 생성 완료

Git commit & push 중...
Git push 완료

================================
릴리즈 완료!
URL: https://github.com/...
================================
웹 페이지에서 확인: https://seedgen-public.github.io/deploy/
```

## 웹 UI 기능

### Changelog 섹션
변경된 파일이 있으면 상단에 표시됩니다.

```
┌─────────────────────────────────────────────────┐
│ 이번 릴리즈 변경 사항                            │
├─────────────────────────────────────────────────┤
│ [NEW] NewScript.ps1  [UPDATED] MySQL_Linux.sh   │
└─────────────────────────────────────────────────┘
```

### 파일 목록
각 파일에 배지와 수정일이 표시됩니다.

```
┌─ DBMS ──────────────────────────────────────────┐
│ 🐬 MySQL_Linux.sh    UPDATED   2026-01-09  Linux│
│ 🐘 PostgreSQL.sh               2026-01-05  Linux│
└─────────────────────────────────────────────────┘
```

### 배지 종류

| 배지 | 색상 | 의미 |
|------|------|------|
| `NEW` | 초록색 | 이번 릴리즈에 새로 추가된 파일 |
| `UPDATED` | 노란색 | 내용이 변경된 파일 |
| (없음) | - | 이전과 동일한 파일 |

## 브랜드 아이콘

지원하는 브랜드별 아이콘:

### DBMS
- MySQL, Oracle, MSSQL, PostgreSQL, MariaDB, Tibero

### WEB/WAS
- Apache, Nginx, Tomcat, IIS, JEUS, WebtoB, Jboss, Weblogic

### OS
- Linux, Ubuntu, Windows

## 트러블슈팅

### 유니코드 깨짐
PowerShell `Out-File`은 기본적으로 BOM이 포함된 UTF-8을 사용합니다.
`[System.IO.File]::WriteAllText()`를 사용하여 BOM 없는 UTF-8로 저장합니다.

### Rate Limit
GitHub API를 사용하지 않고 정적 JSON 파일을 fetch하므로 Rate Limit 문제가 없습니다.

### 카테고리 분류 오류
파일명에 여러 키워드가 포함된 경우 체크 순서에 따라 분류됩니다.
예: `MySQL_Linux.sh`는 DBMS로 분류 (MySQL이 Linux보다 먼저 체크됨)

## 기술 스택

- **Frontend**: Vanilla JS, CSS (Pretendard 폰트)
- **Backend**: PowerShell, GitHub API
- **Hosting**: GitHub Pages
- **Data**: Static JSON

## 관련 파일

| 파일 | 역할 |
|------|------|
| `release.ps1` | 릴리즈 자동화 스크립트 |
| `releases.json` | 릴리즈 데이터 저장소 |
| `app.js` | 프론트엔드 렌더링 |
| `style.css` | UI 스타일 |
| `index.html` | 메인 페이지 |

---

**최종 업데이트**: 2026-01-09
