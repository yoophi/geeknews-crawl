---
id: 29640
title: Datatype - 텍스트를 차트로 변환하는 가변 폰트
url: https://github.com/franktisellano/datatype
domain: github.com
author: xguru
points: 84
comments_count: 27
posted_at: 2026-05-19T09:31:02+09:00
fetched_at: 2026-05-23T15:51:24.139Z
last_seen_at: 2026-05-23T15:51:24.139Z
tags: []
auto_tags:
  - domain/github.com
  - type/news
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
- **"데이터를 타이포그래피로(data as type)"** 라는 컨셉으로, JS/이미지/렌더링 라이브러리 없이 **텍스트만으로 차트 표시**  
- **OpenType 합자 치환**을 활용해 `{b:30,70,50,90}` 같은 단순 텍스트 표현을 인라인 차트로 변환  
- **막대/라인/파이 3가지 차트 유형** 지원  
  - 막대 차트: {b:30,70,50,90,64,27,72,42} 콤마로 구분된 값(각 0–100), 최대 20개 막대  
  - 스파크라인: {l:10,50,30,80,20,15,48,72,37} 콤마로 구분된 값(각 0–100), 최대 20개 포인트  
  - 파이 차트: {p:69} {p:43} 0–100 사이의 단일 백분율 값  
- **폰트 크기**와 **두 개의 가변 축**으로 시각적 조정  
  - Width(wdth): 50–150, 간격 조절, 기본값 100  
  - Weight(wght): 100–900, 선 두께 조절, 기본값 400  
- 글자 사이에서도 렌더링 가능해서 본문 중간, 표 안, 로그 메시지 등 **텍스트가 들어가는 모든 곳**에 그대로 동작  
  - **테이블/대시보드/리포트** 등에도 쉽게 삽입 가능   
- 웹에서는 **3줄 CSS만으로 도입 가능**  
  - `@font-face`로 폰트 로드 → `font-family: 'Datatype'` 지정 → HTML에 `&lt;span class="chart"&gt;{l:20,40,70}&lt;/span&gt;` 작성  
  - `font-variation-settings`로 wdth 등 추가 조정 옵션 제공  
- 데스크톱: TTF 설치 후 OpenType 합자 지원 앱(Adobe 등)에서 사용 가능  
- **[Google Fonts](https://fonts.google.com/specimen/Datatype?preview.script=Latn)에서도 배포** 중이라 별도 호스팅 없이 사용 가능  
- **15개 Named 인스턴스** 제공 (표준 Weight 9개 + 커스텀 너비 조합 6개)  
  - Thin UltraCondensed(50/100), SemiBold Condensed(75/600), Medium Expanded(125/500), Black ExtraExpanded(150/900) 등 용도별 프리셋 포함  
- **글리프 수** 마스터당 10,850개, 총 9개 마스터 구성  
- **파일 크기**: TTF 4.0MB / WOFF2 78KB, 유니코드 커버리지는 Google Fonts Latin Core  
- **브라우저 지원**: Chrome 62+, Firefox 62+, Safari 11+, Edge 17+  
- ## 동작 설명  
  - **OpenType 합자 치환(ligature substitution)** 기능을 활용함  
  - 원래 합자는 `fi`, `fl` 같은 글자 조합을 하나의 글리프로 치환하는 기능  
  - Datatype은 이를 응용해 `{b:30,70,50,90}` 같은 패턴 전체를 하나의 차트 글리프 {b:30,70,50,90} 로 치환  
  - 브라우저나 앱이 폰트 합자 기능만 지원하면 **자바스크립트 실행 없이 즉시 렌더링**  
- SIL Open Font License 1.1  
- [Specimen](https://franktisellano.github.io/datatype/) 사이트에서 실제 적용 사례 확인 가능

<!-- USER:NOTES -->
## 내 메모
