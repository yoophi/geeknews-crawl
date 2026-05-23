---
id: 29794
title: "Show GN: 조금씩 생기는 운영 CS 클로드로 자동화하기"
url: https://github.com/dohyeon5626/claude-cs-automation
domain: github.com
author: dohyeon5626
points: 1
comments_count: 0
posted_at: 2026-05-23T21:31:40+09:00
fetched_at: 2026-05-23T15:49:41.908Z
last_seen_at: 2026-05-23T15:49:41.908Z
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
요새 회사에서 여러 개의 프로젝트를 병행하다 보니 CS관련해서 힘든 점이 많더라고요.  
그래서 그냥 출근 후 제 맥북에 웹 서버 틀어놓고, 운영 담당자가 거기 접속해서 작은 CS 는 자동화할 수 있도록 간단하게 만들어 봤습니다.  
  
> 예) "어제 주문 중 배송 안 된 건 몇 개야?" → SQL 자동 생성 → DB 조회 → 표로 정리해 답변  
예) "이 기능 어떻게 설정돼 있지?" → 레포 코드 탐색 → 답변  
  
로컬에 있는 Claude Cli를 사용하도록 해두어서 따로 api key는 필요없습니다. 그냥 다운받고 config.yml에 정보만 간단히 작성 후 사용하면 됩니다. 어차피 어제부터 만든거라 그렇게까지 뭔가가 많진 않고 제가 사용할 용도를 기준으로 만들어서 큰 건 없습니다. 코드 좀 수정해서 자신 프로젝트에 맞게 써도 좋을 것 같습니다.  
(단순하게 사내에서 사용할 용도이고, 지금은 레포지토리 하나 + MySQL 만 지원하도록 만들어졌고 바꿔나갈 계획입니다.)  
  
  
#### 어떻게 동작하나  
운영자가 브라우저로 접속해 자연어로 질문 → 서버의 Claude CLI 가 해당 서비스의 GitHub 레포 코드(매번 Pull)와 DB 스키마를 보고 SELECT 쿼리 작성 → 서버가 안전 검증(SELECT 전용, LIMIT 1000, 30초 timeout) 후 실행 → 결과를 Markdown 으로 정리해서 답변.

<!-- USER:NOTES -->
## 내 메모
