---
id: 29761
title: Firefox의 Web Serial 지원 발표
url: https://hacks.mozilla.org/2026/05/web-serial-support-in-firefox/
domain: hacks.mozilla.org
author: neo
points: 3
comments_count: 1
posted_at: 2026-05-22T15:03:44+09:00
fetched_at: 2026-05-23T15:50:40.093Z
last_seen_at: 2026-05-23T15:50:40.093Z
tags: []
auto_tags:
  - domain/hacks.mozilla.org
  - type/GN+
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
- **Firefox 151 데스크톱**부터 Web Serial API를 지원해 웹 앱이 네이티브 소프트웨어 없이 호환 직렬 장치와 통신할 수 있음
- **Web Serial**은 JavaScript로 직렬 장치를 읽고 쓰는 API로, 마이크로컨트롤러·3D 프린터·전력계 등에 직접 연결 가능함
- Adafruit 워크플로에서는 Web Serial로 펌웨어를 전달해 **CircuitPython**을 설치하고, `code.py` 파일로 장치 코드를 쉽게 배포함
- Firefox는 명시적 사용자 허용, 사이트별·포트별 권한, **애드온 게이팅**으로 장치 접근의 보안·개인정보 보호 위험을 줄임
- Mozilla는 WICG 단계의 Web Serial을 **WHATWG 표준화**로 추진하며, 실제 하드웨어 워크플로 테스트와 피드백을 요청함

---

### Web Serial API와 지원 범위
- **Firefox 151 for Desktop**부터 Web Serial API를 지원해 웹 애플리케이션이 네이티브 소프트웨어 없이 호환 장치와 통신할 수 있음
- [Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API)는 웹사이트가 JavaScript로 직렬 장치를 읽고 쓸 수 있게 하는 웹 API임
- 대상 장치는 마이크로컨트롤러, 개발 보드, 3D 프린터, 전력계, 기타 직렬 연결 하드웨어를 포함함
- 직렬 호환 장치에는 **Espressif ESP 기반 보드**, Raspberry Pi Picos, 3D 프린터, LEGO 장치 등이 들어감
- 최신 컴퓨터에는 보통 직렬 포트가 없지만, USB 포트에 연결되거나 Bluetooth로 페어링된 장치는 운영체제에서 직렬 포트처럼 보이도록 자신을 직렬 가능 장치로 알릴 수 있음
- Web Serial 호환 장치는 취미 개발자, 하드웨어 해커, 교육자, 메이커, 개발자가 홈 자동화, 하드웨어 프로토타이핑, 3D 프린팅 등에 활용함

