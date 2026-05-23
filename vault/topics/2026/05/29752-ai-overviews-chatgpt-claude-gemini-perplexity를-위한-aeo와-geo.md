---
id: 29752
title: AI Overviews, ChatGPT, Claude, Gemini, Perplexity를 위한 AEO와 GEO
url: https://www.trevorlasn.com/blog/aeo-geo-vs-seo-google-ai-optimization
domain: trevorlasn.com
author: neo
points: 5
comments_count: 0
posted_at: 2026-05-22T09:43:01+09:00
fetched_at: 2026-05-23T15:50:49.105Z
last_seen_at: 2026-05-23T15:50:49.105Z
tags: []
auto_tags:
  - domain/trevorlasn.com
  - type/GN+
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
- 검색 결과는 더 이상 링크 목록이 아닌 **AI가 사용자를 대신해 읽는 소스 페이지** 형태로 변화 중이며, AI Overviews·ChatGPT·Claude·Perplexity·Gemini가 모두 웹 페이지를 실시간으로 참조함  
- **AEO(Answer Engine Optimization)** 는 답변 엔진이 직접 답을 줄 때 인용되는 소스가 되기 위한 작업, **GEO(Generative Engine Optimization)** 는 생성형 AI가 작성하는 답변 안에 등장하기 위한 작업  
- Google은 자체 AI 최적화 가이드에서 두 개념을 **기존 SEO의 변형**으로 규정하며, 동일한 랭킹·품질 시스템이 일반 검색과 AI Overview 모두를 결정한다고 명시  
- AI 기능 노출의 전제는 일반 검색 스니펫 자격이며, **크롤링·렌더링·인덱싱 차단** 문제 해결이 콘텐츠 최적화보다 우선  
- 인용되는 페이지는 모델이 학습 데이터만으로 작성할 수 없는 **구체적 수치·고유 경험·독자적 디테일**을 담은 페이지이며, AEO/GEO는 SEO와 분리된 학문이 아닌 동일한 작업의 연장선  
  
---  
  
### AEO와 GEO의 정의와 위치  
  
- 2년 전과 달리 Google은 AI Overviews로 검색 결과를 열고, ChatGPT와 Claude는 실시간 웹 결과를 답변에 끌어옴, Perplexity는 이 방식 자체로 제품을 구축, Gemini는 모든 Google 표면에서 한 번의 탭으로 접근 가능  
- 페이지는 더 이상 **목적지가 아니라 모델이 사용자를 대신해 읽는 소스**  
- **AEO (Answer Engine Optimization)**: 답변 엔진이 링크 목록 대신 직접 답을 줄 때 사용되는 소스가 되는 작업  
- **GEO (Generative Engine Optimization)**: 생성형 AI가 페이지를 참조해 처음부터 작성하는 답변 안에 등장하는 작업  
- Google의 AI 최적화 가이드는 “생성형 AI 검색을 위한 최적화는 검색 경험을 위한 최적화이며, 따라서 여전히 SEO”라고 규정  
  - 파란 링크 목록을 결정하는 랭킹·품질 시스템과 AI Overview 노출을 결정하는 시스템이 동일  
  - 한쪽을 개선하면 다른 쪽도 함께 개선됨  
- 각 AI 표면은 서로 다른 웹 인덱스를 사용하지만, 대부분의 인덱스가 **동일한 크롤·렌더링·품질 작업의 하위 결과물**  
  
### 자격(Eligibility)이 모든 것에 앞선다  
  
- 페이지가 AI 기능에 노출되려면 **일반 검색 스니펫에 노출될 자격**이 먼저 충족되어야 함  
  - URL이 인덱싱되어 있어야 함  
  - `robots.txt`에서 크롤링이 허용되어야 함  
  - 스니펫이 허용되어야 함 (`nosnippet`, `max-snippet:0` 없음)  
  - 무거운 JavaScript 실행 없이 콘텐츠가 로드되어야 함  
- Google Search Console의 URL 검사에서 “Test live URL”로 렌더링된 HTML 확인 필요  
  - 렌더링된 HTML에 본문이 빠져 있으면 다른 작업보다 먼저 수정해야 함  
  - **서버 렌더링과 정적 생성**이 가장 안전한 방식  
- 터미널 `curl` 테스트는 30초짜리 점검 도구로 사용 가능하지만, **UA 스푸핑된 200 OK는 실제 크롤러 접근의 증거가 아님**  
  - 봇 운영자는 UA 스푸핑을 차단함  
  - 권위 있는 검증은 게시된 IP 범위 또는 reverse-DNS 기록으로 확인해야 함  
  - Google, OpenAI, Anthropic, Perplexity 모두 봇 문서에서 IP 범위 공개  
  
