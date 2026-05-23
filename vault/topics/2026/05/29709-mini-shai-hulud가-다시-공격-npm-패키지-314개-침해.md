---
id: 29709
title: "Mini Shai-Hulud가 다시 공격: npm 패키지 314개 침해"
url: https://safedep.io/mini-shai-hulud-strikes-again-314-npm-packages-compromised/
domain: safedep.io
author: neo
points: 5
comments_count: 2
posted_at: 2026-05-21T05:59:55+09:00
fetched_at: 2026-05-23T15:51:10.121Z
last_seen_at: 2026-05-23T15:51:10.121Z
tags: []
auto_tags:
  - domain/safedep.io
  - type/GN+
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
- **atool npm 계정**이 2026년 5월 19일 침해되어 약 22분 동안 317개 패키지에 637개 악성 버전이 자동 배포됨
- 페이로드는 498KB 난독화 **Bun 스크립트**로, SAP 침해에 쓰인 Mini Shai-Hulud와 같은 스캐너 구조와 정규식을 사용함
- 탈취 대상은 **AWS 자격 증명**, Kubernetes 토큰, Vault, GitHub PAT, npm 토큰, SSH 키, 로컬 비밀 값까지 확장됨
- CI에서는 GitHub Actions OIDC를 npm publish 토큰으로 교환하고, **Sigstore 서명**과 악성 workflow 주입을 악용함
- 대응에는 침해 버전 설치 여부 확인, 접근 가능했던 모든 자격 증명 교체, **lockfile·의존성 pinning**과 설치 전 검사가 필요함

---

