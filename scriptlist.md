<div align="center">

# 🔒 Seedgen Security Diagnostic Scripts

> **사내 배포 리포지토리** | KISA 주요정보통신기반시설 기술적 취약점 분석·평가를 위한 자동화 진단 스크립트

[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux-lightgrey.svg)]()
[![Status](https://img.shields.io/badge/status-Development%20in%20Progress-yellow.svg)]()
[![Internal](https://img.shields.io/badge/repo-Internal-orange.svg)]()

**2026 버전 새 기준 기반 스크립트 재작성 진행중** 🔄

**문의사항이 있으시면 아래 담당자에게 연락 부탁드립니다.**

📧 **권예원 전임** | [yeewony@seedgen.kr](mailto:yeewony@seedgen.kr)

---

</div>

## 📈 전체 개발 현황

<div align="center">

| 카테고리 | 총 항목 | ✅ 완료 | 🔄 개발중 | 📋 계획 | 진행률 |
|:--------:|:-------:|:-------:|:---------:|:-------:|:------:|
| **OS** | 6 | 3 | 0 | 3 | ██████████ 50% |
| **DBMS** | 10 | 4 | 0 | 6 | ████████░░ 40% |
| **WEB/WAS** | 15 | 0 | 0 | 15 | █░░░░░░░░░ 0% |
| **PC** | 2 | 1 | 0 | 1 | ████████░░ 50% |
| **전체** | **33** | **8** | **0** | **25** | **████░░░░░░ 24%** |

**현재 상태**: 🟢 완료 8개 | 🟡 개발중 0개 | 🔵 계획 25개

</div>

---

## 📊 대시보드

### 🖥️ 운영체제 (OS)

#### Linux 계열

| 플랫폼 | 스크립트명 | 항목코드 | XML | 상태 | 비고 |
|:-------|:-----------|:--------:|:---:|:----:|:-----|
| ✅ **RHEL** | `Linux.sh` | U | ✅ | ✅ **완료** | 67개 항목 (U-01 ~ U-67) - RHEL, Rocky, CentOS, Amazon Linux |
| ✅ **Ubuntu** | `Ubuntu.sh` | - | ✅ | ✅ **완료** | Ubuntu 전용 진단 |
| 📋 **HP-UX** | - | - | - | 📋 **계획** | POSIX 형식으로 개선 필요 |
| 📋 **Solaris** | - | - | - | 📋 **계획** | POSIX 형식으로 개선 필요 |
| 📋 **AIX** | - | - | - | 📋 **계획** | POSIX 형식으로 개선 필요 |

#### Windows 계열

| 플랫폼 | 스크립트명 | 항목코드 | XML | 상태 | 비고 |
|:-------|:-----------|:--------:|:---:|:----:|:-----|
| ✅ **Windows Server** | `WindowsServer_Check.ps1` | W | ✅ | ✅ **완료** | 64개 항목 (W-01 ~ W-64) |

#### 기타

| 플랫폼 | 스크립트명 | 항목코드 | XML | 상태 | 비고 |
|:-------|:-----------|:--------:|:---:|:----:|:-----|
| 📋 **ESXi** | - | VE | - | 📋 **계획** | 개발 예정 |

---

### 🗄️ 데이터베이스 (DBMS)

#### 완료된 스크립트

| DBMS | 플랫폼 | 스크립트명 | XML | 상태 | 비고 |
|:-----|:-------|:-----------|:---:|:----:|:-----|
| ✅ **MySQL** | Linux | `MySQL_Linux.sh` | ✅ | ✅ **완료** | - |
| ✅ **Oracle** | Linux | `Oracle_Linux.sh` | ✅ | ✅ **완료** | AIX 버전 지원 고려 필요 |
| ✅ **MSSQL** | Windows | `MSSQL_Windows.ps1` | ✅ | ✅ **완료** | - |
| ✅ **PostgreSQL** | Linux | `PostgreSQL_Linux.sh` | ✅ | ✅ **완료** | - |

#### 개발 계획

| DBMS | 플랫폼 | 스크립트명 | XML | 상태 | 비고 |
|:-----|:-------|:-----------|:---:|:----:|:-----|
| 📋 **MySQL** | Windows | - | - | 📋 **계획** | 개발 예정 |
| 📋 **Oracle** | Windows | - | - | 📋 **계획** | 개발 예정 |
| 📋 **MariaDB** | Linux | - | - | 📋 **계획** | 개발 예정 |
| 📋 **MariaDB** | Windows | - | - | 📋 **계획** | 개발 예정 |
| 📋 **Tibero** | Linux | - | - | 📋 **계획** | Tibero.sh, Tibero.sql 구성 필요 |
| 📋 **Tibero** | Windows | - | - | 📋 **계획** | 스크립트, 가이드 생성 필요 |
| 📋 **PostgreSQL** | Windows | - | - | 📋 **계획** | 개발 예정 |

---

### 🌐 WEB/WAS

| WAS | 플랫폼 | 항목코드 | 스크립트명 | XML | 상태 | 비고 |
|:----|:-------|:--------:|:-----------|:---:|:----:|:-----|
| 📋 **Apache** | Linux | WA | - | - | 📋 **계획** | 개발 예정 |
| 📋 **Apache** | Windows | - | - | - | 📋 **계획** | 개발 예정 |
| 📋 **Apache** | Ubuntu | - | - | - | 📋 **계획** | 개발 예정 |
| 📋 **IIS** | Windows | WI | - | - | 📋 **계획** | 개발 예정 |
| 📋 **Nginx** | Linux | WN | - | - | 📋 **계획** | 개발 예정 |
| 📋 **Nginx** | Windows | - | - | 📋 **계획** | 스크립트, 가이드 생성 필요 |
| 📋 **Tomcat** | Linux | WT | - | - | 📋 **계획** | 개발 예정 |
| 📋 **Tomcat** | Windows | - | - | 📋 **계획** | 개발 예정 |
| 📋 **Jboss** | Linux | WB | - | - | 📋 **계획** | jboss, jeus 확인 필요 |
| 📋 **Jboss** | Windows | - | - | 📋 **계획** | 스크립트, 가이드 생성 필요 |
| 📋 **Jeus** | Linux | - | - | - | 📋 **계획** | 사용빈도 낮음, 항목코드 확인 필요 |
| 📋 **Jeus** | Windows | WJ | - | - | 📋 **계획** | 개발 예정 |
| 📋 **Weblogic** | Linux | WL | - | - | 📋 **계획** | 개발 예정 |
| 📋 **Weblogic** | Windows | - | - | 📋 **계획** | 스크립트 생성 필요 |
| 📋 **Webtob** | Linux | WW | - | - | 📋 **계획** | 사용빈도 낮음, 항목코드 확인 필요 |
| 📋 **Webtob** | Windows | - | - | 📋 **계획** | 사용빈도 낮음 |

---

### 💻 PC

| OS | 스크립트명 | 항목코드 | XML | 상태 | 비고 |
|:---|:-----------|:--------:|:---:|:----:|:-----|
| ✅ **Windows** | `WindowsPC_Check_Script.ps1` | PC | ✅ | ✅ **완료** | 18개 항목, 추가 개선 필요 |
| 📋 **Mac** | - | PM | - | 📋 **계획** | 개발 예정 |

---

## 📋 진단 코드 종합 대시보드

<div align="center">

### 카테고리별 진단 코드 현황

</div>

### 🖥️ 운영체제 (OS)

| 진단 코드 | 플랫폼 | 항목 수 | 상태 | 비고 |
|:---------:|:-------|:-------:|:----:|:-----|
| **U** | RHEL (Linux/Unix) | 67 | ✅ | U-01 ~ U-67 |
| **W** | Windows Server | 64 | ✅ | W-01 ~ W-64 |
| **PC** | Windows PC | 18 | ✅ | PC-01 ~ PC-18 |
| **PM** | Mac PC | - | 📋 | 계획 |
| **VE** | ESXi | - | 📋 | 계획 |

### 🗄️ 데이터베이스 (DBMS)

| 진단 코드 | DBMS | 플랫폼 | 상태 | 비고 |
|:---------:|:-----|:-------|:----:|:-----|
| **M** | MySQL | Linux | ✅ | M-01 ~ M-XX |
| **M** | MySQL | Windows | 📋 | 계획 |
| **O** | Oracle | Linux | ✅ | O-01 ~ O-XX |
| **O** | Oracle | Windows | 📋 | 계획 |
| **S** | MSSQL | Windows | ✅ | S-01 ~ S-XX |
| **P** | PostgreSQL | Linux | ✅ | P-01 ~ P-XX |
| **P** | PostgreSQL | Windows | 📋 | 계획 |
| - | MariaDB | Linux/Windows | 📋 | 계획 |
| - | Tibero | Linux/Windows | 📋 | 계획 |

### 🌐 WEB/WAS

| 진단 코드 | WAS | 플랫폼 | 상태 | 비고 |
|:---------:|:----|:-------|:----:|:-----|
| **WA** | Apache | Linux | 📋 | 계획 |
| **WA** | Apache | Windows | 📋 | 계획 |
| **WA** | Apache | Ubuntu | 📋 | 계획 |
| **WI** | IIS | Windows | 📋 | 계획 |
| **WN** | Nginx | Linux | 📋 | 계획 |
| **WN** | Nginx | Windows | 📋 | 계획 |
| **WT** | Tomcat | Linux | 📋 | 계획 |
| **WT** | Tomcat | Windows | 📋 | 계획 |
| **WB** | Jboss | Linux | 📋 | 계획 |
| **WB** | Jboss | Windows | 📋 | 계획 |
| - | Jeus | Linux | 📋 | 계획 |
| **WJ** | Jeus | Windows | 📋 | 계획 |
| **WL** | Weblogic | Linux | 📋 | 계획 |
| **WL** | Weblogic | Windows | 📋 | 계획 |
| **WW** | Webtob | Linux | 📋 | 계획 |
| **WW** | Webtob | Windows | 📋 | 계획 |

---

## 🎯 우선순위

### 🔥 High Priority
1. WEB/WAS 스크립트 전체 (Apache, Nginx, Tomcat, IIS)
2. DBMS Windows 버전 (MySQL, Oracle, PostgreSQL)
3. Unix 계열 OS (HP-UX, Solaris, AIX)

### 🔶 Medium Priority
1. MariaDB 지원
2. WAS 추가 (Jboss, Jeus, Weblogic, Webtob)

### 🔷 Low Priority
1. Tibero
2. Mac PC 스크립트
3. ESXi

---

## 🚀 빠른 시작

### Windows Server 진단

```powershell
# 관리자 권한 PowerShell에서 실행
.\scripts\1. OS\Windows\WindowsServer_Check.ps1
```

### Linux 진단

```bash
# root 권한으로 실행
chmod +x scripts/1. OS/Linux/RHEL/Linux.sh
sudo ./scripts/1. OS/Linux/RHEL/Linux.sh
```

### Windows PC 진단

```powershell
# 관리자 권한 PowerShell에서 실행
.\scripts\7. PC\WindowsPC_Check_Script.ps1
```

---

## 📁 프로젝트 구조

```
.
├── scripts/
│   ├── 1. OS/                    # 운영체제 진단 스크립트
│   │   ├── Linux/
│   │   │   ├── RHEL/           # RHEL 계열 (RHEL, Rocky, CentOS, Amazon Linux)
│   │   │   └── Ubuntu/          # Ubuntu 진단
│   │   └── Windows/             # Windows Server 진단
│   ├── 2. DBMS/                  # 데이터베이스 진단 스크립트
│   │   ├── MySQL/
│   │   ├── Oracle/
│   │   ├── MSSQL/
│   │   └── PostgreSQL/
│   └── 7. PC/                    # PC 진단 스크립트
│
├── Universal Script Guide/       # 스크립트 작성 가이드
│   ├── USG.md                   # 통합 스크립트 가이드
│   ├── Logic.md                 # 로직 가이드
│   ├── Recipe.md                # 레시피 가이드
│   └── OS/                      # OS별 상세 가이드
│
└── README.md
```

---

## 📄 출력 형식

모든 진단 스크립트는 **표준화된 XML 형식**으로 결과를 출력합니다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<seedgen>
    <meta>
        <date>2025-01-08T09:00:00+09:00</date>
        <ver>1.0</ver>
        <plat>Windows</plat>
        <type>Server</type>
        <std>KISA</std>
    </meta>
    <sys>
        <host>SERVER-01</host>
        <os>Windows Server 2022</os>
        <!-- ... -->
    </sys>
    <results>
        <item id="W-01" result="Y" />
        <item id="W-02" result="N" />
        <!-- ... -->
    </results>
</seedgen>
```

---

## 📚 문서

| 문서 | 설명 |
|:-----|:-----|
| [Universal Script Guide (USG)](Universal%20Script%20Guide/USG.md) | 통합 스크립트 작성 가이드 |
| [Windows 진단 가이드](Universal%20Script%20Guide/OS/Windows.md) | Windows 진단 상세 가이드 |
| [Linux 진단 가이드](Universal%20Script%20Guide/OS/Linux.md) | Linux 진단 상세 가이드 |
| [Logic 가이드](Universal%20Script%20Guide/Logic.md) | 스크립트 로직 가이드 |
| [Recipe 가이드](Universal%20Script%20Guide/Recipe.md) | 진단 항목 레시피 가이드 |

---

## 🛠️ 요구사항

### Windows
- ✅ PowerShell 5.1 이상
- ✅ 관리자 권한

### Linux
- ✅ Bash Shell
- ✅ root 권한

---

## 📝 사용 예시

### Windows Server 진단 예시

```powershell
PS C:\> .\scripts\1. OS\Windows\WindowsServer_Check.ps1

[SeedGen] Windows Server 보안 진단 시작
[INFO] 관리자 권한 확인 완료
[INFO] 시스템 정보 수집 중...
[INFO] 진단 항목 체크 중 (64개)...
  [W-01] 계정 잠금 임계값 설정 - Y
  [W-02] 패스워드 복잡성 설정 - N
  ...
[INFO] 진단 완료: C:\seedgen_output\result_20250108_090000.xml
```

---

## 📌 주요 변경사항

### 2026 버전 기준
- ✨ **전체 기준 변경**: 모든 스크립트 새 기준으로 재작성
- 📊 **XML 출력 통합**: 모든 스크립트 XML 형식 출력 지원
- 📝 **USG 표준 적용**: Universal Script Guide 기반 통일된 구조
- 🔄 **지속적 업데이트**: 기준 변경에 따른 지속적인 개선

---

## ⚠️ 주의사항

> **중요**: 이 리포지토리는 **사내 배포용**이며, **현재 개발 중**입니다.

- 🔐 모든 진단 스크립트는 **관리자(root) 권한**이 필요합니다
- 💾 진단 실행 전 **백업**을 권장합니다
- 📊 진단 결과는 XML 형식으로 저장됩니다
- 🔒 스크립트 실행 중 시스템 정보가 수집되며, **민감한 정보가 포함될 수 있습니다**
- 🔄 **개발 진행 중**: 일부 스크립트는 계속 개선되고 있습니다

---

## 📞 문의 및 지원

<div align="center">

**문의사항이 있으시면 아래 담당자에게 연락 부탁드립니다.**

### 📧 **권예원 전임**

**이메일**: [yeewony@seedgen.kr](mailto:yeewony@seedgen.kr)

---

**SeedGen Security Team**

**최종 업데이트**: 2025-01-08

</div>
