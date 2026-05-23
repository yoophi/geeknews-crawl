---
id: 29766
title: "Show GN: Marksmith - VS Code/Windsurf용 마크다운 생산성 확장"
url: https://rakkunn.github.io/MarkSmith/
domain: rakkunn.github.io
author: woojinim64
points: 2
comments_count: 0
posted_at: 2026-05-23T01:36:24+09:00
fetched_at: 2026-05-23T15:50:36.086Z
last_seen_at: 2026-05-23T15:50:36.086Z
tags: []
auto_tags:
  - domain/rakkunn.github.io
  - type/show
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
### VS Code와 Windsurf에서 마크다운 작성 시 발생하는 잔작업을 줄이기 위해 만든 확장 프로그램  
  
클립보드 컨텍스트 인식, 양방향 프리뷰, 문서 분석 기능을 하나의 패키지로 통합  
Windsurf는 VS Code 포크 기반이므로 동일 API로 양쪽 모두 지원  
  
---  
  
### 만든 이유  
  
웹/Word에서 복사한 콘텐츠가 깨진 HTML 또는 plain text로 들어오는 문제  
표 데이터 입력 시 외부 변환 사이트 의존  
프리뷰와 에디터 간 위치 동기화 부재로 인한 스크롤 탐색 비용  
  
---  
  
### 주요 기능  
- Smart Paste  
  
HTML → Markdown: Turndown 엔진에 GFM 표·코드블록 룰 오버라이드 적용  
TSV 자동 변환: 엑셀/구글 시트에서 복사한 표를 정규식 기반 파이프라인으로 마크다운 테이블로 치환  
선택 텍스트 위에 URL 붙여넣기 시 [selected](url) 형태로 자동 래핑  
  
- Bi-directional Preview  
  
변경 시 전체 리렌더 → KaTeX 깜빡임 및 스크롤 튐 문제 발생  
증분 업데이트(incremental DOM patch) 방식으로 변경  
컴파일 단계에서 각 HTML 노드에 data-line 속성 주입하여 소스 라인 매핑  
프리뷰 클릭 시 postMessage로 에디터에 라인 번호 전달 → 커서 이동  
  
- Document X-Ray (사이드바 대시보드)  
  
한영 혼합 문서 자수/읽기 시간 추정 (영문 200wpm, 한글 500자/분 기준)  
헤딩 트리 파싱 기반 아웃라인 + 클릭 네비게이션  
문서 내 외부 링크 비동기 404 헬스 체크  
  
---  
  
### 현재 지원 범위  
  
린터/포맷터 통합  
KaTeX, Mermaid 렌더링  
HTML/PDF 익스포트  
  
---  
  
### 향후 계획  
  
대용량 문서 성능 최적화 (incremental parsing)  
AI 어시스트 연동 (요약, 문장 교정)  
Obsidian Vault 호환 모드  
  
---  
  
### 기술적 메모  
  
VS Code Extension API의 Webview는 에디터와 격리된 샌드박스  
양방향 통신 시 디바운싱과 메시지 배칭이 없으면 큰 문서에서 성능 저하 발생  
아키텍처 설계에 따라 동일 기능이라도 퍼포먼스 차이가 큼  
  
---  
  
### 링크  
  
GitHub: https://github.com/RAKKUNN/Marksmith  
Page: https://rakkunn.github.io/MarkSmith/  
  
---  
  
많은 피드백과 리뷰 부탁드립니다!!  
감사합니다.

<!-- USER:NOTES -->
## 내 메모
