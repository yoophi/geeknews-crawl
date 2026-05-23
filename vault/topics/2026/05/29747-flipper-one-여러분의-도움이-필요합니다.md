---
id: 29747
title: Flipper One — 여러분의 도움이 필요합니다
url: https://blog.flipper.net/flipper-one-we-need-your-help/
domain: blog.flipper.net
author: neo
points: 1
comments_count: 3
posted_at: 2026-05-22T09:23:49+09:00
fetched_at: 2026-05-23T15:50:54.158Z
last_seen_at: 2026-05-23T15:50:54.158Z
tags: []
auto_tags:
  - domain/blog.flipper.net
  - type/GN+
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
- **Flipper One**은 Flipper Zero의 업그레이드가 아니라, vendor 패치 없이 최신 upstream Linux에서 동작하는 열린 ARM 컴퓨터를 목표로 함
- Flipper Zero가 NFC·RFID·Sub-1 GHz 같은 오프라인 접근 제어를 다룬다면, Flipper One은 **Wi-Fi·Ethernet·5G·위성** 등 IP 네트워크 영역을 겨냥함
- `RK3576` 기반 Linux CPU와 `RP2350` MCU를 함께 쓰는 **이중 프로세서 구조**로, Linux가 꺼져도 화면·버튼·전원 제어가 가능함
- Debian 위의 **Flipper OS**는 전체 OS 스냅샷인 프로필을 도입하고, FlipCTL은 `ping`, `nmap` 같은 도구를 작은 LCD용 메뉴 UI로 감쌈
- M.2·GPIO 확장, 5개 네트워크 업링크, NTN 위성 모뎀, 로컬 LLM, 데스크톱·미디어 박스 모드를 추진하지만 **기술·재정 리스크**가 큼

---

### 목표와 성격
- **Flipper One**은 Flipper Zero의 업그레이드가 아니라 별도 목표를 가진 Linux 기반 열린 플랫폼임
- 세계에서 가장 개방적이고 문서화가 잘 된 **ARM 컴퓨터**를 만들고, 최신 upstream Linux 커널에서 vendor 패치 없이 동작하게 하는 것을 목표로 함
- 폐쇄 소스 코드와 **바이너리 블롭**, vendor-locked BSP 의존을 줄이고, 사양을 읽어 컴퓨터가 어떻게 동작하는지 이해할 수 있는 하드웨어 플랫폼을 지향함
- 마이크로컨트롤러와 CPU를 결합한 코프로세서 구조를 채택해, 기존 저수준 MCU 코드 상당량을 포팅해야 하는 비전형적 플랫폼이 됨
- 기존 CLI 유틸리티를 감싸는 자체 GUI 프레임워크로 Linux 사용 방식을 작은 휴대용 장치에 맞게 다시 설계하려 함
- 재정적·기술적으로 매우 어려운 프로젝트이며, 여러 차례 처음부터 다시 만들어진 뒤 개발 과정을 공개하고 커뮤니티 도움을 요청하는 단계에 있음

### Flipper Zero와의 차이
- **Flipper Zero**는 NFC, 저주파 RFID, Sub-1 GHz 라디오, 적외선, iButton, UART, SPI, I²C 같은 오프라인 점대점 접근 제어 프로토콜을 다루는 저전력 마이크로컨트롤러 기반 장치임
- **Flipper One**은 Wi-Fi, Ethernet, 5G, 위성처럼 IP에 연결되는 영역을 다루며, 네트워킹·데이터 전송·고성능 컴퓨팅을 위한 Linux 기반 장치임
- 두 제품은 서로 다른 프로토콜 계층과 사용 목적을 겨냥하므로, Flipper One이 Flipper Zero를 대체하는 관계가 아님

