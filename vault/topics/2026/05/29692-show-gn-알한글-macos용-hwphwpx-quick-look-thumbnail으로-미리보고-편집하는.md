---
id: 29692
title: "Show GN: 알한글: macOS용 HWP/HWPX Quick Look, Thumbnail으로 미리보고 편집하는 앱"
url: https://postmelee.github.io/alhangeul-macos/
domain: postmelee.github.io
author: postmelee
points: 21
comments_count: 20
posted_at: 2026-05-20T10:53:53+09:00
fetched_at: 2026-05-23T15:51:13.168Z
last_seen_at: 2026-05-23T15:51:13.168Z
tags: []
auto_tags:
  - domain/postmelee.github.io
  - type/show
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
안녕하세요. macOS용 HWP/HWPX 유틸리티 앱 알한글(Alhangeul)을 만들고 있습니다.  
  
알한글은 Mac에서 .hwp, .hwpx 파일을 Finder와 기본 앱 흐름 안에서 조금 더 자연스럽게 다루기 위한 오픈소스 앱입니다. 현재는 다음 기능을 제공합니다.  
- Finder Quick Look 미리보기  
- Finder 썸네일 표시  
- 앱에서 HWP/HWPX 문서 열기  
- 간단한 편집 (`rhwp-studio`가 제공하는 편집 기능과 동일한 수준)  
- HWP 저장 / 다른 이름으로 저장  
- PDF 내보내기  
- 인쇄  
- macOS 공유 시트 연동  
- 최근 문서 다시 열기  
  
DMG는 [제품 페이지](https://postmelee.github.io/alhangeul-macos/)의 다운로드 버튼이나 [GitHub Releases](https://github.com/postmelee/alhangeul-macos/releases/latest)에서 받을 수 있습니다.  
https://github.com/postmelee/alhangeul-macos/releases/latest  
  
또는 Homebrew Cask로 할 수 있습니다.  
`brew install --cask postmelee/tap/alhangeul`  
  
이걸 만들기 시작한 이유는 macOS에서 HWP/HWPX 파일이 Finder 단계부터 다루기 불편했기 때문입니다. 내용을 확인하려고 매번 별도 앱을 열거나, 변환하거나, 다른 환경으로 옮겨야 하는 경우가 많았습니다. 우선은 “스페이스바로 미리보고, Finder에서 썸네일로 구분하고, 필요하면 앱에서 열어 PDF로 내보내는” 흐름을 만드는 데 집중하고 있습니다.  
  
기술적으로는 Rust 기반 [rhwp](https://github.com/edwardkim/rhwp) 코어를 macOS 앱, Quick Look extension, Thumbnail extension, Swift bridge로 연결했습니다.  
https://github.com/edwardkim/rhwp  
  
현재 앱 화면은 rhwp-studio를 WKWebView로 품는 방식입니다. Quick Look, Finder thumbnail, PDF export 쪽은 Rust bridge와 Swift/CoreGraphics 기반 렌더링 경로를 사용합니다. 장기적으로는 WKWebView fallback을 유지하면서 Rust/rhwp Skia renderer와 Swift native macOS shell을 결합하는 방향을 보고 있습니다.  
  
아직 한계도 있습니다.  
  
- 모든 HWP/HWPX 문서를 완벽하게 렌더링한다고 보장하지 않습니다.  
- 앱 화면, Quick Look, PDF 내보내기, 인쇄가 내부적으로 서로 다른 렌더링 경로를 사용할 수 있습니다.  
- 편집 기능은 현재 `rhwp-studio`가 제공하는 간단한 편집 범위입니다.  
- HWPX 직접 저장은 아직 제한이 있어 HWP export 경로를 사용합니다.  
- 한컴오피스 대체제를 목표로 하기보다는, 현재는 macOS 파일 시스템 통합과 기본 보기 경험을 먼저 개선하는 단계입니다.  
  
테스트해 보시고 특히 다음 부분에 대한 피드백을 받고 싶습니다.  
  
- Quick Look이나 Finder 썸네일이 깨지는 문서  
- Intel Mac / Apple Silicon Mac에서 설치나 실행 문제  
- PDF 내보내기 결과가 원본과 크게 다른 사례  
- Mac 앱으로서 어색한 파일 열기, 저장, 공유 흐름  
  
프로젝트는 MIT 라이선스이고, Hancom과는 관련 없는 독립 오픈소스 프로젝트입니다. HWP/HWPX 파일을 Mac에서 자주 다루시는 분들의 실제 샘플과 피드백이 있으면 도움이 많이 될 것 같습니다.  
  
GitHub 저장소:  
https://github.com/postmelee/alhangeul-macos

<!-- USER:NOTES -->
## 내 메모