### Adafruit와 CircuitPython 워크플로
- [Adafruit](https://www.adafruit.com/)는 오픈소스 하드웨어와 [STEM](https://en.wikipedia.org/wiki/Science,_technology,_engineering,_and_mathematics) 교육 분야에서 Web Serial 활용을 보여주는 대표 조직 중 하나임
- Adafruit는 Web Serial로 펌웨어를 전달해 자사 장치에 [CircuitPython](https://circuitpython.org/)을 빠르게 설치할 수 있게 함
- 설치 후 파일 이름을 `code.py`로 지정하면 대부분의 장치에서 USB 장치로 파일을 끌어다 놓는 방식으로 코드를 배포할 수 있음
- Python 프로그램은 단순한 텍스트 기반 입출력으로 Web Serial을 통해 웹 페이지와 상호운용 가능함
- [Adafruit Web Serial Tool](https://adafruit.github.io/Adafruit_WebSerial_ESPTool/)을 사용할 수 있으며, CircuitPython 사이트의 `OPEN INSTALLER` 방식과는 구분됨
- [example CircuitPython Web Serial project](https://github.com/hafta/circuitpython-webserial-example/)는 로컬 [web page](https://github.com/hafta/circuitpython-webserial-example/blob/main/webserial.html)에서 Web Serial을 사용해 CircuitPython [file](https://github.com/hafta/circuitpython-webserial-example/blob/main/code.py)을 실행 중인 장치로 메시지를 보내는 구조임
- Mozilla는 Adafruit와 협력해 Firefox 구현을 이 커뮤니티에서 흔히 쓰는 실제 하드웨어 워크플로에 맞춰 테스트함
- Mozilla 엔지니어 Alex Franchuk은 Web Serial과 전자 장치를 결합한 [Page Playground](https://adafruit-playground.com/u/afranchuk/pages/page-playground-using-webserial-in-firefox)를 만들었음

### 전력 측정과 홈 자동화
- Mozilla의 Florian Quèze는 [전력 소비 측정을 위한 여러 프로젝트](https://www.youtube.com/watch?v=Ly7ve5ftRnU)를 실험했고, Web Serial로 시판 USB 전력계의 전력 데이터를 읽어 Firefox에 표시하는 [데모](https://serial.combien-consomme.fr/)를 만들었음
- 해당 코드는 데이터를 Firefox Profiler로 내보낼 수 있어 전력 데이터를 시각화하고 공유하기 쉬움
- 관련 리소스는 [page](https://serial.combien-consomme.fr/), [GitHub repo](https://github.com/fqueze/webserial-power-profiling), 세 밝기 모드가 있는 조명의 전력 사용량을 기록한 [Firefox Profiler 데이터](https://share.firefox.dev/4uGxHsg)임
- 테스트된 USB 전력계에는 [AVHzY C3 USB](https://store.avhzy.com/index.php?route=product/product&product_id=53), [Joy-IT TC66C](https://joy-it.net/en/products/JT-TC66C), YZXStudio USB ZY1280이 포함됨
- [Home Assistant](https://www.home-assistant.io/)는 홈 자동화를 위한 인기 오픈소스 프로젝트이며, [ESPHome](https://esphome.io/)은 저렴한 ESP32와 유사 장치에 Home Assistant 호환 펌웨어를 제공함
- ESPHome 펌웨어는 Web Serial을 통해 몇 번의 클릭만으로 설치하고 설정 가능함

### 보안과 개인정보 보호
- 웹 플랫폼이 하드웨어 장치를 읽고 쓸 수 있게 되면 **보안과 개인정보 보호** 우려가 커짐
- Web Serial에서 웹사이트는 사용자가 명시적으로 허용하기 전까지 직렬 포트를 보거나 접근할 수 없음
- 포트 허용은 사이트별·포트별로 이뤄짐
- Web Serial API는 웹사이트가 `navigator.serial.requestPort()`를 호출하도록 요구하며, 사용자는 접근을 허용할 포트를 선택하거나 모든 접근을 거부할 수 있음
- 웹사이트는 연결된 장치 목록을 받지 않으며, 사용자가 선택한 포트 외에는 유용한 지문추적 정보가 제공되지 않음
- Firefox는 사이트가 직렬 포트 접근을 요청하는 시점과 이유를 사용자가 이해하도록 [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) 구현에서 도입한 **애드온 게이팅(add-on gating)** 을 사용함
- 애드온 게이팅은 다른 웹 권한 프롬프트보다 사용자가 무엇을 허용하는지 더 자세히 알려줌
- 애드온 게이팅 프롬프트는 사이트가 처음 포트 접근을 요청할 때 포트 선택 프롬프트보다 먼저 표시됨
- Firefox Enterprise Policies를 사용하는 조직에서는 Web Serial이 기본적으로 비활성화됨
- 관리자는 [DefaultSerialGuardSetting](https://firefox-admin-docs.mozilla.org/reference/policies/defaultserialguardsetting/) 정책 설정으로 조직 전체의 Web Serial 기능을 명시적으로 허용하거나 차단할 수 있음

### 표준화와 피드백
- Web Serial은 아직 **Web Incubator Community Group(WICG)** 단계에 있지만, Mozilla는 범위와 오랜 인큐베이션을 고려할 때 표준화 경로가 있다고 봄
- Mozilla는 [새 Workstream proposal](https://github.com/whatwg/sg/pull/264)을 통해 WHATWG에서 Web Serial API 표준화를 추진 중임
- Mozilla는 주변장치에 대한 웹 접근 방식을 형성하기 위해 생태계 파트너와 표준화 기구와 협력할 계획임
- 장치 기반 Web Serial 워크플로가 있다면 Firefox에서 테스트할 수 있음
- [Mozilla Connect](https://connect.mozilla.org/)에서 프로젝트를 공유하고 질문하거나 피드백을 남길 수 있음
- 기술 문제는 [support.mozilla.org](http://support.mozilla.org)를 확인하거나 [Bugzilla](https://bugzilla.mozilla.org/enter_bug.cgi?product=Core&component=DOM%3A+Device+Interfaces)에 버그를 제출하면 됨

<!-- USER:NOTES -->
## 내 메모
