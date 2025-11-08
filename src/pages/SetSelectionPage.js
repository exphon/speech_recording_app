import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecording } from '../contexts/RecordingContext';
import './SetSelectionPage.css';

function SetSelectionPage() {
  const navigate = useNavigate();
  const { language, setCustomData, setCustomScriptRaw } = useRecording();
  const [selectionType, setSelectionType] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parseError, setParseError] = useState('');

  const handleSelectionTypeClick = (type) => {
    setSelectionType(type);
    setParseError('');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      // 파일 선택 시 즉시 파싱하여 검증
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          parseTextFile(text); // 검증만 수행
          setCustomScriptRaw(text); // 원본 텍스트 저장
          setUploadedFile(file);
          setParseError('');
        } catch (error) {
          setUploadedFile(null);
          setParseError(error.message);
          // 파일 입력 초기화
          event.target.value = '';
        }
      };
      reader.readAsText(file);
    } else {
      setParseError(language === 'ko' 
        ? '.txt 파일만 업로드할 수 있습니다.' 
        : 'Please upload a .txt file only.');
      setUploadedFile(null);
      event.target.value = '';
    }
  };

  const parseTextFile = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    // 섹션 구분: 빈 줄이나 # 주석으로 구분
    const words = [];
    const sentences = [];
    let paragraph = '';
    
    let currentSection = 'words';
    
    for (const line of lines) {
      // 주석이나 섹션 헤더 처리
      if (line.startsWith('#')) {
        const lower = line.toLowerCase();
        if (lower.includes('word')) currentSection = 'words';
        else if (lower.includes('sentence')) currentSection = 'sentences';
        else if (lower.includes('paragraph')) currentSection = 'paragraph';
        continue;
      }
      
      // 데이터 추가
      if (currentSection === 'words' && words.length < 10) {
        words.push(line);
      } else if (currentSection === 'sentences' && sentences.length < 3) {
        sentences.push(line);
      } else if (currentSection === 'paragraph') {
        paragraph += (paragraph ? ' ' : '') + line;
      }
    }
    
    // 검증 - 더 자세한 에러 메시지
    if (words.length !== 10) {
      throw new Error(
        language === 'ko'
          ? `❌ 단어가 ${words.length}개입니다. 정확히 10개의 단어가 필요합니다.\n\n포맷을 확인하고 샘플 파일을 참고하여 다시 업로드해주세요.`
          : `❌ Found ${words.length} words. Exactly 10 words are required.\n\nPlease check the format and refer to the sample file.`
      );
    }
    if (sentences.length !== 3) {
      throw new Error(
        language === 'ko'
          ? `❌ 문장이 ${sentences.length}개입니다. 정확히 3개의 문장이 필요합니다.\n\n포맷을 확인하고 샘플 파일을 참고하여 다시 업로드해주세요.`
          : `❌ Found ${sentences.length} sentences. Exactly 3 sentences are required.\n\nPlease check the format and refer to the sample file.`
      );
    }
    if (!paragraph) {
      throw new Error(
        language === 'ko'
          ? `❌ 문단이 없습니다. 1개의 문단이 필요합니다.\n\n포맷을 확인하고 샘플 파일을 참고하여 다시 업로드해주세요.`
          : `❌ Paragraph is missing. 1 paragraph is required.\n\nPlease check the format and refer to the sample file.`
      );
    }
    
    return { words, sentences, paragraph };
  };

  const handleContinue = async () => {
    if (selectionType === 'default') {
      // 기본 세트 사용
      setCustomData(null);
      navigate('/word-reading');
    } else if (selectionType === 'upload' && uploadedFile) {
      // 파일이 이미 검증되었으므로 파싱만 수행
      try {
        const text = await uploadedFile.text();
        const parsedData = parseTextFile(text);
        setCustomScriptRaw(text); // 안전하게 다시 저장
        setCustomData(parsedData);
        navigate('/word-reading');
      } catch (error) {
        // 이론적으로는 여기 도달하지 않지만 안전장치
        setParseError(error.message);
      }
    }
  };

  const isDisabled = 
    !selectionType || 
    (selectionType === 'upload' && !uploadedFile);

  return (
    <div className="set-selection-page">
      <div className="set-selection-container">
        <h1 className="title">
          {language === 'ko' ? '녹음 데이터 선택' : 'Select Recording Data'}
        </h1>
        <p className="subtitle">
          {language === 'ko' 
            ? '기본 제공 세트를 사용하거나 커스텀 파일을 업로드하세요.'
            : 'Use the default set or upload a custom file.'}
        </p>

        <div className="selection-options">
          {/* 기본 세트 옵션 */}
          <div 
            className={`selection-card ${selectionType === 'default' ? 'selected' : ''}`}
            onClick={() => handleSelectionTypeClick('default')}
          >
            <div className="card-icon">📋</div>
            <h2>{language === 'ko' ? '기본 세트' : 'Default Set'}</h2>
            <p>
              {language === 'ko'
                ? '미리 준비된 단어, 문장, 문단을 사용합니다.'
                : 'Use pre-prepared words, sentences, and paragraphs.'}
            </p>
            <div className="card-details">
              <span>• {language === 'ko' ? '단어 10개' : '10 words'}</span>
              <span>• {language === 'ko' ? '문장 3개' : '3 sentences'}</span>
              <span>• {language === 'ko' ? '문단 1개' : '1 paragraph'}</span>
            </div>
          </div>

          {/* 파일 업로드 옵션 */}
          <div 
            className={`selection-card ${selectionType === 'upload' ? 'selected' : ''}`}
            onClick={() => handleSelectionTypeClick('upload')}
          >
            <div className="card-icon">📤</div>
            <h2>{language === 'ko' ? '파일 업로드' : 'Upload File'}</h2>
            <p>
              {language === 'ko'
                ? '커스텀 텍스트 파일을 업로드합니다.'
                : 'Upload a custom text file.'}
            </p>
            <div className="card-details">
              <span>• {language === 'ko' ? '.txt 파일만 가능' : '.txt files only'}</span>
              <span>• {language === 'ko' ? '정해진 포맷 필요' : 'Specific format required'}</span>
            </div>
          </div>
        </div>

        {/* 파일 업로드 영역 */}
        {selectionType === 'upload' && (
          <div className="upload-section">
            <div className="upload-info">
              <h3>{language === 'ko' ? '파일 포맷 안내' : 'File Format Guide'}</h3>
              <pre className="format-example">
{`# Words
word1
word2
...
(총 10개)

# Sentences
Sentence 1
Sentence 2
Sentence 3

# Paragraph
Your paragraph text here...`}
              </pre>
              
              <div className="sample-download">
                <p>{language === 'ko' ? '📥 샘플 파일 다운로드:' : '📥 Download Sample Files:'}</p>
                <div className="download-links">
                  <a 
                    href="/sample_korean.txt" 
                    download="sample_korean.txt"
                    className="download-link"
                  >
                    {language === 'ko' ? '한국어 샘플' : 'Korean Sample'}
                  </a>
                  <a 
                    href="/sample_english.txt" 
                    download="sample_english.txt"
                    className="download-link"
                  >
                    {language === 'ko' ? '영어 샘플' : 'English Sample'}
                  </a>
                </div>
              </div>
            </div>

            <label className="file-upload-label">
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="file-input"
              />
              <span className="upload-button">
                {uploadedFile 
                  ? `✓ ${uploadedFile.name}`
                  : (language === 'ko' ? '📁 파일 선택' : '📁 Choose File')}
              </span>
            </label>

            {parseError && (
              <div className="error-message">
                ⚠️ {parseError}
              </div>
            )}
          </div>
        )}

        {/* 계속 버튼 */}
        <button
          className={`continue-button ${isDisabled ? 'disabled' : ''}`}
          onClick={handleContinue}
          disabled={isDisabled}
        >
          {language === 'ko' ? '다음 단계로' : 'Continue'}
          <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}

export default SetSelectionPage;