#### 학습용 크롤러와 검색용 크롤러의 구분  
  
- **GPTBot, ClaudeBot**: 학습용 크롤러이며 차단해도 검색 노출에 영향 없음  
- **Google-Extended**: AI 학습 + Gemini Apps와 Vertex AI Grounding 내 grounding 제어, Google 검색 랭킹이나 AI Overview 자격에는 영향 없음  
- AI 답변 내 노출을 결정하는 검색 인덱서:  
  - `Googlebot`, `Bingbot`, `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`  
- 많은 사이트가 이 중 하나를 실수로 차단해 가시성을 떨어뜨림  
- AI 검색 가시성을 허용하면서 학습용 봇은 차단하는 **`robots.txt` 구성 가능**  
- 메타 robots 태그는 사이트 단위가 아닌 **페이지 단위 제어 수단**  
- `Google-Extended` 옵트아웃은 `robots.txt` 토큰으로만 가능, 메타 태그로는 문서화되어 있지 않음  
- 모든 레이어가 게이트이며, **모든 게이트가 열려야 그 이후의 최적화 작업이 의미를 가짐**  
  
### 인용되는 콘텐츠는 모델이 학습 데이터만으로 못 쓰는 것  
  
- 생성형 검색은 **구체성**에 보상함  
  - 일반적 정보는 모델이 인용 없이 요약 가능  
  - 인용되는 페이지는 모델이 스스로 합성할 수 없는 내용을 담은 페이지  
- Google 가이드는 **“고유하고 가치 있으며 사람 중심의 콘텐츠”** 작성을 강조, 다른 페이지가 똑같이 말하는 commodity 콘텐츠는 지양  
- Helpful content 가이드는 **직접 경험, 실제 전문성, 독자적 관점**을 보여주는 방법을 다룸  
- Next.js 16 마이그레이션 글 예시 비교  
  - Commodity 버전: 모델이 학습 데이터만으로 생성 가능 → 인용되지 않음  
  - Distinctive 버전: **47개의 깨진 페이지**라는 수치, 함수 시그니처의 특정 함정, **3시간**이라는 시간 추정 포함  
  - 이런 디테일 하나만 있어도 “학습 데이터 요약” 페이지에서 “인용 참조” 페이지로 전환됨  
  
### 깨끗한 기술 구조가 크롤러와 모델 모두를 돕는다  
  
- **Semantic HTML** 사용 필수  
  - 의미 있는 계층의 실제 heading 레벨 사용  
  - 페이지 주제에 대한 답을 상단 가까이 배치  
  - 서두 아래 콘텐츠를 묻어두지 않기  
- 개선된 버전은 `article`, `h1`, `section`, `h2` 같은 명확한 구조 제공  
  - 크롤러에게는 구조를, 모델에게는 heading·lede·body의 깨끗한 경계를 제공  
- **Core Web Vitals**가 랭킹에 반영되고, 랭킹이 다시 AI 기능 자격에 직접 반영됨  
  - 랭킹 알고리듬이 보는 수치는 **실제 Chrome 사용자의 28일 필드 데이터(CrUX)**, 로컬 Lighthouse 결과 아님  
  - JavaScript의 `web-vitals`로 로컬 테스트와 Google 시스템 측 데이터를 정렬 가능  
  
#### 가이드가 부인하는 "최적화 꼼수"  
  
- **`llms.txt` 파일 추가는 랭킹 신호가 아니며 Google의 AI 기능이 사용하지 않음**  
- 콘텐츠를 잘게 청크화하거나 모든 heading을 질문 형태로 바꾸는 작업은 불필요 (모델은 페이지 전체의 컨텍스트를 읽음)  
- 구조화 데이터는 문서화된 rich result를 지원할 때 유용하지만, AI 기능 노출에 필수는 아님  
- 그 시간을 **실제 콘텐츠 품질과 렌더링**에 투자할 것  
  
### 비주얼·스키마·커머스 데이터는 구조화 파이프라인  
  
- AI Overviews는 고품질 이미지·비디오를 직접 끌어옴  
  - **실제 스크린샷, 실제 다이어그램, 짧은 비디오 워크스루**가 스톡 이미지보다 유용  
  - 기존 이미지 SEO 기본 적용: 설명적인 `alt` 텍스트, 의미 있는 파일명, 도움이 되는 캡션  
