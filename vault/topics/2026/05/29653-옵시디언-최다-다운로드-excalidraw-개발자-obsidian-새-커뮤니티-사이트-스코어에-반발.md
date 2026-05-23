---
id: 29653
title: 옵시디언 최다 다운로드 Excalidraw 개발자, Obsidian 새 커뮤니티 사이트 스코어에 반발
url: https://www.youtube.com/watch?v=wedHXARs6n4
domain: youtube.com
author: hyungyunlim
points: 12
comments_count: 2
posted_at: 2026-05-19T11:40:22+09:00
fetched_at: 2026-05-23T15:51:22.136Z
last_seen_at: 2026-05-23T15:51:22.136Z
tags: []
auto_tags:
  - domain/youtube.com
  - type/news
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
Obsidian이 새 커뮤니티 사이트에서 플러그인 보안·품질·유지보수 리뷰를 공개하자, 누적 다운로드 610만(전체의 약 5%)을 기록한 최다 다운로드 플러그인 Excalidraw의 개발자 Zsolt(zsviczian)가 27분짜리 영상으로 개발자 관점의 입장을 밝힘. Obsidian CEO Steph Ango(kepano) 도 곧바로 Reddit에 장문 답글로 응답하며 논쟁이 이어짐.  
  
무슨 일이 있었나  
- Obsidian은 약 4,000개 플러그인 · 누적 다운로드 1억 2천만을 보유. 외부 서드파티 리뷰 사이트들이 우후죽순 등장하며 보안 이슈를 부각시키자, 공식적인 대응이 불가피해진 상황  
- 신규 커뮤니티 사이트는 품질(quality), 유지보수(maintenance), 보안/코드 품질(security) 등 자동화된 스코어카드를 공개  
- 자동 리뷰는 작년부터 공개해 온 obsidianmd/eslint-plugin 기반이며, 2025년 6월부터 Discord 채널에서 개발자들과 협의해 옴  
- Excalidraw는 초기 점수 약 38~40% → "high risk"로 표시. Zsolt는 "내 인생의 작품이 더럽혀진 느낌"이라 표현  
  
Zsolt의 주장  
- "스캐너 점수 vs 현실"의 간극 — 외부 링크 ~100개가 위험으로 분류됐지만, 실제로는 OCR/AI 옵트인, 도움말 영상, 스크립트 스토어 링크 등으로 악성 의도 0  
- Obsidian API의 한계로 우회 코드가 불가피 — PDF 인쇄용 Electron API, MathJax SVG export, 폰트/멀티에셋 배포 부재 → 우회 구현이 곧바로 "high risk"로 표시됨  
- 취미 개발자에게 상업적 기준을 요구 — 풀타임 아닌 0.1인 프로젝트인데 갑자기 엔터프라이즈급 품질 기대치를 받음  
- 유료 플러그인 프레임워크 부재 — 110,000명 정기 사용자 중 후원자는 약 100명(0.09%). Ko-fi 외엔 수익화 경로 없음  
- 클로즈드 소스로의 역행 우려 — 스캔을 피하려고 비공개 전환하는 인센티브가 생김  
- 신뢰의 진짜 기준은? — "보안 리뷰보다 플러그인의 수명, 지원 수준, 개발자와의 연결성이 더 중요"  
- 본인은 4일간 작업해 점수를 78%까지 끌어올림  
  
Steph Ango(kepano)의 답변 — Reddit 292 likes  
- 출시 1개월 전 알파 테스터(Zsolt 포함)에게 신규 사이트·대시보드·공지 모두 공유했고, 개발자 피드백으로 수백 건 반영. 단, Zsolt는 이 기간에 응답이 없었음  
- 기존 인기 플러그인(Excalidraw 포함)은 "grandfathered" 처리되어 신규보다 느슨한 규칙 적용  
- 클로즈드 소스 신규 플러그인은 당분간 미승인, 기존 클로즈드는 유지  
- 유료 플러그인 정책·라벨·필터링 신설했지만, iOS/Android 정책상 인앱 결제 강제는 불가  
- Obsidian 자체도 유료 Sync/Publish 사용자가 약 1%에 불과 — Big Tech가 무료 소프트웨어 인식을 굳혀버린 구조적 문제"  
- 자신도 과거 인기 테마/플러그인 개발자였기에 "발 밑의 플랫폼이 변하는 고통"에 공감  
  
커뮤니티 반응  
- "공급망 공격이 일상인 시대에 사용자 책임론은 다소 안일하다" (mesarthim_2, 112 likes)  
- "객관적 측정을 개인 공격으로 받아들였다. 점수가 마음에 안 들면 점수를 고치는 게 정답" (DeliriumTrigger)  
- "오픈소스 커뮤니티 자체가 '무료가 당연하다'는 인식에 일조했다. 좋은 소프트웨어로 부자가 되는 게 부끄러울 일이 아니다" (mesarthim_2)  
- "구독은 피로하다. 일회성 라이선스 + 자체 호스팅 Sync 패키지가 더 끌린다" (rg_software)  
- "AI가 플러그인 개발 진입장벽을 낮춘 만큼 보안 감사는 필수" (Legal_1425)  
  
왜 중요한가  
- "100만 사용자 × 4,000 플러그인 × 7명 코어팀"의 비대칭 구조 — Obsidian 사례는 작은 팀이 운영하는 모든 오픈 에코시스템(VSCode, Raycast, Logseq 등)의 거버넌스 딜레마를 그대로 보여줌  
- 보안 투명성을 높이려는 시도가 취미 개발자 번아웃 → 클로즈드 소스 회귀 → 생태계 폐쇄라는 역설로 이어질 수 있음  
- 핵심 질문은 결국: "공짜 점심은 없다. 누가 비용을 지불할 것인가?"  
  
#### 원문  
- 💬 Reddit: https://www.reddit.com/r/ObsidianMD/comments/1tg4e3c/excalidraw_plugin_developer_the_future_of/  
- 📋 Obsidian 공식 발표: [The Future of Plugins](https://obsidian.md/blog/future-of-plugins/)

<!-- USER:NOTES -->
## 내 메모
