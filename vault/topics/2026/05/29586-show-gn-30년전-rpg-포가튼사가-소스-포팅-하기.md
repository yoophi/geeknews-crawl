---
id: 29586
title: "Show GN: 30년전 RPG (포가튼사가) 소스 포팅 하기"
url: https://forgottensaga-classic.blogspot.com/2026/05/forgottensagaclassic.html
domain: forgottensaga-classic.blogspot.com
author: namyunwoo
points: 50
comments_count: 24
posted_at: 2026-05-17T18:37:00+09:00
fetched_at: 2026-05-23T15:51:34.150Z
last_seen_at: 2026-05-23T15:51:34.150Z
tags: []
auto_tags:
  - domain/forgottensaga-classic.blogspot.com
  - type/show
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
### 포가튼 사가 (1997 한국 DOS RPG) 를 소스포팅 하기   
  
#### 동기  
- 30년 전, 초등학교 때 처음 산 패키지 게임이 포가튼 사가  
- 인생 첫 RPG, 자연스럽게 깊이 빠짐  
- 20년 넘게 잊고 살다가 아직도 사람들이 많이 플레이하고 있다는 사실 알게 됨  
- "이걸 멀티 플랫폼 게임으로 만들 수 없을까?"  
- 남아 있는 건 1997 PE32 실행파일 + 데이터 파일 뿐 (당연히 소스코드는 없음)  
  
#### 접근 방식  
  
- 원본 게임 재현 방법은 크게 두 가지  
  - 스펙 기반 재해석 — 게임플레이 보고 비슷하게 다시 만들기  
  - 원본 함수 단위 충실 복원 — 디컴파일된 코드를 그대로 포팅  
- 후자를 선택. 추측이 아닌 검증된 원본 동작을 따르기 위함  
- 원본은 1997 Windows MSVC   
  
#### 분석한 내용  
  
##### 원본 binary 디컴파일  
  
- Ghidra 12 로 PE32 처리. 937 함수 100% 디컴파일 성공  
- 51,799 줄의 pseudocode C  
  
##### 데이터 포맷 크래킹 (48 종, 모두 검증)  
  
- **LZSS** — 표준 + FAM 변형 (ring init `0x00`, `ref_offset` 비트 배치 다름)  
- **SPB** — 256색 + RLE, 1,155 이미지  
- **MOB** — 캐릭터/NPC 애니메이션 2,699 프레임. `0xA4` header + RLE pixel + frame stride 20B  
- **SCP** — 바이트코드 VM, 128+ opcode, 6,026 entry, 43,036 대화문  
- **FAM** — 292개 맵, 5 layer (base / overlay / collision / ...)  
- **DAT** — CHAR / ITEM 290 종 / MAGIC / ABILITY / MONSTER  
- **SAV** — actor struct `0x2A4` (676B), party + inventory + global vars  
  
  
##### 사용자 입력 직접 검증  
  
- 세이브파일을 직접 파싱해 actor struct offset 검증  
- 이전 잘못된 매핑 (`0x3C` ATK→STR, `0x40` INT→TLT 등) 정정  
  
#### 만들어낸 내용  
  
- Lua 263 파일, 157,277 줄  
- 에셋 3,760 개  
- LÖVE 2D 11.5 데스크톱 빌드 + love.js (emscripten) 웹 빌드  
- 모바일 가상 조이스틱 + 한국어 IME 직접 구현  
- SharedArrayBuffer 활성화 (COOP/COEP via coi-serviceworker)  
- IndexedDB sav 영속화 (브라우저 환경)  
- 배포 채널 5종 — Web / iOS / Android / Windows / macOS  
  
##### 재현 범위  
  
- 타이틀 / 캐릭터 생성 / 필드 / 대화 / 상점 / 인벤토리 / 장비 / 함정 / DETECT·UNLOCK / 세이브 — 완료  
- 전투 시스템 — 진행 중  
  
#### AI 도구 활용  
  
- **GPT 5.5 의 `/goal` 기능 위주**, Claude Code 는 보조 + 실시간 디버그  
  
##### GPT 5.5 `/goal` 역할 — 디컴파일 분석 / 정정 누적  
  
- 원본 함수 cluster / call graph / opcode reference 자동화 분석  
- 데이터 포맷 deep dive (sav format, actor offset, FAM 구조 등)  
- 초기 자동 디코드본의 mislabel 정정 누적 (51,799 줄 정정본)  
  
##### Claude Code 역할 — Lua 포팅 + 즉시 검증 사이클  
  
- 원본 함수 read → Lua 포팅 → `verify.sh` test 실행 (100+ test mode, 1,000+ assertion)  
- 브라우저 환경 디버그 (IDBFS / IME / SharedArrayBuffer 등)  
- 사용자 보고 받으면 디버그 → fix → dev 배포 → 검증 → live 배포 사이클  
  
##### 작업 기간  
  
- 약 1~3 개월  
  
#### 어떤 결과물인지  
  
- **Play (브라우저)**: https://forgottensaga-classic.blogspot.com/2026/05/forgottensagaclassic.html  
- PC / 모바일 모두 동작. 모바일은 가상 조이스틱 + 한국어 IME 자체 구현  
- 원본 게임플레이 충실 재현 — Z 정렬, 팔레트 사이클, NPC 상태머신, SCP VM 등 원본 동작 1:1

<!-- USER:NOTES -->
## 내 메모
