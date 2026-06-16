---
title: Switch 설치 가이드
description: Lurus Switch 데스크톱 애플리케이션의 다운로드 및 설치 절차.
---

<div class="switch-page">

# Switch 설치 가이드

<div class="lurus-callout lurus-callout--key">
  <span class="lurus-callout__icon"><Icon name="key-round" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">사전 조건 · 예상 소요 3분</p>
    <div class="lurus-callout__body">Windows 10+ / macOS 12+ / Ubuntu 20.04+(64비트) · Lurus <Term t="API Key">API Key</Term>(<a href="/ko/guide/get-api-key">발급 방법</a>) 또는 기타 Provider Key.</div>
  </div>
</div>

## 다운로드 {#download}

[GitHub Releases](https://github.com/hanmahong5-arch/lurus-switch/releases/latest)에 접속해 해당 플랫폼의 설치 패키지를 다운로드하세요.

| 플랫폼 | 파일 | 설명 |
|------|------|------|
| Windows | `LurusSwitch-windows-amd64.exe` | 64비트 설치 프로그램 |
| macOS (Apple Silicon) | `LurusSwitch-darwin-arm64.dmg` | M1/M2/M3 칩 |
| macOS (Intel) | `LurusSwitch-darwin-amd64.dmg` | Intel 칩 |
| Linux | `LurusSwitch-linux-amd64.AppImage` | AppImage 형식 |

---

## 설치 {#install}

다운로드 후 사용하는 운영체제에 맞는 설치 방식을 선택하세요.

:::tabs
== Windows

1. `LurusSwitch-windows-amd64.exe`를 다운로드해 더블 클릭하여 실행합니다.
2. 「Windows에서 PC를 보호했습니다」 창이 뜨면 「**추가 정보**」 →「**실행**」을 클릭합니다.
3. 설치 마법사를 완료한 뒤 시작 메뉴에서 「Lurus Switch」를 실행합니다.
4. 최초 실행 시 방화벽 팝업에서 「**허용**」(개인 네트워크)을 선택합니다.

> **부팅 시 자동 실행**: 설정 → 일반 → 「부팅 시 자동 시작」 체크.

== macOS

1. 칩에 맞는 `.dmg`(M 시리즈는 `darwin-arm64`, Intel은 `darwin-amd64`)를 다운로드해 더블 클릭하여 마운트합니다.
2. **Lurus Switch**를 「응용 프로그램」으로 드래그합니다.
3. 최초 실행 시 「개발자를 확인할 수 없음」 안내가 나오면: 시스템 설정 → 개인정보 보호 및 보안 → 「Lurus Switch」 사용이 차단됨 →「**열기**」.
4. 앱이 메뉴 막대에 나타납니다.

> **부팅 시 자동 실행**: 시스템 설정 → 일반 → 로그인 항목 → `+`로 추가.

== Linux

**AppImage 방식**

```bash
# 下载并赋予执行权限
wget https://github.com/hanmahong5-arch/lurus-switch/releases/latest/download/LurusSwitch-linux-amd64.AppImage
chmod +x LurusSwitch-linux-amd64.AppImage
./LurusSwitch-linux-amd64.AppImage
```

**데스크톱 통합 + 부팅 시 자동 실행**

```bash
# 移动到 /opt 并创建桌面快捷方式
sudo mv LurusSwitch-linux-amd64.AppImage /opt/lurus-switch
cat > ~/.local/share/applications/lurus-switch.desktop << EOF
[Desktop Entry]
Name=Lurus Switch
Exec=/opt/lurus-switch
Icon=lurus-switch
Type=Application
Categories=Utility;Network;
EOF

# systemd 用户服务（开机自启）
mkdir -p ~/.config/systemd/user
cat > ~/.config/systemd/user/lurus-switch.service << EOF
[Unit]
Description=Lurus Switch AI Gateway

[Service]
ExecStart=/opt/lurus-switch --headless
Restart=on-failure

[Install]
WantedBy=default.target
EOF
systemctl --user enable --now lurus-switch
```
:::

---

## 설치 확인

실행 후 Switch는 로컬에서 프록시 서비스를 시작합니다(기본 포트 19090). 다음 명령을 실행해 JSON 모델 목록이 반환되면 성공입니다:

```bash
curl http://localhost:19090/v1/models
```

```json
{ "object": "list", "data": [ { "id": "deepseek-chat" }, { "id": "gpt-4o" } ] }
```

<div class="lurus-callout lurus-callout--info">
  <span class="lurus-callout__icon"><Icon name="alert-circle" :size="18" /></span>
  <div>
    <p class="lurus-callout__title">결과가 반환되지 않나요?</p>
    <div class="lurus-callout__body">Switch가 실행 중이고 프록시 서비스가 작동 중인지 확인하세요. 포트가 사용 중이라면 <a href="/ko/switch/configuration#代理端口配置">구성 설명</a>에서 수신 포트를 변경할 수 있습니다.</div>
  </div>
</div>

---

## 제거

<div class="lurus-cards lurus-cards--compact">
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Windows</div>
    <p class="lurus-card__body">제어판 → 프로그램 → 프로그램 제거 →「Lurus Switch」→ 제거.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">macOS</div>
    <p class="lurus-card__body">응용 프로그램 폴더의 「Lurus Switch」를 휴지통으로 드래그합니다. 구성 파일은 <code>~/Library/Application Support/LurusSwitch/</code>에 있습니다.</p>
  </div>
  <div class="lurus-card lurus-card--switch">
    <span class="lurus-card__icon"><Icon name="monitor" :size="20" /></span>
    <div class="lurus-card__title">Linux</div>
    <p class="lurus-card__body">바이너리, 데스크톱 바로 가기, systemd 서비스를 삭제합니다(아래 명령 참조).</p>
  </div>
</div>

```bash
rm /opt/lurus-switch
rm ~/.local/share/applications/lurus-switch.desktop
systemctl --user disable lurus-switch
rm ~/.config/systemd/user/lurus-switch.service
# 配置文件在 ~/.config/LurusSwitch/
```

---

## 다음 단계

<NextSteps :steps="[
  { text: '구성 설명', link: '/switch/configuration', primary: true },
  { text: '사용 설명서', link: '/switch/usage' },
  { text: 'API Key 발급', link: '/guide/get-api-key' },
]" title="" />

</div>

<style>
.switch-page .lurus-steps { margin: 16px 0; }
</style>
