# 인프라 진단 스크립트 배포 페이지

GitHub Releases에서 스크립트 파일을 가져와 카테고리별로 정리해서 보여주는 배포 페이지입니다.

## 사용 방법

1. `releases.json` 파일에 릴리즈 정보를 작성합니다.
2. GitHub Pages나 정적 호스팅으로 배포합니다.
3. 페이지에서 스크립트 파일을 다운로드할 수 있습니다.

## 파일 구조

- `index.html` - 메인 페이지
- `app.js` - 릴리즈 데이터 로딩 및 렌더링
- `style.css` - 스타일
- `releases.json` - 릴리즈 정보
- `release.ps1` - PowerShell 릴리즈 생성 스크립트

## 배포

GitHub Pages를 사용하는 경우, 저장소 설정에서 Pages를 활성화하면 자동으로 배포됩니다.
