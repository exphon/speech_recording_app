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
| 단어 읽기 | 10개 단어 일괄 녹음 |
| 문장 읽기 | 3개 문장 개별 녹음 |
| 문단 읽기 | 1개 문단 전체 녹음 |
| 완료 | ZIP 다운로드 (녹음 + 텍스트 + 메타정보) |

---

## 🎯 주요 기능

- 🎤 **브라우저 기반 녹음**: MediaRecorder API
- 🔄 **자동 WAV 변환**: WebM/Ogg → 16-bit PCM WAV
- 📦 **ZIP 다운로드**: 모든 파일 일괄 압축
- 📝 **메타정보 포함**: metadata.json 자동 생성
- 🌐 **다국어 지원**: 한국어 / 영어
- ✨ **모던 UI**: 그라데이션, 애니메이션
- 💾 **100% 로컬**: 서버 불필요

---

## 🎙 다운로드 파일 구조

```
recordings_YYYYMMDDHHMMSS.zip
├── metadata.json
├── words/
│   ├── words_all.wav
│   └── words_all.txt
├── sentences/
│   ├── sentence_01.wav
│   ├── sentence_01.txt
│   ├── sentence_02.wav
│   ├── sentence_02.txt
│   └── sentence_03.wav
│   └── sentence_03.txt
└── paragraph/
    ├── paragraph.wav
    └── paragraph.txt
```

---

## 🚀 설치 & 실행

```bash
# 클론
git clone https://github.com/exphon/speech_recording_app.git
cd speech-recording-app

# Node 18 사용 (권장)
nvm use 18

# 설치 & 실행
npm install
npm start
```

---

## 🛠 기술 스택

- React 19.2.0, React Router DOM 7.9.4
- MediaRecorder API, AudioContext
- JSZip 3.10.1, file-saver 2.0.5
- React Context (상태관리)

---

## 📝 변경 기록

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