### 공격 개요
- `atool` npm 계정(`i@hust.cc`)이 2026년 5월 19일 침해되어 약 22분 동안 317개 패키지에 637개 악성 버전이 배포됨
- 이 계정은 547개 패키지를 유지하고 있었고, 공격자는 그중 314개 이상에 두 차례 버전 bump를 수행함
- 영향 패키지에는 `size-sensor`(월 420만 다운로드), `echarts-for-react`(380만), `@antv/scale`(220만), `timeago.js`(115만), 다수의 `@antv` 스코프 패키지가 포함됨
- 페이로드는 498KB 난독화 Bun 스크립트이며, 3주 전 SAP 침해에 사용된 [Mini Shai-Hulud toolkit](https://safedep.io/mini-shai-hulud-and-sap-compromise)과 같은 스캐너 구조, 자격 증명 정규식, 난독화 패턴을 사용함
- 탈취 데이터는 공개 GitHub 저장소에 Git 객체로 커밋되거나, RSA+AES로 암호화된 HTTPS POST로 `t.m-kosche[.]com`에 전송됨

### 배포 방식과 semver 위험
- 첫 번째 파동은 2026년 5월 19일 01:39~01:56 UTC에 약 317개 버전을 배포했고, 두 번째 파동은 02:05~02:06 UTC에 같은 패키지들에 약 314개 버전 bump를 수행함
- 대부분의 패키지 309개는 파동마다 하나씩 정확히 2개의 악성 버전을 받음
- `size-sensor`, `echarts-for-react`, `jest-canvas-mock`, `jest-date-mock` 4개 패키지는 3개 버전을 받아 초기 테스트에 쓰인 것으로 나타남
- 공격자는 대부분의 패키지에서 `latest` dist-tag를 이동하지 않았지만, npm semver 해석은 `latest`와 무관하게 범위에 맞는 가장 높은 버전을 선택함
- 예를 들어 `echarts-for-react`의 `latest`가 `3.0.6`에 남아 있어도, `"echarts-for-react": "^3.0.6"`인 프로젝트는 다음 clean install에서 악성 버전 `3.2.7`로 해석될 수 있음

### 실행 경로와 페이로드
- 손상된 모든 버전은 `package.json`에 버전 bump와 `"preinstall": "bun run index.js"`를 추가함
- 637개 악성 버전 중 630개는 `optionalDependencies`에 `@antv/setup: github:antvis/G2#&lt;commit-sha&gt;`를 추가해 두 번째 페이로드 사본을 가져오게 함
- `preinstall` 훅은 의존성 설치 전에 실행되며 Bun 런타임을 요구함
- `preinstall`이 차단되거나 건너뛰어져도 GitHub 사칭 커밋의 `prepare` 스크립트가 두 번째 실행 경로로 남음
- `index.js`는 한 줄짜리 498KB 난독화 Bun 번들이며, SAP 침해에 쓰인 [Mini Shai-Hulud payload](https://safedep.io/mini-shai-hulud-and-sap-compromise)와 같은 Bun 요구 사항, hex-variable 난독화, 100KB flush threshold 스캐너 구조, 자격 증명 정규식 세트를 가짐
- CI 환경 감지는 GitHub Actions, Jenkins, GitLab CI, CircleCI, Travis, Buildkite, Drone, TeamCity, AppVeyor, Bitbucket Pipelines, CodeBuild, Azure DevOps, Netlify, Vercel 등 20개 이상 플랫폼의 환경 변수를 확인함

### 자격 증명 수집 대상
- 페이로드는 암호화된 이름의 환경 변수 80개 이상을 읽고, 파일 내용은 정규식으로 스캔함
- 주요 대상은 GitHub token, npm token, GitHub Actions JWT, AWS key, Azure key, DB connection string, Stripe key, SSH key, Docker auth, Vault token, Kubernetes token, URL embedded credential임
- 파일 스캐너는 홈 디렉터리의 `.ssh`, `.aws/credentials`, `.npmrc`, `.docker/config.json`, `.kube/config` 같은 표준 자격 증명 위치를 읽음
- AWS credential resolution order 전체를 순회하고, EC2 IMDSv2와 ECS container credential endpoint에서 IAM role credential을 가져오며, AWS STS `GetCallerIdentity`와 Secrets Manager 접근도 시도함
- Vault는 token 파일과 `VAULT_ADDR`, `VAULT_TOKEN`, `VAULT_ROLE` 등을 확인하고, 유효한 credential이 있으면 secret 열거와 AWS·Kubernetes 인증을 시도함
- Kubernetes는 service account token과 `KUBECONFIG`를 확인하며, Docker socket이 있으면 host의 컨테이너 열거와 컨테이너 탈출을 시도함

### C2와 데이터 유출
- GitHub API는 C2처럼 사용되며, `GET /user`로 탈취한 GitHub 토큰을 검증하고 `GET /user/orgs`로 조직을 열거함
- `repo` 또는 `public_repo` 권한이 충분한 토큰은 공격자 유출 저장소 생성에 사용됨
- 생성 저장소 설명은 역순 문자열 `niagA oG eW ereH :duluH-iahS`로 저장되어, 정방향으로 “Shai-Hulud: Here We Go Again”이 됨
- 저장소 이름은 `harkonnen-melange-742`, `fremen-sandworm-315`, `gesserit-navigator-508`처럼 Dune 테마 단어 2개와 숫자를 조합함
- 유출 데이터는 Git Data API를 통해 blob, tree, commit, ref update 순서로 저장됨
- 별도 HTTPS sender는 `hxxps://t.m-kosche[.]com/api/public/otel/v1/traces`를 OpenTelemetry OTLP trace ingestion endpoint처럼 보이게 구성함
- HTTPS payload는 gzip JSON을 AES-256-GCM으로 암호화하고, AES key를 하드코딩된 공개키로 RSA-OAEP wrapping함

### CI/CD와 신뢰 체인 악용
- 탈취한 토큰이 접근 가능한 GitHub 저장소에서 workflow 실행 이력, artifact, secret 이름, branch 목록, Claude Code 설정을 수집함
- GitHub API로 secret 값에는 접근할 수 없지만, secret 이름은 어떤 자격 증명이 존재하는지 드러냄
- 악성 workflow는 `.github/workflows/codeql.yml`에 주입되며, 이름은 `Run Copilot`이고 `push`에 트리거됨
- workflow는 `VARIABLE_STORE: ${{ toJSON(secrets) }}`로 repository secrets 전체를 JSON으로 환경 변수에 담고, `format-results.txt`로 저장한 뒤 artifact로 업로드함
- 완료 후 artifact zip을 다운로드하고, workflow run 삭제와 branch ref reset으로 주입 흔적을 줄임
- GitHub Actions OIDC가 있는 CI에서는 `https://registry.npmjs.org/-/npm/v1/oidc/token/exchange/package/&lt;package-name&gt;` endpoint로 npm publish token 교환을 시도함
- 페이로드는 Fulcio, Rekor, SLSA provenance 형식을 포함한 Sigstore signing 구현을 갖고 있어, 침해된 CI identity로 서명된 artifact를 만들 수 있음

### 개발 환경과 AI 코딩 에이전트 감염
- 페이로드는 GitHub API를 통한 원격 주입과 파일시스템 쓰기를 통한 로컬 감염으로 Claude Code, Codex, VS Code 환경을 겨냥함
- 탈취한 토큰으로 접근 가능한 저장소에 `.vscode/tasks.json`, `.claude/index.js`, `.claude/settings.json`, `.claude/setup.mjs`, `.vscode/setup.mjs`를 커밋함
- `.claude/settings.json`은 `SessionStart` 훅을 등록해 Claude Code 세션 시작 때마다 `node .claude/setup.mjs`를 실행함
- `.vscode/tasks.json`은 `"runOn": "folderOpen"`으로 프로젝트 폴더가 열릴 때 실행을 트리거함
- `setup.mjs`는 GitHub 공식 릴리스에서 Bun v1.3.14를 다운로드하고 바이너리를 추출한 뒤 페이로드를 실행함
- 로컬 감염 경로는 페이로드를 `~/.claude/package/index.js`와 `~/.codex/package/index.js`에 복사하고, 기존 프로젝트 설정 파일을 스캔해 훅을 주입함
- Apple Silicon Mac에서는 이 로컬 감염 경로가 건너뛰어지며, Linux, Intel Mac, Windows에서는 실행됨

### 지속성과 GitHub dead-drop C2
- `kitty-monitor`로 위장한 지속 실행 데몬이 Linux에서는 systemd 사용자 서비스로, macOS에서는 `~/Library/LaunchAgents/com.user.kitty-monitor.plist`로 설치됨
- 설치기는 `systemctl --user enable --now`와 `loginctl enable-linger`를 사용해 로그아웃 후에도 유지되게 함
- `cat.py` 데몬은 1시간마다 GitHub Search API를 폴링하며, `firedalazer` 키워드를 포함한 커밋을 검색함
- 커밋 메시지 형식은 `firedalazer <base64_url>.<base64_signature>`이고, 하드코딩된 4096비트 RSA 공개키로 RSA-PSS 서명을 검증한 뒤 URL의 Python 코드를 실행함
- 별도 `gh-token-monitor` 데몬은 탈취한 GitHub 토큰을 60초 간격으로 폴링하며 TTL은 24시간임
- 프로세스 메모리 스캐너는 Linux에서 `/proc/pid/maps+mem`, Windows에서 `ReadProcessMemory`를 사용해 GitHub Actions runner worker 프로세스의 읽기 가능한 메모리 영역을 덤프함

### antvis/G2 사칭 커밋
- 637개 악성 버전 중 630개는 `antvis/G2` 저장소의 특정 커밋을 가리키는 `optionalDependencies` 항목을 포함함
  ```json
  {
    "optionalDependencies": {
      "@antv/setup": "github:antvis/G2#1916faa365f2788b6e193514872d51a242876569"
    }
  }
  ```
- npm이 `github:` 의존성을 해석하면 해당 커밋을 가져오고, `package.json`을 찾은 뒤 라이프사이클 스크립트를 실행함
- 해당 커밋에는 `@antv/setup`을 선언하고 `prepare` 스크립트를 포함한 `package.json`과 같은 Shai-Hulud 페이로드를 다시 난독화한 499KB `index.js`가 있음
- `prepare` 스크립트의 `&& exit 1`은 optional dependency를 실패하게 만들지만, npm은 optional dependency 실패를 치명적으로 처리하지 않아 설치가 계속됨
- Git API는 `antvis/G2`에 푸시된 서로 다른 커밋 SHA 3개를 보여주며, 모두 어떤 브랜치에도 붙어 있지 않음
- 세 커밋은 author `huiyu.zjt <Alexzjt@users.noreply.github.com>`, commit message `New Package`, parents 0개라는 동일한 메타데이터를 공유하며 GPG 서명이 없음
- 공격자는 `antvis/G2`에 쓰기 권한 없이 fork에 payload orphan commit을 만들고 fork를 삭제하는 방식으로 부모 저장소 namespace에서 SHA fetch가 가능한 커밋을 남길 수 있음
- 이 방식은 GitHub Actions의 사칭 커밋 문제를 [Chainguard가 문서화한](https://www.chainguard.dev/unchained/what-the-fork-imposter-commits-in-github-actions-and-ci-cd) 것과 같은 종류이며, 여기서는 npm `github:` 의존성 해석에 적용됨

### 침해 지표
- 2026년 5월 19일 01:44~02:06 UTC 사이 `atool`(`i@hust.cc`)이 배포한 패키지가 확인 대상임
- `preinstall` 스크립트는 `bun run index.js`임
- 페이로드 SHA256은 `a68dd1e6a6e35ec3771e1f94fe796f55dfe65a2b94560516ff4ac189390dfa1c`임
- `antvis/G2` 사칭 커밋은 다음과 같음
  - `1916faa365f2788b6e193514872d51a242876569` — 626개 버전
  - `7cb42f57561c321ecb09b4552802ae0ac55b3a7a` — 2개 버전
  - `dc3d62a2181beb9f326952a2d212900c94f2e13d` — 1개 버전, garbage collected
- 네트워크 IoC에는 `hxxps://t.m-kosche[.]com/api/public/otel/v1/traces`, `169.254.169.254` EC2 metadata, `169.254.170.2` ECS container metadata 요청이 포함됨
- 저장소 IoC에는 `chore/add-codeql-static-analysis` 브랜치, `Run Copilot` workflow, `toJSON(secrets)`를 `format-results.txt`로 덤프하는 `.github/workflows/codeql.yml`이 포함됨
- 개발 환경 IoC에는 `.claude/settings.json`의 `SessionStart` 훅, `.vscode/tasks.json`의 `"runOn": "folderOpen"`, `.claude/setup.mjs`, `.vscode/setup.mjs`가 포함됨
- 지속성 IoC에는 `kitty-monitor.service`, `com.user.kitty-monitor.plist`, `~/.local/bin/gh-token-monitor.sh`, `~/.local/share/kitty/cat.py`, `/var/tmp/.gh_update_state`가 포함됨

### 확인해야 할 대표 패키지
- `compromised-packages.csv` 표에는 **Package**와 **Compromised Versions** 2개 열이 있으며, 표 기준 317개 패키지가 표시됨
- lockfile에서 해당 패키지와 2026-05-19에 배포된 악성 버전 존재 여부를 확인해야 함
- 대표 `@antv` 패키지와 악성 버전
  - `@antv/g2`: `5.5.8`, `5.6.8`
  - `@antv/g6`: `5.2.1`, `5.3.1`
  - `@antv/g`: `6.4.1`, `6.5.1`
  - `@antv/l7`: `2.26.10`, `2.27.10`
  - `@antv/x6`: `3.2.7`, `3.3.7`
  - `@antv/s2`: `2.8.1`, `2.9.1`
  - `@antv/f2`: `5.15.0`, `5.16.0`
- 일반 npm 패키지와 악성 버전
  - `echarts-for-react`: `3.0.7`, `3.1.7`, `3.2.7`
  - `size-sensor`: `1.0.4`, `1.1.4`, `1.2.4`
  - `jest-canvas-mock`: `2.5.3`, `2.6.3`, `2.7.3`
  - `jest-date-mock`: `1.0.11`, `1.1.11`, `1.2.11`
  - `timeago.js`: `4.1.2`, `4.2.2`
  - `timeago-react`: `3.1.7`, `3.2.7`
  - `@lint-md/cli`: `2.1.0`, `2.2.0`
  - `@lint-md/core`: `2.1.0`, `2.2.0`
  - `@lint-md/parser`: `0.1.14`, `0.2.14`

### 대응과 방어
- 침해 버전이 설치됐다면 빌드 환경에서 접근 가능했던 npm 토큰, GitHub PAT, AWS 키, SSH 키, 클라우드 자격 증명, 데이터베이스 비밀번호, Vault 토큰, Kubernetes service account 토큰, 로컬 비밀번호 관리자 비밀 값을 교체해야 함
- `t.m-kosche[.]com`은 네트워크와 DNS 수준에서 차단해야 함
- 빌드 환경에서 접근 가능한 토큰을 가진 GitHub 계정 아래에 승인되지 않은 공개 저장소가 생성됐는지 확인해야 함
- CI 파이프라인에서 승인되지 않은 패키지 publish와 npm OIDC 토큰 교환 로그를 검토해야 함
- 침해된 CI identity로 생성된 서명 artifact가 있는지 Sigstore 투명성 로그를 확인해야 함
- 로컬 Node.js 프로젝트에서 `.claude/settings.json` 훅, `.vscode/tasks.json` 자동 실행 작업, `.claude/setup.mjs`, `.vscode/setup.mjs`를 확인해야 함
- `kitty-monitor` systemd 사용자 서비스와 `com.user.kitty-monitor` LaunchAgent를 제거하고, `~/.local/share/kitty/cat.py`, `/var/tmp/.gh_update_state`, `~/.local/bin/gh-token-monitor.sh` 존재 여부를 확인해야 함
- semver 범위 해석이 악성 버전으로 이어지지 않도록 의존성을 pin하거나 lockfile을 사용해야 함
- CI/CD 파이프라인에서 Docker socket 노출과 EC2 metadata 접근을 감사하고, IMDSv2 hop limit 제한을 고려해야 함
- [Package Manager Guard (pmg)](https://github.com/safedep/pmg)는 `preinstall` 실행 전에 패키지를 threat intelligence와 대조하는 오픈소스 설치 프록시임
- [dependency cooldown](https://github.com/safedep/pmg/blob/main/docs/dependency-cooldown.md)은 설정 가능한 시간 창 안에 배포된 버전을 거부해, semver 범위가 새 악성 릴리스로 해석되는 급격한 배포 파동을 줄일 수 있음
- [vet](https://github.com/safedep/vet)은 예상치 못한 `preinstall` 훅, 크기 급증, maintainer 변경 같은 비정상 패키지 업데이트를 CI/CD 파이프라인에 도달하기 전에 탐지할 수 있음
- 단일 계정 아래 547개 패키지, 한 세션에서 무기화된 314개 이상 패키지라는 영향 범위는 npm 신뢰 모델의 구조적 약점을 드러냄

### 참고 자료
- [Shai-Hulud Goes Open Source: Static Analysis of the Framework](https://securitylabs.datadoghq.com/articles/shai-hulud-open-source-framework-static-analysis/) — Datadog Security Labs
- [The Shai-Hulud Code Drop](https://www.reversinglabs.com/blog/the-shai-hulud-code-drop) — ReversingLabs

<!-- USER:NOTES -->
## 내 메모