- Alt 텍스트 비교 예시 (Next.js 성능 글)  
  - 두 번째 버전이 AI Overview 이미지 캐러셀에 끌려가는 이유는 **이미지가 무엇을 입증하는지 모델이 이해할 만큼 충분히 설명적**이기 때문  
- 구조화 데이터는 특정 rich result를 지원할 때 추가할 가치가 있음  
  - Recipe, Product, FAQ, Event, **Article** 스키마 모두 일반 검색에서 문서화된 효과 보유  
  - AI 기능이 사용하는 동일한 이해 레이어에 입력됨  
  - 배포 전 **Rich Results Test**로 필수 필드 누락·오류 확인  
  
#### 로컬 비즈니스와 커머스의 핵심 표면  
  
- **Google Business Profile**: 인증된 프로필이 영업시간, 위치, 서비스, 리뷰를 로컬 AI 답변에 공급  
- **Merchant Center**: 피드가 AI Overviews의 제품 정보 출처  
- AI 최적화 가이드가 이 두 가지를 비즈니스·커머스 결과의 **주요 입력**으로 명시  
  
### 에이전트 경험이 다음 표면  
  
- 자율 에이전트가 사용자를 대신해 브라우징하는 시대  
  - Claude with computer use, ChatGPT Operator, Perplexity의 assistant  
- Google AI 최적화 가이드는 에이전트가 DOM, 컨트롤, 콘텐츠를 어떻게 해석하는지 고려할 것을 권고  
- 혼란스러운 마크업, 숨겨진 컨트롤, 이미지로만 렌더링된 핵심 정보를 가진 사이트는 에이전트가 다루기 어려움  
- 스크린리더용 **접근성 작업**이 동일한 영역을 대부분 커버  
- 예약 페이지 인터랙티브 컨트롤 before/after 예시  
  - 개선 버전은 에이전트에게 세 가지를 전달: 제출 버튼임, 액션은 “Confirm booking”, 아이콘은 장식임  
  - 예약 확정 버튼을 식별 못 하는 에이전트는 포기하고 다른 사이트로 이동  
- 폼 필드도 동일 원리: 에이전트는 `name`, `id`, `aria-label`, 주변 `&lt;label&gt;` 요소를 읽음  
- `type="datetime-local"`로의 전환은 작은 변경이지만 브라우저와 에이전트 모두에 **네이티브 datetime picker와 구조화된 값 처리** 제공  
  - 에이전트가 포맷을 추측할 필요 없음  
  
### 측정 가능한 것을 측정하고, 불가능한 것을 좇지 말 것  
  
- **Search Console**이 여전히 Google 측 데이터의 진실 공급원  
  - AI Overviews와 AI Mode 트래픽은 표준 Web performance 리포트에 통합  
  - impressions와 clicks가 확인할 지표  
- **Bing Webmaster Tools**가 Bing과 Copilot의 동등한 도구 제공  
- 신중하게 도출 가능한 추론: Performance를 `how`, `what`, `why`, `is`, `can` 같은 대화형 시작어를 포함한 쿼리로 필터링  
  - 이런 long-tail 쿼리가 AI Overviews를 유발하는 종류  
  - 해당 쿼리의 **impressions 대비 clicks의 눈에 띄는 변동**은 페이지가 방문 대신 AI 답변 내에서 요약되고 있을 가능성과 일치  
  - 단, 이것은 증거가 아닌 가설로 사용해야 함 (레이아웃 변경, 랭킹 변동, 쿼리 믹스 변화, 계절성도 유사한 패턴 발생 가능)  
- 모델 인용 여부 직접 테스트 방법  
  - 각 표면을 열고 콘텐츠가 답해야 할 질문 입력  
  - 도메인이 inline 소스 목록이나 답변 인용에 등장하면 검색되고 있는 상태  
  - 주요 표면에서 비즈니스 관련 주제로 몇 주마다 반복  
  - **백링크처럼 cite-event 수를 추적**  
  
### 결론: AEO와 GEO는 SEO와 분리된 학문이 아님  
  
- 위의 작업은 Google AI 최적화 가이드의 권고와 다른 AI 검색 표면이 보상하는 모든 것을 커버  
- AEO와 GEO는 SEO와 분리된 별개 분야가 아닌, **콘텐츠 독창성, 렌더링, 모든 AI 표면에 입력되는 구조화 파이프라인**에 더 날카로운 주의를 기울인 동일한 작업

<!-- USER:NOTES -->
## 내 메모
