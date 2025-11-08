import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RecordButton from '../components/RecordButton';
import { useRecordings, RECORDING_TYPES } from '../contexts/RecordingContext';
import { sentences as sentencesKo } from '../data/pronData';
import { sentences as sentencesEn } from '../data/pronEnData';
import { logger } from '../utils/logger';
import './SentenceReadingPage.css';

/**
 * 문장 읽기 페이지
 */
const SentenceReadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordings, setRecordings] = useState([]);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [showPlayback, setShowPlayback] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const { addRecording, customData } = useRecordings();

  const sessionId = location.state?.sessionId;
  const meta = location.state?.meta;
  const wordRecordings = location.state?.wordRecordings || (location.state?.wordRecording ? [{ id: null, title: '단어 읽기 (10개)' }] : []);
  
  // 언어에 따라 문장 선택 (커스텀 데이터 우선)
  const assessmentLanguage = meta?.assessment_language || 'ko';
  const sentences = customData?.sentences || (assessmentLanguage === 'en' ? sentencesEn : sentencesKo);
  
  const currentSentence = sentences[currentIndex];
  const isLastSentence = currentIndex === sentences.length - 1;
  const progress = ((currentIndex + 1) / sentences.length) * 100;

  const handleRecordingComplete = async (audioBlob) => {
    setCurrentRecording(audioBlob);
    setShowPlayback(true);

    // 로컬 저장만 수행 (서버 업로드 제거)
    logger.log('✅ 로컬 저장 완료');
    setUploadStatus('success');
    
    setRecordings([...recordings, {
      id: null,
      sentence: currentSentence,
      title: `문장 ${currentIndex + 1}: ${currentSentence}`,
      audio: audioBlob,
      recordingId: null
    }]);
  };

  // 문장 녹음이 성공(서버 업로드 여부와 무관) 시 컨텍스트 저장
  useEffect(() => {
    if (showPlayback && currentRecording && uploadStatus === 'success') {
      addRecording(currentRecording, currentSentence, RECORDING_TYPES.SENTENCE, currentIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPlayback, uploadStatus]);

  const handleNext = () => {
    if (currentRecording && uploadStatus === 'success') {
      if (isLastSentence) {
        // 모든 문장 녹음 완료 - 문단 읽기로 이동
        navigate('/paragraph-reading', { 
          state: { 
            wordRecordings: wordRecordings,
            sentenceRecordings: recordings,
            sessionId: sessionId,
            meta: meta,
          }
        });
      } else {
        // 다음 문장으로
        setCurrentIndex(currentIndex + 1);
        setCurrentRecording(null);
        setShowPlayback(false);
        setUploadStatus(null);
      }
    }
  };

  return (
    <div className="sentence-reading-page">
      <div className="reading-container">
        <div className="header">
          <h1 className="page-title">문장 읽기</h1>
          <div className="progress-info">
            <span className="progress-text">
              {currentIndex + 1} / {sentences.length}
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="sentence-display">
          <div className="sentence-card">
            <p className="sentence-label">다음 문장을 읽어주세요</p>
            <h2 className="sentence-text">{currentSentence}</h2>
          </div>
        </div>

        <div className="recording-section">
          {!showPlayback ? (
            <>
              <RecordButton 
                onRecordingComplete={handleRecordingComplete}
              />
              <p className="instruction-text">
                🎤 녹음 버튼을 눌러 문장을 자연스럽게 읽어주세요
              </p>
            </>
          ) : (
            <div className="playback-section">
              {uploadStatus === 'uploading' && (
                <div className="upload-status uploading">
                  ⏳ 서버에 업로드 중...
                </div>
              )}
              
              {uploadStatus === 'success' && (
                <>
                  <div className="upload-status success">
                    {sessionId ? '✅ 업로드 완료!' : '✅ 녹음 완료! (로컬 저장)'}
                  </div>
                  <button 
                    className="next-button"
                    onClick={handleNext}
                  >
                    {isLastSentence ? '문단 읽기로 이동 →' : '다음 문장 →'}
                  </button>
                </>
              )}

              {uploadStatus === 'error' && (
                <div className="upload-status error">
                  ❌ 업로드 실패. 다시 녹음해주세요.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="recorded-count">
          녹음 완료: {recordings.length} / {sentences.length}
        </div>
      </div>
    </div>
  );
};

export default SentenceReadingPage;
