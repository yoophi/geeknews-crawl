---
id: 29728
title: Google이 이제 우리를 싫어하는 것 같다
url: https://twitter.com/pokemoncentral/status/2057123807404638250
domain: twitter.com
author: xguru
points: 7
comments_count: 4
posted_at: 2026-05-21T10:58:55+09:00
fetched_at: 2026-05-23T15:51:02.109Z
last_seen_at: 2026-05-23T15:51:02.109Z
tags: []
auto_tags:
  - domain/twitter.com
  - type/GN+
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
- **Pokémon Central Wiki**는 15년 넘게 이탈리아어 Pokémon 정보의 주요 출처였지만, 현재 Google 검색 결과에서 거의 사라짐
- wiki.pokemoncentral.it는 **MediaWiki** 기반의 대형 위키인데도 `site:` 검색 결과가 문자 그대로 4개만 반환됨
- 색인 급감은 **2026년 3월 core update** 전후에 시작됐고, Search Console에는 `"crawled - currently not indexed"`가 대량으로 표시됨
- Bing, DuckDuckGo 등은 정상 색인 중이라 **Google 한정 문제**로 보이며, Google-Extended 차단은 문서상 색인에 영향이 없어야 함
- 서버·Cloudflare 설정, Open Graph와 schema.org 태그, SWR 등 최적화를 적용했지만 아직 효과가 없고 원인은 불명확함

---

### Google 검색 색인 급감
- **Pokémon Central Wiki**는 15년 넘게 이탈리아어 Pokémon 정보의 가장 잘 알려진 출처였지만, 현재 Google 검색 결과에 거의 나타나지 않음
- [wiki.pokemoncentral.it](http://wiki.pokemoncentral.it)는 Wikipedia에 쓰이는 오픈소스 소프트웨어 **MediaWiki**로 운영되며, [Wikistats 기준](https://wikistats.wmcloud.org/largest_html.php?s=good_desc&th=0&lines=1000) 전 세계 상위 500대 MediaWiki 인스턴스 중 하나임
- PCW는 [Encyclopaediae Pokémonis](https://www.encyclopaediae-pokemonis.org) 국제 위키 네트워크의 일부이며, 이 네트워크에는 **Bulbapedia**도 포함됨
- 많은 콘텐츠는 허가를 받아 Bulbapedia에서 번역됐고, 수천 명의 인간 자원봉사자가 작업에 참여함
- 다른 EP 위키들은 커뮤니티 확인과 `site:` 검색 기준으로 정상 색인되고 있음
- PCW에 대해 `site:http://wiki.pokemoncentral.it` 검색을 하면 현재 결과가 **4개**만 반환됨
- 몇 주 전 **2026년 3월 core update** 전후로 Google Search Console에서 많은 페이지가 `"crawled - currently not indexed"` 상태로 나타나기 시작함
- Google은 해당 페이지가 앞으로 색인될 수도 있고 아닐 수도 있다고만 표시하며, 구체적인 이유는 제공하지 않음

### 확인한 원인과 대응
- 콘텐츠 품질 저하나 운영 문제로 보기는 어려움
  - 편집 정책 변경, 남용, 품질 저하가 없었음
  - 5xx 오류 같은 순수 기술 문제라면 Google Search Console에 다른 형태로 표시됐을 가능성이 큼
- **Google에 한정된 문제**로 보임
  - Bing, DuckDuckGo, 기타 검색엔진은 PCW를 정상적으로 색인하고 있음
- Cloudflare를 통해 AI 학습용 스크레이퍼는 차단하고 있음
  - 사용자 질의에서 PCW를 근거 자료나 참조로 쓰려는 AI 봇은 차단하지 않음
  - `robots.txt`에서 **Google-Extended**를 차단하지만, Google 문서상 이는 검색 색인에 영향을 주지 않아야 함
- Cloudflare의 managed challenge는 페이지 이력, 기술 페이지 등 색인에 중요하지 않은 섹션에만 적용됨
  - 이 섹션들은 `robots.txt`에서 명시적으로 허용되지 않음
  - 해당 페이지들은 캐시하기 어렵고 서버 자원을 많이 사용함
  - 봇들이 분당 수천 건의 요청을 보내 서버에 과부하를 일으킴
- 서버와 Cloudflare 설정을 조정해 사이트 속도를 높였음
  - 최근 몇 주 동안 적용 가능한 정직한 SEO와 최적화 모범 사례를 반영함
  - **Claude Code**로 Open Graph와 [schema.org](http://schema.org) 태그를 반복 개선함
  - Cloudflare **SWR**을 동작하게 해 대부분의 요청이 서버를 거치지 않고 엣지에서 밀리초 단위로 제공되며 백그라운드에서 재검증되도록 함
- 이런 변경은 아직 효과를 내지 못함
  - 변경 반영에는 몇 주가 걸릴 수 있고, Google은 불투명해 실제 효과 여부를 바로 확인하기 어려움
- 가능한 추정은 Google이 알고리듬을 조정하면서 AI 시대에 PCW의 “콘텐츠 품질”을 충분하지 않다고 판단했을 가능성임
  - LLM들은 차단 이전에 이미 PCW 텍스트로 학습됐을 가능성이 있음
  - PCW 콘텐츠를 그대로 많이 복사한 다른 사이트들은 여전히 검색 결과에 남아 있음
  - PCW 콘텐츠는 **CC BY-NC-SA** 라이선스라 일반적으로 복사 자체가 문제가 되지는 않음
- 충성도 높은 방문자들은 상황을 이해하지 못해 문의하고 있으며, [Reddit](https://www.reddit.com/r/TruePokemon/comments/1t6eg21/pokémon_central_wiki/)에도 관련 글이 올라옴
- 현재는 직접 방문할 수 있도록 [wiki.pokemoncentral.it](http://wiki.pokemoncentral.it)를 북마크하라고 안내하고 있음
- Google 내부에서 확인할 수 있는 사람에게 닿아 무슨 일이 일어나는지 이해하길 바라고 있음

<!-- USER:NOTES -->
## 내 메모
