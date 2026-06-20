---
title: "Creator 설치 가이드"
description: "Creator 데스크톱 콘텐츠 팩토리의 다운로드 및 설치 단계입니다."
---

<div class="creator-page">

# 설치 가이드

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">사전 조건 · 예상 3분</p>
    <div class="lurus-callout__body">Windows 10+ / macOS 12+ / Linux（64비트）· Lurus <Term t="API Key">API Key</Term>（<a href="/ko/guide/get-api-key">발급 방법</a>, AI 재작성에 사용）· 4 GB+ 메모리（8 GB+ 권장）.</div>
  </div>
</div>

## 다운로드

[GitHub Releases](https://github.com/hanmahong5-arch/lurus-creator/releases/latest)에 접속하여 해당 플랫폼의 설치 패키지를 다운로드합니다.

| 플랫폼 | 파일 | 설명 |
|------|------|------|
| Windows | `LurusCreator-windows-amd64.exe` | 64비트 설치 프로그램 |
| macOS (Apple Silicon) | `LurusCreator-darwin-arm64.dmg` | M1/M2/M3 칩 |
| macOS (Intel) | `LurusCreator-darwin-amd64.dmg` | Intel 칩 |
| Linux | `LurusCreator-linux-amd64.AppImage` | AppImage 형식 |

---

## 플랫폼별 설치

다운로드 후 사용 중인 운영체제에 맞는 설치 방법을 선택합니다.

:::tabs
== Windows

1. `LurusCreator-windows-amd64.exe`를 다운로드하고 더블 클릭하여 실행합니다.
2. 「Windows에서 PC를 보호했습니다」 창이 나타나면 「추가 정보」 → 「실행」을 클릭합니다.
3. 설치 마법사를 완료하고 바탕화면 바로 가기에서 실행합니다.
4. **최초 설정**: [api.lurus.cn](https://api.lurus.cn)에서 Key를 발급받아 Creator 설정에 붙여 넣습니다（AI 재작성에 사용）.
5. 작업 디렉터리（비디오/문구 저장 위치）를 선택합니다.

== macOS

1. 해당 칩의 `.dmg`를 다운로드하고 더블 클릭하여 마운트합니다.
2. **Lurus Creator**를 「응용 프로그램」으로 드래그합니다.
3. 처음 열 때 「개발자를 확인할 수 없습니다」라고 표시되면 「시스템 설정 → 개인정보 보호 및 보안 → 그래도 열기」로 이동합니다.

== Linux

```bash
# 下载、赋予执行权限、运行
wget https://github.com/hanmahong5-arch/lurus-creator/releases/latest/download/LurusCreator-linux-amd64.AppImage
chmod +x LurusCreator-linux-amd64.AppImage
./LurusCreator-linux-amd64.AppImage
```
:::

---

## 내장 의존성

Creator는 필요한 모든 도구를 패키징하고 있어 별도 설치가 필요 없습니다:

| 도구 | 용도 | 내장 여부 |
|------|------|---------|
| yt-dlp | 비디오 다운로드 | 내장 |
| ffmpeg | 오디오/비디오 처리 | 내장 |
| Whisper | 음성-텍스트 변환 | 내장（tiny/base 모델） |
| chromedp | 자동 게시 | 내장 |

<div class="lurus-callout lurus-callout--tip">
  <span class="lurus-callout__icon"><Icon name="life-buoy" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">Whisper 모델</p>
    <div class="lurus-callout__body">기본적으로 <code>tiny</code> 및 <code>base</code> 모델이 내장되어 있습니다. 전사 품질이 충분하지 않으면 설정에서 더 큰 모델（<code>small</code> / <code>medium</code>）을 다운로드할 수 있으며, 정확도는 높아지지만 더 많은 메모리가 필요합니다.</div>
  </div>
</div>

---

## 시스템 요구 사항

| 항목 | 최소 요구 사항 | 권장 |
|------|---------|------|
| 메모리 | 4 GB | 8 GB+ |
| 디스크 공간 | 500 MB（설치） | 10 GB+（비디오 캐시 포함） |
| 네트워크 | 광대역 연결 | 비디오 다운로드에는 안정적인 네트워크 필요 |
| GPU | 불필요 | GPU가 있으면 Whisper 전사 가속 가능 |

---

## 설치 검증

<ol class="lurus-steps">
<li>설정 페이지를 열고 API Key 상태가 「연결됨」으로 표시되는지 확인합니다.</li>
<li>「의존성 확인」을 클릭하여 모든 도구가 녹색 체크 표시로 나타나는지 확인합니다.</li>
<li>비디오 URL을 입력하여 다운로드를 테스트합니다.</li>
</ol>

---

## 제거

| 플랫폼 | 작업 | 설정/캐시 위치 |
|------|------|--------------|
| **Windows** | 제어판 → 프로그램 제거 → 「Lurus Creator」 | `%APPDATA%\LurusCreator\` |
| **macOS** | 응용 프로그램의 「Lurus Creator」를 휴지통으로 드래그 | `~/Library/Application Support/LurusCreator/` |
| **Linux** | `rm /opt/lurus-creator`（또는 AppImage 위치） | `rm -rf ~/.config/LurusCreator/` |

---

## 다음 단계

<NextSteps :steps="[
  { text: '사용 설명서', link: '/ko/creator/usage', primary: true },
  { text: '사용 사례', link: '/ko/creator/use-cases' },
  { text: 'API Key 발급', link: '/ko/guide/get-api-key' },
]" />

</div>
