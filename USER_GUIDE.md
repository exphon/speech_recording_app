# 사용자 가이드 (Speech Recording App)

이 문서는 참가자와 운영자를 위한 실제 사용 방법을 설명합니다. 이 앱은 브라우저만으로 동작하며, 녹음 데이터는 서버로 전송하지 않고 ZIP으로 로컬 저장됩니다.

---

## 빠른 시작 (참가자)

1) 브라우저에서 앱 접속 후 언어 선택 (한국어/영어)
2) 메타정보 입력 (언어별 양식)
3) 데이터 선택: 기본 세트 사용 또는 .txt 업로드
4) 단어 → 문장 → 문단 순서로 녹음 진행
5) 완료 화면에서 ZIP 다운로드 (음성 + 텍스트 + 메타정보 + 업로드 원본)

---

## 페이지별 안내

### 1️⃣ 메인/메타정보
- 언어 선택 후, 해당 언어 메타정보를 입력합니다.
- 메타정보 완료 시 “데이터 선택” 단계로 이동합니다.
  
  예시 화면: ![Meta Info](public/screenshots/meta_info.png)

### 2️⃣ 데이터 선택 (SetSelectionPage)
- 기본 세트: 내장된 단어/문장/문단을 사용
- 파일 업로드: 형식화된 .txt 업로드
  - 업로드 즉시 포맷 검증 수행
  - 형식 오류 시 상세 에러(한/영) 표시 및 업로드 취소
  - 성공 시 이후 녹음 단계에서 해당 내용이 표시됩니다.
  
  예시 화면: ![Set Selection](public/screenshots/set_selection.png)

업로드 포맷:
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
- Words: 공백 제거 후 정확히 10개
- Sentences: 정확히 3개
- Paragraph: 비어 있지 않아야 함
- `#` 시작 라인은 주석/섹션 헤더로 인식, 빈 줄은 무시

샘플 파일: `public/sample_korean.txt`, `public/sample_english.txt`

### 3️⃣ 단어 읽기 (WordReadingPage)
- 10개 단어를 순서대로 녹음합니다. 기본 세트 또는 업로드한 내용이 표시됩니다.
- 버튼
  - 녹음 시작/중지
  - 다시 녹음
  - 다음으로 이동
  
  예시 화면: ![Word Reading](public/screenshots/word_reading.png)

### 4️⃣ 문장 읽기 (SentenceReadingPage)
- 3개 문장을 개별로 녹음합니다.
- 각 문장에 대해 시작/중지, 재녹음 후 다음으로 이동합니다.
  
  예시 화면: ![Sentence Reading](public/screenshots/sentence_reading.png)

### 5️⃣ 문단 읽기 (ParagraphReadingPage)
- 1개 문단을 한 번에 녹음합니다.
- 읽기 팁: 또박또박, 자연스러운 쉼, 일정한 음량을 유지하세요.
  
  예시 화면: ![Paragraph Reading](public/screenshots/paragraph_reading.png)

### 6️⃣ 완료 (CompletionPage)
- ZIP 다운로드 버튼을 통해 모든 녹음과 텍스트, 메타정보를 한 번에 내려받습니다.
- 업로드 원본(.txt)을 사용했다면 ZIP 루트에 `custom_script_{ko|en}.txt`가 포함됩니다.
  
  예시 화면: ![Completion](public/screenshots/completion.png)

ZIP 구조:
```
recordings_YYYYMMDDHHMMSS.zip
├── metadata.json
├── custom_script_ko.txt (옵션)
├── custom_script_en.txt (옵션)
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

---

## 팁과 주의사항

환경: 조용한 공간, 배경 소음 최소화, 마이크와 20~30cm 거리 유지

발음: 또박또박, 너무 빠르거나 느리지 않게, 문장 사이 자연스러운 쉼

브라우저: 최신 버전(Chrome/Edge/Firefox/Safari), 녹음 중 새로고침 금지

권한: 마이크 권한 허용. 주소창 자물쇠 → 사이트 설정 → 마이크 허용 후 새로고침

---

## 문제 해결 (Troubleshooting)

- 마이크 권한 거부: 사이트 설정에서 마이크 허용 후 새로고침
- 소리가 작거나 왜곡: 마이크 거리/입력 감도 조정, 배경 소음 제거
- 업로드(.txt) 실패: 섹션/개수 규칙을 지키고 샘플 파일 형식을 따르세요
- ZIP에 커스텀 파일이 없음: 기본 세트 사용 시 포함되지 않습니다. 업로드 사용 후 재다운로드
- 페이지가 이동하지 않음: 해당 단계의 녹음이 완료되었는지 확인, 브라우저 콘솔 에러 점검

---

## 개인정보 및 보안

- 이 앱은 100% 로컬로 동작하며, 서버 업로드를 수행하지 않습니다.
- 내려받은 ZIP은 사용자 측 장치에 저장됩니다.
- 운영자용 배포/보안 안내는 `README.md`의 보안/트러블슈팅 섹션을 참고하세요.

---

최종 업데이트: 2025년 11월 08일

부록: 스크린샷 추가 방법
1) `public/screenshots/` 폴더에 이미지 파일(PNG/JPG) 추가
2) 위 문서의 이미지 경로(파일명)를 상황에 맞게 교체
3) `git add` → `commit` → `push`