### 열린 Linux 플랫폼
- 현재 ARM Linux 생태계는 폐쇄 부트 블롭, 벤더별 패치, 외부에서 이해하기 어려운 **BSP(board support package)** 에 의존하는 경우가 많음
- **Collabora**와 협력해 Rockchip `RK3576` SoC 지원을 mainline Linux 커널에 넣고 있으며, 목표는 [kernel.org](https://kernel.org/)에서 받은 커널을 vendor 패치 없이 Flipper One에서 실행하는 것임
- 현재 `RK3576` mainline 지원은 주요 구성요소가 동작하는 상태지만, 초기 부팅 중 RAM을 초기화하는 **DDR trainer**가 부트 체인에 남은 마지막 바이너리 블롭임
- 현재 집중 영역은 전원 관리와 USB DisplayPort Alt Mode 지원이며, NPU, 하드웨어 비디오 디코딩, 기타 가속기 드라이버는 아직 완전히 upstream되지 않았음
- 관련 리소스:
  - [RK3576 open source roadmap](https://docs.flipper.net/one/cpu-software/rk3576-mainlining) — 계획과 기여 방법
  - [Open tasks](https://docs.flipper.net/one/open-tasks) — 커뮤니티가 도울 수 있는 작업
  - [RK3576 mainline status](https://gitlab.collabora.com/hardware-enablement/rockchip-3588/notes-for-rockchip-3576/-/blob/main/mainline-status.md) — Collabora가 관리하는 mainline 지원 현황
  - [Collabora blog post](https://www.collabora.com/news-and-blog/news-and-events/collabora-flipper-opening-up-the-rk3576.html) — `RK3576` upstream 지원 협력 내용

### 공개 개발과 Developer Portal
- **Flipper One Developer Portal**은 Flipper One 개발 문서가 모인 공개 위키이며, 누구나 편집할 수 있음
- 코드 공개를 넘어 작업 추적기, 내부 논의, 미완성 문서, 아키텍처 논쟁까지 공개하는 **open development process**를 지향함
- 다듬어진 결과만 공개하는 방식보다 실패한 방향과 논쟁까지 포함할 때 학습 가치가 더 크다고 봄
- [Flipper One Developer Portal](https://docs.flipper.net/one)은 모든 하위 프로젝트의 진입점이며, `help wanted` 작업, 기여 가이드, 개발자 주간 다이제스트 구독을 제공함
- **Developer Portal Manager** 채용도 진행 중이며, 개발팀과 커뮤니티 사이의 프록시 역할, 포털 정리, 기여자 참여 지원을 맡음
- [Developer Portal & Community Manager 지원](https://flipperdevices.com/jobs/?ashby_jid=84d64277-c235-4922-8301-e8e93e8cc536)

### 하드웨어와 소프트웨어 구성
- Flipper One 개발은 전기 하드웨어, 기구 설계, Linux CPU 소프트웨어, MCU 펌웨어, UI/UX, 문서, 테스트로 나뉨
- **Linux CPU Software**는 `RK3576` 프로세서를 위한 커널, 모듈, 드라이버, userspace, bootloader, Rockchip 도구를 포함하며, 여러 저장소에 걸친 가장 크고 복잡한 하위 프로젝트임
- **MCU Firmware**는 `RP2350` 마이크로컨트롤러용 펌웨어로, 디스플레이, 전원 서브시스템, CPU 부팅 과정, 버튼·터치패드 이벤트를 담당함
- **Testing**은 전원, 네트워킹, CPU, 오디오, 그래픽 등 장치 서브시스템과 하드웨어 검증을 위한 스크립트, 프로그램, 인터페이스 프로토타입, 데모, 테스트 앱을 포함함

### 코프로세서 아키텍처
- Flipper One은 고성능 CPU와 저전력 MCU 두 프로세서가 병렬로 동작하는 **이중 프로세서 구조**임
- **고성능 CPU**는 Linux를 실행하는 8코어 `RK3576` SoC이며, Mali-G52 GPU, 로컬 LLM과 모델 실행을 위한 NPU, 8GB RAM을 포함함
- **저전력 MCU**는 2코어 Raspberry Pi `RP2350` 마이크로컨트롤러이며, 디스플레이, 버튼, 터치패드, LED, 전원 서브시스템을 제어하고 자체 [MCU Firmware](https://github.com/flipperdevices/flipperone-mcu-firmware)를 실행함
- MCU만으로도 장치가 동작할 수 있어, Linux가 꺼져 있어도 버튼과 LCD 화면으로 Flipper One을 제어하고 부팅 과정을 구성할 수 있음
- 일반적인 SBC는 Linux가 꺼지면 장치가 사실상 멈추지만, Flipper One은 MCU가 남아 기본 제어를 계속 처리함

### MCU와 CPU 연결
- 두 프로세서는 [Interconnect](https://docs.flipper.net/one/mcu-firmware/mcu-cpu-interconnect)라고 부르는 여러 인터페이스로 통신함
- **SPI**는 framebuffer를 MCU로 보내 디스플레이 출력에 사용하고, **I²C**는 MCU로 명령을 보내며 버튼·터치패드 이벤트를 CPU로 되돌림
- UART와 일부 GPIO 라인은 CPU 부팅 제어를 담당함
- 디스플레이와 입력 드라이버를 Linux 커널에 upstream하려 하며, out-of-tree vendor 해킹 없이 깨끗하게 넣는 것이 목표임
- 커널 커뮤니티가 이 설계를 검토하고 올바른 upstream 방식을 찾는 데 도움을 주길 원함

### Flipper OS와 이동형 Linux
- Raspberry Pi OS 같은 일반 Linux 워크플로에서는 라우터, TV 박스, 로직 애널라이저 등 용도별로 패키지 설치, 소스 컴파일, 시스템 설정 수정, device tree 조정, 커널 패치가 반복되며 시스템이 쉽게 지저분해짐
- 이런 변경을 깔끔하게 되돌리는 방법이 부족해, 새 프로젝트를 시작할 때 SD 카드를 다시 플래시하는 방식에 의존하게 됨
- **Flipper OS**는 Debian 기반 시스템 위에 올라가는 레이어로, 서로 다른 패키지와 설정을 가진 전체 OS 스냅샷인 프로필을 도입함
- 사용자는 프로필을 부팅하고, 복제하고, 망가뜨리고, 필요한 것을 설치한 뒤 깨끗한 복사본으로 돌아갈 수 있음
- 다른 사용 사례를 위해 완전히 다른 프로필로 전환할 수도 있어, SD 카드 교체 없이 이동형 Linux 환경을 운용하는 것을 목표로 함
- Flipper OS는 아직 아키텍처가 100% 확정되지 않은 어려운 프로젝트이며, Raspberry Pi 기반 cyberdeck이나 휴대용 tactical Linux box에도 유용한 개념으로 만들려 함
- [Flipper OS concept](https://docs.flipper.net/one/cpu-software/flipper-os)

### FlipCTL과 작은 화면용 UI
- **FlipCTL**은 Linux 기반 cyberdeck에서 작은 화면용 UI가 부족한 문제를 해결하기 위한 Flipper OS의 일부임
- 많은 장치가 KDE, GNOME 같은 전체 데스크톱 환경을 7인치 터치스크린에 억지로 넣어 사용하지만, 작은 화면에 맞는 경험은 부족함
- FlipCTL은 D-pad와 몇 개의 버튼으로 조작하는 **메뉴 기반 인터페이스** 프레임워크임
- `ping`, `nmap`, `traceroute` 같은 기존 Linux 유틸리티를 작은 LCD에서 이해하기 쉬운 UI로 감싸는 것이 핵심 아이디어임
- 장기 목표는 임베디드 Linux 장치에 HMI(human-machine interface)를 추가하는 일을 `apt install flipctl` 한 줄만큼 쉽게 만드는 것임
- 라우터, NAS, 서버, headless board 등 작은 화면을 붙일 수 있는 장치는 Qt, GNOME, X11 없이 FlipCTL 설정만으로 사용 가능한 인터페이스를 제공할 수 있게 하려 함
- Flipper One의 디스플레이와 버튼 보드를 독립형 **FlipCTL Control Board**로 출시해, Linux 기반 장치에 꽂으면 메뉴 기반 인터페이스를 제공하는 주변기기로 만들 계획임
- 현재 FlipCTL은 개념과 아키텍처 단계에 있음
- [FlipCTL concept](https://docs.flipper.net/one/cpu-software/flipctl)

### 확장 하드웨어
- Flipper One의 핵심 아이디어는 사용자가 자신만의 특화 멀티툴로 바꿀 수 있는 **확장형 하드웨어 플랫폼**임
- ## M.2 확장 모듈
  - 후면 플레이트 아래 내부에 고속 **M.2 확장 모듈**을 설치할 수 있음
  - M.2는 폼팩터 이름이며 실제 연결 인터페이스를 정의하지 않기 때문에, 모듈마다 인터페이스·크기·커넥터 유형이 다를 수 있음
  - Flipper One의 M.2 포트는 셀룰러·위성 모뎀, SDR 모듈, AI 가속기, NVMe 또는 SATA SSD, 어댑터를 통한 Wi-Fi 카드 등 다양한 모듈을 수용하도록 설계됨
  - M.2 모듈은 후면 커버 아래에 설치되고 뒤쪽으로 확장되며, 설치 모듈에 따라 back plate와 antenna rail을 교체할 수 있음
  - 사양은 `Key-B`, `2242/3042/3052`, D3 class 두께까지 지원하며, 인터페이스는 `PCI Express 2.1 ×1 / USB 3.1 / USB 2.0 / SATA3 / Serial Audio / UART / I2C / SIM card`를 포함함
  - 전체 사양과 pinout은 [M.2 Port specification](https://docs.flipper.net/one/hardware/m2-port)에 있음
- ## GPIO 모듈
  - 더 단순한 DIY 모듈을 위해 표준 2.54mm 핀 헤더를 쓰는 **GPIO 커넥터**가 추가됨
  - GPIO 모듈은 후면 플레이트 위에 장착되고, 인클로저 클립과 나사로 고정되어 휴대 중 쉽게 빠지지 않도록 설계됨
  - threaded inserts는 back plate와 antenna rail에 2.54mm pitch 격자로 배치되어 표준 perfboard 구멍 간격과 맞음
  - 사용자는 perfboard를 크기에 맞게 잘라 모듈을 납땜한 뒤 Flipper One 후면에 나사로 고정할 수 있음
  - 기술 사양, pinout, 회로도는 [GPIO port](https://docs.flipper.net/one/hardware/gpio-port)에 있으며, 워키토키와 카메라 모듈 예시는 [GPIO modules examples](https://docs.flipper.net/one/hardware/gpio-port/modules)에서 확인할 수 있음
- ## 열린 기구 부품
  - Flipper One 모듈을 위한 **커스텀 장착 시스템**과 관련 인클로저 부품이 공개됨
  - [3D 모델 영상](https://blog.flipper.net/content/media/2026/05/Flipper_One_pan_rotate_and_move_parts.mp4)에서 구조를 확인할 수 있음
  - **Body**는 메인 인클로저이며, M.2 모듈은 금속 heatsink plate에 나사로 고정되고 42mm·52mm 모듈 길이를 위한 두 threaded insert가 있음
  - **Back plate**는 M.2 확장 포트에 접근할 수 있는 후면 커버이며, 설치 모듈에 따라 다른 설계로 교체할 수 있음
  - **Antenna rail**은 SMA 안테나 장착용 별도 부품이며, back plate와 분리되어 안테나 설치와 케이블 라우팅을 먼저 한 뒤 back plate를 닫을 수 있음
  - 이 구조는 조립 중 안테나 케이블을 손상시킬 위험을 줄이기 위한 것임
  - 3D 모델을 내려받아 모듈용 인클로저, custom back plate, antenna rail을 설계할 수 있음
  - [Mechanics](https://docs.flipper.net/one/mechanics/about)

### 네트워크 멀티툴
- Flipper One은 모든 OSI 계층의 IP 네트워크를 다루는 **네트워크 멀티툴**을 목표로 함
- 다섯 개의 독립 네트워크 업링크를 제공하며, 이들을 bridge로 묶거나 custom routing을 구성하거나 VPN tunnel로 보낼 수 있음
- **2× Gigabit Ethernet**은 각각 1Gbps로 동작하는 독립 WAN/LAN 포트이며, transparent bridge와 MitM sniffing 등에 사용할 수 있음
- **Wi-Fi 6E**는 `MT7921AUN` 칩셋 기반 802.11ax이며 monitor mode를 지원하고 2.4/5/6GHz 대역에서 Wi-Fi client(STA)와 hotspot(AP)로 동작할 수 있음
- **Cellular modem**은 M.2 확장 모듈을 통한 5G 또는 LTE 모뎀이며, 외부 안테나, 물리 Nano SIM(4FF), eSIM을 지원함
- **USB Ethernet**은 USB-C를 통해 최대 5Gbps로 에뮬레이션되며, USB-CDC NCM으로 동작해 별도 드라이버가 필요 없음
- 기본 상태에서 Flipper One은 임의 네트워크의 gateway, multi-hotspot bridge, inline Ethernet sniffer, PC·스마트폰용 USB Wi-Fi/Ethernet adapter 또는 이들의 조합으로 동작할 수 있음
- dynamic routing, load balancing, failover가 가능한 기능들은 [Features list](https://docs.flipper.net/one/general/features)에 사용자 스토리 기반으로 정리됨

### 고급 Wi-Fi와 위성 NTN
- Flipper One의 내장 Wi-Fi는 monitor mode와 packet injection을 포함해 Wi-Fi 네트워크 분석에 필요한 기능을 지원해야 함
- 현재 테스트 중인 칩셋은 MediaTek **`MT7921AUN`** 이며, 세 개 주파수 대역을 지원하고 mainline Linux 커널의 오픈소스 드라이버로 지원됨
- Alfa **`AWUS036AXML`** 도 `MT7921AUN` 기반 USB Wi-Fi 어댑터이며, driver support와 wardriving 도구 호환성으로 알려져 있음
- 이 칩셋이 실제 사용자 요구에 맞게 동작하는지 확인하기 위해 wireless auditing, monitoring, injection, mesh 등에 관심 있는 사용자의 테스트가 필요함
- [Wi-Fi Testing](https://docs.flipper.net/one/testing/network#wi-fi)
- **NTN(Non-Terrestrial Networks)** 은 3GPP가 5G와 LTE 사양의 일부로 표준화한 IoT 장치용 저속 위성 통신 기술임
- [NTN](https://www.3gpp.org/technologies/ntn-overview)은 표준 cellular stack을 사용하며, SIM/eSIM 인증, roaming, 일반 IP traffic을 포함함
- Flipper One은 NTN satellite modem M.2 module을 통해 위성과 통신할 수 있게 하려 함
- [Skylo](https://www.skylo.tech/) 같은 파트너사가 eSIM 모듈에 위성 네트워크 지원을 추가하고, 공식 지원할 [NTN M.2 module](https://www.skylo.tech/certified-devices#modules) 선택을 도와야 함
- [Modules → Satellite modem](https://docs.flipper.net/one/hardware/m2-modules/satellite-modem?_gl=1*1wsjoy*_ga*MjAwNDk3OTU4LjE3NzAxMzUwODk.*_ga_GM78S6JK0K*czE3NzkxOTc3NDgkbzM1JGcxJHQxNzc5MjAxNjM4JGo0MiRsMCRoMA..)

### 오프라인 Flipper LLM
- Flipper One은 외부 AI agent와의 통합을 지원할 예정이며, 인터넷이 없는 상황에서도 도움을 받을 수 있도록 로컬 LLM 실행을 목표로 함
- 내장 **AI accelerator**를 통해 인터넷 연결 없이 로컬에서 LLM을 실행하고, 장치 조작, 설정 생성, 유용한 팁 제공을 돕게 하려 함
- 범용 모델만으로는 충분하지 않다고 보고, Flipper One의 내부 구조와 애플리케이션을 잘 아는 특화 AI 모델을 학습시키려 함
- `RK3576`의 NPU 모듈은 현재 mainline 커널에서 지원되지 않으며, 해당 지원을 추가해야 함
- [RK3576 NPU support in mainline Linux and Mesa](https://github.com/flipperdevices/flipperone-linux-build-scripts/issues/55)

### 데스크톱과 미디어 박스 모드
- Flipper One은 항상 휴대할 수 있는 **survival desktop** 또는 thin client로 사용할 수 있음
- USB-C 케이블 하나로 모니터에 연결하면 충전, 비디오 출력, USB 주변기기 연결을 동시에 처리할 수 있으며, USB-C DisplayPort Alt Mode를 사용함
- 프로세서 성능은 Raspberry Pi 5와 비슷한 수준으로, 웹 브라우징과 가벼운 개발 작업을 처리할 수 있다고 밝힘
- **USB-C DisplayPort Alt Mode**는 프로토콜 집합이 복잡하고, signal integrity 문제와 모니터별 동작 차이 때문에 안정적인 연결이 어려움
- DP Alt Mode 지원은 [mainline kernel](https://lore.kernel.org/linux-rockchip/20260428-rockchip-usbdp-cleanup-v4-0-7775671ece22@collabora.com/)에 아직 완전히 구현되지 않았음
- **하드웨어 비디오 디코딩**은 mainline 커널에서 아직 지원되지 않으며, 부드러운 비디오 재생을 위해 [H.264/HEVC hardware video decoding support](https://github.com/flipperdevices/flipperone-linux-build-scripts/issues/13)를 추가해야 함
- 데스크톱 환경은 KDE Plasma가 후보 중 하나지만, Flipper One에 더 잘 맞는 가벼운 tiling WM 가능성도 열려 있음
- 목표는 하드웨어와 함께 제공되는 드문 Linux desktop 사례로서, 빠르고 깔끔하며 bloated하지 않고 바로 동작하는 데스크톱 환경을 만드는 것임
- **TV media box**로도 사용할 수 있으며, HDMI CEC 덕분에 TV의 원래 리모컨으로 제어할 수 있음
- Mini HDMI와 Micro HDMI가 필요한 케이블을 찾기 어렵게 만든다고 보고, licensing fee가 있는 독점 포트임에도 **full-size HDMI**를 채택함
- **Full-size HDMI 2.1 port**는 어댑터 없이 표준 크기 커넥터를 제공하며, **4K @ 120Hz** 출력과 CEC(Consumer Electronics Control)를 지원함

### 리스크와 커뮤니티 참여
- Flipper Zero는 약 **100만 대**가 사용자 손에 들어갔고, 그 과정에서 큰 커뮤니티가 만들어졌으며 새로운 기술 탐색과 더 안전하고 투명한 제품을 향한 벤더 변화를 이끌었다고 평가함
- Flipper One은 약 10년 동안 구상해온 pocket Linux multi-tool 개념이며, 타협 없는 제품을 만들 수 있을 만큼 기술과 부품이 준비됐다고 판단한 시점에 공개됨
- 기술 과제와 재정적 위험이 크며, 현재 RAM chip crisis 같은 불확실성도 존재함
- 계획한 모든 것을 완수할 수 있을지는 확실하지 않지만, 개발 과정 공개와 커뮤니티 기여를 통해 진행하려 함
- 참여 경로:
  - [Flipper One Developer Portal](https://docs.flipper.net/one) — 모든 하위 프로젝트, `help wanted` 작업, 기여 가이드, 개발자 주간 다이제스트
  - [X.com/Flipper_RND](https://x.com/Flipper_RND) — 프로젝트 업데이트와 공지

<!-- USER:NOTES -->
## 내 메모
