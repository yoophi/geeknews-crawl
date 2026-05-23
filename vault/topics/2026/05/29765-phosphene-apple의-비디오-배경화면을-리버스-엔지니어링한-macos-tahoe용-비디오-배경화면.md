---
id: 29765
title: Phosphene - Apple의 비디오 배경화면을 리버스 엔지니어링한 macOS Tahoe용 비디오 배경화면 엔진
url: https://github.com/kageroumado/phosphene
domain: github.com
author: neo
points: 1
comments_count: 1
posted_at: 2026-05-23T00:34:42+09:00
fetched_at: 2026-05-23T15:50:37.087Z
last_seen_at: 2026-05-23T15:50:37.087Z
tags: []
auto_tags:
  - domain/github.com
  - type/GN+
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
- **Phosphene**은 사용자가 가진 비디오 파일을 macOS 데스크톱과 잠금 화면 배경화면으로 재생하는 **메뉴 막대 앱 + 배경화면 확장**임
- 시스템의 기본 배경화면 선택기에 통합되어, 추가한 비디오가 **System Settings → Wallpaper**에서 Apple 내장 Aerials와 함께 표시됨
- Apple의 비공개 **WallpaperExtensionKit** 위에 만들어졌고, Apple Aerials와 같은 방식으로 out-of-process 재생, 앱 종료 후 유지, 잠금 화면·유휴·잠자기 생명주기 연동을 제공함
- MP4, MOV, AVFoundation이 읽을 수 있는 파일을 가져올 수 있으며, 여러 디스플레이와 Space별 배경화면 선택은 macOS가 저장함
- 루프 경계에서 **PTS/DTS**를 오프셋해 프레임 단위로 이어 붙이는 방식으로 flush나 끊김 없는 **gapless looping**을 구현함
- `PlaybackPolicy`가 열 상태, 배터리 잔량, 배터리/AC 전원, Game Mode, 표시 모드, 사용자 일시정지, 가림 상태 등을 합쳐 `full / reduced / minimal / paused` 중 하나로 재생 동작을 결정함
- 모든 디스플레이가 창으로 완전히 가려지면 렌더링을 멈추고, 데스크톱이 다시 보일 때까지 재생을 일시정지함
- 선택적으로 낮은 해상도·낮은 fps의 **adaptive variants**를 미리 만들 수 있고, 렌더러가 루프 경계마다 현재 정책을 만족하는 가장 저렴한 변형으로 교체함
- *Only on Lock Screen* 설정에서는 잠금·해제 시 cubic curve로 배경화면이 자연스럽게 나타나고 사라져 Apple Aerials 동작과 맞춤
- 앱 쪽은 SwiftUI 메뉴 막대 앱으로 비디오 라이브러리, 비디오별 메타데이터, HEVC 최적화, 환경설정, 라이브러리 변경 Darwin notification을 담당함
- 확장 쪽은 시스템 `WallpaperAgent` 안에서 실행되며, 런타임에 `WallpaperExtensionKit.framework`를 로드하고 `AVSampleBufferDisplayLayer`로 원격 `CAContext`에 프레임을 렌더링함
- `AVPlayerLayer`가 원격 `CAContext` 안에서 조용히 실패하기 때문에, `VideoRenderer`는 `AVAssetReader`와 `AVSampleBufferDisplayLayer`를 직접 구동해 단조 증가하는 타임라인을 유지함
- `WallpaperSnapshotXPC` swizzle과 `Mirror` 기반 XPC 파싱에 의존하므로, Apple이 비공개 타입이나 필드명을 바꾸면 스냅샷·요청 처리 쪽이 깨질 수 있음
- 요구 사항은 **macOS Tahoe 26.0+**, Apple Silicon, Xcode 17+이며, `arm64-apple-macos26.0`을 대상으로 Swift 6 strict concurrency가 활성화되어 있음
- 라이선스는 **MIT**이며, 보증 없이 자유롭게 사용할 수 있다고 명시됨

<!-- USER:NOTES -->
## 내 메모
