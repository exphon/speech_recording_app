<div align="center">

# 말하기 녹음 시스템 (Speech Recording System)

학습자 발음 평가를 위한 웹 기반 음성 녹음 애플리케이션

**단어 → 문장 → 문단** 순서로 읽고 녹음하면, **녹음한 음성과 원문 텍스트, 메타정보를 브라우저에서 즉시 ZIP** 형태로 내려받을 수 있습니다.

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Node-18-green.svg)](https://nodejs.org/)

</div>

---

## 📋 프로젝트 개요

사용자가 표시된 텍스트(단어·문장·문단)를 순차적으로 읽어 음성을 녹음하고, 녹음 파일과 메타정보를 함께 다운로드할 수 있는 **발음 수집용 웹 애플리케이션**입니다.

| 단계 | 내용 |
|------|------|
| 언어 선택 | 한국어 / 영어 선택 |
| 메타정보 입력 | 언어별 참여자 정보 수집 |
| 데이터 선택 | 기본 세트 또는 커스텀 .txt 업로드 (검증 포함) |
| 단어 읽기 | 10개 단어 일괄 녹음 |
| 문장 읽기 | 3개 문장 개별 녹음 |
| 문단 읽기 | 1개 문단 전체 녹음 |
| 완료 | ZIP 다운로드 (녹음 + 텍스트 + 메타정보 + 커스텀 원본) |

---

## 🎯 주요 기능

- 🎤 **브라우저 기반 녹음**: MediaRecorder API
- 🔄 **자동 WAV 변환**: WebM/Ogg → 16-bit PCM WAV
- 📦 **ZIP 다운로드**: 모든 파일 일괄 압축
- 📝 **메타정보 포함**: metadata.json 자동 생성
- 🌐 **다국어 지원**: 한국어 / 영어
- ✨ **모던 UI**: 그라데이션, 애니메이션
- 💾 **100% 로컬**: 서버 불필요
- 📤 **커스텀 스크립트 업로드**: 사용자가 형식 지정된 .txt로 단어·문장·문단 직접 제공
- ✅ **엄격한 포맷 검증**: 업로드 즉시 구조(10 단어 / 3 문장 / 1 문단) 및 비어있음 검사

---

## 💻 시스템 요구사항

### 개발 환경
- Node.js 18.x (권장)
- npm 9.x 이상
- 모던 브라우저 (Chrome, Firefox, Safari, Edge)

### 프로덕션 환경
- Node.js 18.x
- PM2 (프로세스 관리)
- nginx (리버스 프록시)
- SSL 인증서 (Let's Encrypt 권장)
- Linux 서버 (Ubuntu/Debian 권장)

---

## 🎙 다운로드 파일 구조

```
recordings_YYYYMMDDHHMMSS.zip
├── metadata.json
├── custom_script_ko.txt (옵션, 한국어 업로드 시)
├── custom_script_en.txt (옵션, 영어 업로드 시)
├── words/
│   ├── words_all.wav
│   └── words_all.txt
├── sentences/
│   ├── sentence_01.wav
│   ├── sentence_01.txt
│   ├── sentence_02.wav
│   ├── sentence_02.txt
│   └── sentence_03.wav
│       └── sentence_03.txt
└── paragraph/
    ├── paragraph.wav
    └── paragraph.txt
```

> 커스텀 스크립트 파일은 사용자가 업로드한 원본 텍스트 그대로 포함되어 재현 가능성을 높입니다.

### 커스텀 업로드 (.txt) 포맷

샘플(`public/sample_korean.txt`, `public/sample_english.txt`)과 동일한 구조를 따라야 하며, 정확한 개수 미달/초과 시 업로드가 거부됩니다.

```
# Words
word1
word2
...
(총 10개 단어)

# Sentences
Sentence 1
Sentence 2
Sentence 3

# Paragraph
여기에 문단 전체 텍스트를 한 줄 이상으로 작성할 수 있습니다.
줄바꿈은 합쳐져 하나의 문단 문자열로 저장됩니다.
```

검증 규칙:
1. Words 섹션: 공백 제거 후 10개 정확히 필요
2. Sentences 섹션: 3개 정확히 필요
3. Paragraph 섹션: 최소 1개 이상 문장(비어 있으면 실패)
4. `#` 로 시작하는 라인은 주석 및 섹션 헤더로 인식
5. 빈 줄은 무시되며 문단은 여러 줄을 공백으로 이어붙여 저장
6. 형식 불일치 시 다국어(한국어/영어) 상세 에러 메시지 표시 + 파일 입력 초기화

업로드 성공 시:
- 파싱된 구조는 내부 상태(`customData`)로 저장되어 녹음 페이지에서 기본 세트 대신 표시
- 원본 문자열은 ZIP 내 `custom_script_{ko|en}.txt` 로 보존

---

## 🚀 설치 & 실행

### 개발 환경

```bash
# 클론
git clone https://github.com/exphon/speech_recording_app.git
cd speech_recording_app

# Node 18 사용 (권장)
nvm use 18

# 의존성 설치
npm install

# react-scripts 설치 (필요시)
npm install react-scripts@5.0.1 --save

# 개발 서버 실행
npm start
```

개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

### 프로덕션 배포 (nginx + PM2)

#### 1. 환경 설정

`.env` 파일을 생성하여 개발 환경 설정:

```bash
# 개발 환경 설정 (nginx 리버스 프록시 사용)
PORT=3000
HTTPS=false
HOST=localhost
```

#### 2. PM2로 프로세스 관리

```bash
# PM2 설치
sudo npm install -g pm2

# PM2로 애플리케이션 시작
cd /var/www/app/speech_recording_app
pm2 start ecosystem.config.json

# 프로세스 목록 저장
pm2 save

# 시스템 부팅 시 자동 시작 설정
pm2 startup
# 출력된 명령어를 실행

# PM2 상태 확인
pm2 status

# 로그 확인
pm2 logs speech-recording-app
```

#### 3. nginx 리버스 프록시 설정

HTTPS로 서비스하기 위한 nginx 설정 (`/etc/nginx/sites-available/speech-app`):

```nginx
server {
    listen 3010 ssl http2;
    listen [::]:3010 ssl http2;
    
    server_name yourdomain.com;

    # SSL 인증서 설정 (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL 보안 설정
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 리버스 프록시 설정
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        
        # WebSocket 지원 (HMR)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # 프록시 헤더
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

nginx 설정 적용:

```bash
# 설정 파일 활성화
sudo ln -s /etc/nginx/sites-available/speech-app /etc/nginx/sites-enabled/

# 설정 검증
sudo nginx -t

# nginx 재시작
sudo systemctl reload nginx
```

#### 4. 서비스 관리

```bash
# 애플리케이션 재시작
pm2 restart speech-recording-app

# 애플리케이션 중지
pm2 stop speech-recording-app

# 애플리케이션 삭제
pm2 delete speech-recording-app

# 실시간 모니터링
pm2 monit

# 로그 확인
pm2 logs speech-recording-app --lines 100
```

#### 배포 구조

```
Browser (https://yourdomain.com:3010)
    ↓
nginx (포트 3010, HTTPS, SSL 인증서)
    ↓
React App (localhost:3000, HTTP, PM2 관리)
```

**특징:**
- ✅ 24/7 지속적인 서비스
- ✅ 서버 재부팅 시 자동 재시작
- ✅ 크래시 시 자동 복구
- ✅ HTTPS 보안 연결
- ✅ 무중단 배포 가능

---

## 🛠 기술 스택

### Frontend
- React 19.2.0
- React Router DOM 7.9.4
- MediaRecorder API
- AudioContext
- JSZip 3.10.1
- file-saver 2.0.5

### Process Management
- PM2 (프로세스 관리 및 모니터링)
- systemd (자동 시작 서비스)

### Web Server
- nginx (리버스 프록시, HTTPS)
- Let's Encrypt (SSL 인증서)

### State Management
- React Context API

---

## 📝 변경 기록

### v2.1.0 (2025-11-08)
- **프로덕션 배포 설정 추가**
  - PM2 프로세스 관리 도입
  - nginx 리버스 프록시 설정
  - HTTPS 지원 (Let's Encrypt)
  - 24/7 지속적 서비스 보장
  - 시스템 부팅 시 자동 시작

### v2.2.0 (2025-11-08)
- 커스텀 스크립트 업로드/검증 기능 추가
- 업로드된 원본 텍스트 ZIP 포함 (`custom_script_ko.txt` / `custom_script_en.txt`)
- 선택 페이지(`SetSelectionPage`)를 메타정보 이후 단계에 삽입
- 다국어 상세 오류 메시지 및 시각적 에러 강조(애니메이션) 적용

### v2.0.0 (2025-11-08)
- 언어 선택 기능 (한국어/영어)
- 메타정보 수집 및 JSON 포함
- 서버 의존성 완전 제거 (100% 로컬)
- UI 현대화, 다운로드 간소화

---

## 👤 작성자

**exphon** - [GitHub](https://github.com/exphon/speech_recording_app)

---

**Made with ❤️ for language learners**
