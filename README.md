<div align="center">

# 말하기 녹음 시스템 (Speech Recording System)

학습자 보이스 분석를 위한 웹 기반 음성 녹음 애플리케이션

<p>
<strong>단어 → 문장 → 문단</strong> 순서로 읽고 녹음하면,<br/>
<strong>녹음한 음성과 원문 텍스트를 브라우저에서 즉시 WAV / TXT / ZIP</strong> 형태로 내려받을 수 있습니다.
</p>

</div>

---

## 🗂 목차
1. [프로젝트 개요](#-프로젝트-개요)
2. [주요 기능](#-주요-기능)
3. [녹음 & 다운로드 기능 상세](#-녹음--다운로드-기능-상세)
4. [기술 스택](#-기술-스택)
5. [프로젝트 구조](#-프로젝트-구조)
6. [설치 & 실행](#-설치--실행)
7. [환경 변수](#-환경-변수-설정)
8. [데이터 / 처리 흐름](#-데이터-흐름)
9. [구현 세부 (Audio, API, 상태관리)](#-구현-세부)
10. [로드맵](#-향후-개발-계획)
11. [알려진 이슈](#-알려진-이슈)
12. [기여 & 라이선스](#-기여)
13. [변경/버전 기록](#-버전--변경-정보)

---

## 📋 프로젝트 개요

사용자가 표시된 텍스트(단어·문장·문단)를 순차적으로 읽어 음성을 녹음하고, (서버 연동 시) 전사 및 발음 평가를 받을 수 있는 **발음 수집 & 품질 측정용 웹 앱**입니다.

| 단계 | 내용 | 특징 |
|------|------|------|
| 단어 읽기 | 10개 단어 일괄 녹음 | 한 번의 녹음으로 묶음 처리 |
| 문장 읽기 | 문장 개별 녹음 | 진행률 & 순차 UI |
| 문단 읽기 | 1개 문단 전체 녹음 | 마지막 종합 단계 |
| 완료 페이지 | 전사/평가/다운로드 | Whisper 전사, ZIP 다운로드 |

---

## 🎯 주요 기능

### 핵심
- 브라우저 **MediaRecorder** 기반 음성 녹음 (에코 제거 / 노이즈 감소 옵션 적용)
- 전역 컨텍스트로 녹음 Blob & 원문 텍스트 구조적 보관
- WebM/Ogg → 16‑bit PCM **WAV 변환** (실패 시 원본 포맷 유지)
- 개별 WAV & TXT 다운로드 + 전체 ZIP 일괄 다운로드(JSZip)

### UI/경험
- 단계 진행률, 안내 메시지, 반응형 레이아웃
- 완료 페이지에서 녹음/전사/평가 결과 요약
- 로컬 모드(서버 미연결)에서도 전부 다운로드 가능

### 신뢰성 & 확장성
- 변환 실패 시 폴백 처리
- 타입별(recording type) 구조 분리로 향후 스피킹 문제/추가 카테고리 확장 용이

---

## 🎙 녹음 & 다운로드 기능 상세

### 저장 구조 (RecordingContext)
```ts
interface RecordingStore {
  words: { blob: Blob; text: string; filename: string } | null;
  sentences: Array<{ blob: Blob; text: string; filename: string; index: number }>;
  paragraph: { blob: Blob; text: string; filename: string } | null;
}
```

### WAV 변환 과정
1. MediaRecorder Blob → ArrayBuffer 로드
2. AudioContext.decodeAudioData 로 디코딩
3. 채널 데이터를 16-bit PCM 으로 직렬화
4. RIFF 헤더 작성 후 Blob(audio/wav) 생성
5. 예외 발생 시 원본 Blob 사용 (.webm / .ogg)

### 다운로드 옵션
| 종류 | 제공 파일 | 규칙 |
|------|-----------|------|
| 단어 묶음 | words_all.wav / words_all.txt | 전체 단어 CSV 형태(쉼표 구분) |
| 문장 | sentence_01.wav / sentence_01.txt ... | 두 자리 인덱스 패딩 |
| 문단 | paragraph.wav / paragraph.txt | 단락 전체 문자열 |
| ZIP | recordings/ 하위 폴더 구조 | 시간기반 이름 recordings_YYYYMMDDHHMMSS.zip |

### ZIP 구조 예시
```
recordings/
  words/
    words_all.wav
    words_all.txt
  sentences/
    sentence_01.wav
    sentence_01.txt
    sentence_02.wav
    sentence_02.txt
  paragraph/
    paragraph.wav
    paragraph.txt
```

### 사용 방법
1. 단어 → 문장 → 문단 녹음을 완료하고 완료 페이지로 이동
2. "📥 녹음 파일 다운로드" 섹션에서 개별 또는 ZIP 다운로드 선택
3. 변환은 즉시 클라이언트에서 수행되며 서버 불필요

### 성능 & 주의사항
- 긴 녹음(수 분 이상) 변환 시 메모리/CPU 사용량 증가 가능
- iOS Safari 구형 버전은 MediaRecorder 제약 가능 → 폴백 필요(추후 개선 여지)
- Web Worker 오프로딩 미적용(필요 시 개선 예정)

### 추가 개선 아이디어
- 선택 항목만 ZIP 포함 (체크박스)
- 변환 진행률 & 스피너 UI
- 샘플레이트/채널 다운샘플 옵션
- 재생/파형 시각화(예: wavesurfer.js)

---

## 🛠 기술 스택

| 영역 | 사용 기술 |
|------|-----------|
| UI | React 19, React Router DOM |
| 상태 | React Context (RecordingContext) |
| 네트워크 | Axios |
| 오디오 캡처 | MediaRecorder API, AudioContext (디코딩) |
| 빌드 | Create React App (react-scripts) |
| 번들 추가 | JSZip (ZIP), (FileSaver 대체: a.href 클릭) |
| 평가 | Levenshtein 거리 기반 점수 계산 (utils/levenshtein.js) |
| 전사(서버) | Whisper (Django 백엔드 연동 예정) |

---

## 📁 프로젝트 구조
```
src/
  components/
    RecordButton.js
    DownloadRecordings.js
  contexts/
    RecordingContext.js
  pages/
    WordReadingPage.js
    SentenceReadingPage.js
    ParagraphReadingPage.js
    CompletionPage.js
  services/
    api.js
  utils/
    audioRecorder.js
    levenshtein.js
  data/
    pronData.js
```

---

## 🚀 설치 & 실행
```bash
git clone <repo-url>
cd speech-recording-app
npm install
npm start
```

### 빌드 (CRA)
```bash
npm run build
```
현재 Node 22 환경에서 react-scripts 실행 문제가 있을 수 있습니다. 권장: Node 18 LTS.

### Node 버전 맞추기 (nvm 사용 권장)
```bash
nvm install 18
nvm use 18
node -v   # 18.x 확인
```

프로젝트 루트에 `.nvmrc` (18) 파일이 추가되어 있으므로 `nvm use` 만으로 자동 적용됩니다.

---

---

## 🔄 데이터 흐름
```
사용자 발화 → MediaRecorder 녹음 → Blob/Context 저장 → 결과 표시 & 로컬 다운로드
```

---

## 🔬 구현 세부

### AudioRecorder
- 권한 요청 + mimeType 호환 탐색 → 시작/중지 → Blob 조립

### RecordingContext
- 구조화 저장 + WAV 변환 + 다운로드 헬퍼 (downloadBlob, downloadText)


---

## 🧭 향후 개발 계획
| Phase | 항목 | 상태 |
|-------|------|------|
| 1 | 기본 녹음/페이지/업로드 | ✅ |
| 2 | 전사 + 평가 + 다운로드 | ✅ (다운로드 포함) |
| 3 | 적응형 문제, 통계, 인증 | 예정 |
| 4 | 고급 UX (파형, 진행률, 편집) | 예정 |

---

## 🐛 알려진 이슈
1. Node 22 + react-scripts 호환 문제 (빌드/테스트 실패 가능)
2. 긴 녹음 WAV 변환 시 CPU 급상승
3. iOS MediaRecorder 제약 → 폴백 미구현

---

## 👥 기여
Issue / PR 환영. 코드 스타일: CRA 기본 ESLint 규칙 준수. 대규모 변경 전 이슈로 제안 바랍니다.

## 📝 라이선스
교육 목적 내부 사용. 별도 명시 없으면 All Rights Reserved.

---

## 🗓 버전 & 변경 정보
| 버전 | 날짜 | 주요 변경 |
|------|------|-----------|
| 1.1.0 | 2025-10-22 | 기본 녹음/업로드/전사 UI |
| 1.2.0 | 2025-11-08 | WAV 변환 + 개별 & ZIP 다운로드 기능 추가 |

---

## 🙋 FAQ
**Q. 서버 없이도 쓸 수 있나요?**  가능. 

**Q. WAV 변환이 오래 걸려요.** 긴 녹음/저사양 기기일 수 있습니다. 향후 Web Worker 지원 예정.

**Q. 다운로드된 파일이 재생 안 돼요.** 일부 플레이어가 opus 변환 실패 폴백(webm/ogg)을 지원하지 않을 수 있습니다.

---

## ✅ 빠른 체크리스트 (운영 전)
- [ ] Node 18 LTS 사용
- [ ] 긴 녹음(>2분) 변환 테스트
- [ ] ZIP 다운로드 정상 여부 확인

---

즐거운 개발 되세요! 🚀

음성 녹음 기반 시스템입니다. 사용자가 단어, 문장, 문단을 읽으면 음성을 녹음하고 다운로드 받을 수 있습니다.

## 📋 프로젝트 개요

이 시스템은 다음과 같은 단계로 구성됩니다:
1. **단어 읽기**: 10개의 단어를 읽고 녹음
2. **문장 읽기**: 3개의 문장을 읽고 녹음
3. **문단 읽기**: 1개의 문단을 읽고 녹음

## 🛠 기술 스택

### Frontend
- **React 18**: UI 라이브러리
- **React Router DOM**: 페이지 라우팅
- **Axios**: HTTP 클라이언트
- **MediaRecorder API**: 브라우저 기반 음성 녹음


## 📁 프로젝트 구조

```
speech-evaluation-app/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── RecordButton.js         # 녹음 버튼 컴포넌트
│   │   └── RecordButton.css
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── IndexPage.js            # 메인 페이지
│   │   ├── InstructionPage.js      # 안내 페이지
│   │   ├── WordReadingPage.js      # 단어 읽기 페이지
│   │   ├── SentenceReadingPage.js  # 문장 읽기 페이지
│   │   ├── ParagraphReadingPage.js # 문단 읽기 페이지
│   │   └── CompletionPage.js       # 완료 페이지
│   ├── services/           # API 서비스
│   │   └── api.js                  # 서버 통신 함수
│   ├── utils/             # 유틸리티
│   │   └── audioRecorder.js        # 녹음 유틸리티 클래스
│   ├── data/              # 테스트 데이터
│   │   └── testData.js             # 단어, 문장, 문단 데이터
│   ├── App.js             # 메인 앱 컴포넌트
│   └── index.js           # 진입점
├── package.json
└── README.md
```

## 🎯 주요 기능

### 1. 음성 녹음 시스템
- **MediaRecorder API** 사용
- 브라우저 마이크 권한 요청 및 관리
- 실시간 녹음 시간 표시
- 녹음 재생 및 재녹음 기능
- 지원 포맷: WebM, Ogg, MP4 (브라우저 호환성)

### 2. 사용자 인터페이스
- **반응형 디자인**: 모바일/태블릿/데스크톱 지원
- **단계별 진행 표시**: 프로그레스 바 및 진행률
- **애니메이션**: 부드러운 페이지 전환 효과
- **직관적인 UX**: 명확한 안내 메시지 및 버튼

### 3. 페이지별 기능

#### IndexPage (메인 페이지)
- 시스템 소개 및 환영 메시지
- 평가 구성 안내
- 참가하기 버튼

#### InstructionPage (안내 페이지)
- 녹음 방법 상세 설명
- 주의사항 안내
- 개인정보 처리 동의
- 동의 후 평가 시작

#### WordReadingPage (단어 읽기)
- 10개 단어 순차적 제시
- 단어별 녹음 및 저장
- 진행률 표시
- 녹음 재생/재녹음 기능

#### SentenceReadingPage (문장 읽기)
- 3개 문장 순차적 제시
- 문장별 녹음 및 저장
- 이전 녹음 데이터 유지

#### ParagraphReadingPage (문단 읽기)
- 문단 전체 표시
- 한 번에 녹음
- 녹음 팁 제공

#### CompletionPage (완료 페이지)
- 녹음 요약 표시
- 서버 업로드 기능 (준비됨)
- 다음 단계 안내

## 🔧 기술 구현 상세

### AudioRecorder 클래스
```javascript
class AudioRecorder {
  - initialize(): 마이크 권한 요청 및 MediaRecorder 설정
  - start(): 녹음 시작
  - stop(): 녹음 중지 및 Blob 반환
  - cleanup(): 리소스 정리
  - getSupportedMimeType(): 브라우저 호환 포맷 확인
}
```

**핵심 기능:**
- Echo Cancellation: 에코 제거
- Noise Suppression: 노이즈 감소
- Auto Gain Control: 자동 음량 조절

### API 서비스 (준비됨)
```javascript
- uploadAudio(): 음성 파일 서버 업로드
- transcribeAudio(): Whisper 음성 전사
- evaluatePronunciation(): OpenAI 발음 평가
- getAdaptiveQuestion(): 적응형 문제 요청
```

### 상태 관리
- React Hooks (useState, useEffect) 사용
- React Router의 location.state로 페이지 간 데이터 전달
- 녹음 데이터는 배열로 관리 및 전달

## 🚀 시작하기

### 필수 요구사항
- Node.js 14 이상
- npm 또는 yarn
- 최신 브라우저 (Chrome, Firefox, Safari, Edge)

### 설치 및 실행

```bash
# 프로젝트 디렉토리로 이동
cd speech-evaluation-app

# 의존성 패키지 설치
npm install

# 개발 서버 실행
npm start
```

개발 서버가 실행되면 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

### 프로덕션 빌드

```bash
# 프로덕션 빌드 생성
npm run build
```

빌드된 파일은 `build/` 폴더에 생성됩니다.

## 🔐 브라우저 권한

이 애플리케이션은 다음 권한이 필요합니다:
- **마이크 접근 권한**: 음성 녹음을 위해 필수

### 권한 허용 방법
1. 첫 녹음 시도 시 브라우저가 권한 요청
2. "허용" 클릭
3. HTTPS 환경에서만 작동 (localhost는 예외)

## 📱 브라우저 호환성

| 브라우저 | 지원 여부 | 비고 |
|---------|----------|------|
| Chrome | ✅ | 완전 지원 |
| Firefox | ✅ | 완전 지원 |
| Safari | ✅ | iOS 14.3 이상 |
| Edge | ✅ | Chromium 기반 |
| IE | ❌ | 지원 안 함 |


## 📊 데이터 흐름

```
[사용자 음성 입력]
    ↓
[MediaRecorder API - 브라우저 녹음]
    ↓
[Blob 생성 및 메모리 저장]
    ↓
[CompletionPage - 업로드 버튼 클릭]
```

## 🎨 디자인 특징

- **그라데이션 배경**: 페이지별 고유 색상
- **카드 기반 레이아웃**: 깔끔한 컨텐츠 구성
- **애니메이션**: fadeIn, slideIn, bounce 효과
- **반응형**: 모바일 우선 디자인
- **접근성**: 의미있는 HTML 구조

## 🔄 향후 개발 계획

### Phase 1 (완료)
- ✅ React 프로젝트 기본 구조
- ✅ 음성 녹음 기능
- ✅ 페이지 라우팅
- ✅ UI/UX 구현



## 🐛 알려진 이슈

1. **Safari iOS**: 일부 구형 버전에서 MediaRecorder 미지원
2. **파일 크기**: 긴 녹음은 파일 크기가 클 수 있음
3. **네트워크**: 업로드 시 안정적인 인터넷 연결 필요

## 📝 라이센스

이 프로젝트는 교육 및 연구 목적으로 개발되었습니다.

## 👥 기여

버그 리포트 및 기능 제안은 이슈 트래커를 통해 제출해주세요.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**개발 일자**: 2025년 10월 21-22일  
**버전**: 1.1.0  



# speech_recording_app
