---
id: 29793
title: "Show GN: 떠오른 아이디어를 바로 기획문서로 바꿔주는 /idea2planning"
url: https://github.com/pentaxzs/skill-idea2planning
domain: github.com
author: pentaxzs
points: 6
comments_count: 0
posted_at: 2026-05-23T18:48:58+09:00
fetched_at: 2026-05-23T15:49:42.909Z
last_seen_at: 2026-05-23T15:49:42.909Z
tags: []
auto_tags:
  - domain/github.com
  - type/show
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
Product Manager와 Product Designer가 자주 마주하는 과제 중 하나는,  
막연한 아이디어를 1-pager, PRD, 와이어프레임 같은 구조화된 기획 문서로 구체화하는 일입니다.   
  
이번에 만든 /idea2planning 스킬은, 그동안 IT 업계에서 실제로 사용해왔던 다양한 기획 문서들을 기반으로 템플릿과 작성 흐름을 학습시켜 제작했습니다.   
  
물론 좋은 결과물을 위해서는 문제 정의, 목표, 사용자 상황 같은 핵심 질문과 답변이 함께 필요합니다.  
하지만 스킬이 던지는 질문들을 따라가다 보면, 자연스럽게 보다 명확하고 실행 가능한 기획안에 도달할 수 있도록 구성했습니다. 🔵  
  
프로젝트는 아래 GitHub에 공개해두었습니다.   
https://github.com/pentaxzs/skill-idea2planning  
  
Claude Code의 커스텀 스킬 기능을 활용하면 /idea2planning 명령어로 바로 사용할 수 있습니다.   
  
주요 기능  
3단계 자동 변환 파이프라인을 제공하며,  
아이디어 입력값을 기반으로 1-pager → PRD → ASCII 와이어프레임 순서로 단계별 산출물을 생성합니다.   
  
간편한 설치 구조  
~/.claude/skills/idea2planning 경로에 설치 후 Claude Code를 재시작하면 /idea2planning 명령어로 즉시 사용할 수 있습니다.   
  
5가지 사용 시나리오 제공  
문서별 개별 생성, 처음부터 순차 진행, 아이디어 상담 기반 진행 등 다양한 방식으로 활용할 수 있습니다.   
  
예시 기반 품질 관리  
references 폴더에 조직의 실제 예시 문서(1pager_example04.md, prd_example04.md 등)를 추가하면, Claude가 이를 참고해 결과물 스타일과 품질 기준에 반영합니다. 별도의 SKILL.md 수정은 필요하지 않습니다.   
  
확장 가능한 구조  
템플릿, 작성 원칙, 예시 파일 등을 분리해두어 팀 단위 개선이나 PR 기반 확장이 쉽도록 구성했습니다.   
  
기술적으로는 Claude의 context window와 instruction-following 능력을 활용해 구조화된 산출물을 생성하며, 사용자가 추가한 예시 문서를 RAG 방식처럼 참조해 조직 맞춤형 결과를 만들어냅니다.   
  
주니어부터 시니어까지 PM·PD 직군이 보다 빠르고 일관된 수준의 기획 문서를 작성할 수 있도록 설계해보았습니다.   
  
해당 스킬을 만들게 된 과정과 구현 방식은 아래 링크에도 정리해두었습니다.  
https://brunch.co.kr/@monglec/177

<!-- USER:NOTES -->
## 내 메모
