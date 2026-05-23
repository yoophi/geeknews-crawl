---
id: 29715
title: OpenShorts - 무료 오픈소스 클립 생성기 & AI UGC 비디오 제작 도구
url: https://www.openshorts.app/
domain: openshorts.app
author: xguru
points: 25
comments_count: 4
posted_at: 2026-05-21T09:31:01+09:00
fetched_at: 2026-05-23T15:51:07.116Z
last_seen_at: 2026-05-23T15:51:07.116Z
tags: []
auto_tags:
  - domain/openshorts.app
  - type/news
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
- 긴 영상을 **9:16 세로형 바이럴 숏츠**로 자동 변환하는 셀프 호스팅 오픈소스, TikTok·Reels·YouTube Shorts 제작 지원  
- 세 가지 도구를 하나로 통합  
  - **Clip Generator**: 롱폼 영상 → 바이럴 숏츠(9:16)로 변환. 자동으로 최고의 순간을 포착하고 얼굴 트래킹하며 크롭. 자막도 자동 추가   
  - **AI Shorts**: AI 액터를 활용한 UGC 마케팅 비디오 생성. 제품만 설명하면 자동으로 립싱크된 아바타 영상 제작  
  - **YouTube Studio**: 썸네일 생성, 바이럴용 제목·설명 자동 생성, 유튜브 업로드까지 처리   
- **AI 바이럴 모먼트 감지**: Google Gemini 3.0 Flash가 트랜스크립트와 장면 경계 분석, 15~60초 길이 3~15개 포텐셜 클립 추출, 감정적 임팩트·후크 강도·공유 가능성 기반 점수 산정  
- **스마트 9:16 세로 크롭**: 듀얼 모드로 AI가 리프레임  
  - TRACK 모드: MediaPipe 얼굴 감지 + YOLOv8 백업으로 피사체 추적  
  - GENERAL 모드: 단체 샷·풍경에 블러 배경 생성  
- **자동 자막 생성**: faster-whisper 기반 단어 단위 타임스탬프, 스타일링·번인 자동 처리  
- **30개 이상 언어 AI 더빙**: ElevenLabs 연동으로 원본 화자 음성 특성 유지하며 번역  
- **후크 텍스트 오버레이 + AI 비디오 이펙트**: 첫 3초 시선 유도 텍스트, Google Gemini가 동적 FFmpeg 필터 생성으로 색 보정·트랜지션·시각 효과 자동 적용  
- **100% 셀프 호스팅**: Docker 기반 자체 머신 배포, 영상은 사용자 인프라 외부로 유출되지 않으며 API 키는 클라이언트 측 암호화로 서버에 저장 안함   
- **직접 소셜 퍼블리싱**: TikTok·Instagram Reels·YouTube Shorts 대시보드 직접 게시, 비동기 업로드 진행률 추적, S3 클라우드 백업  
- **API 무료 티어를 적극 활용**: Google Gemini 일 1,500 요청 (필수), ElevenLabs·Upload-Post 무료 티어  
- **유료 솔루션을 대체 가능**: Opus Clip·Kapwing 같은 월 $15~228 도구와 동일 기능을 무료·무제한·무워터마크로 제공  
- 기술 스택: Google Gemini 3.0, faster-whisper, YOLOv8, MediaPipe, FFmpeg, ElevenLabs, fal.ai, React + Vite, Docker  
- Repo : https://github.com/mutonby/openshorts  
- MIT 라이선스

<!-- USER:NOTES -->
## 내 메모
