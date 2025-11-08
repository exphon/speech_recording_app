import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RecordButton from '../components/RecordButton';
import { useRecordings, RECORDING_TYPES } from '../contexts/RecordingContext';
import { words as wordsKo } from '../data/pronData';
import { words as wordsEn } from '../data/pronEnData';
import { logger } from '../utils/logger';
import './WordReadingPage.css';

/**
 * 단어 읽기 페이지
 * 10개의 단어를 한꺼번에 보여주고 한 번에 녹음
 */
const WordReadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [recording, setRecording] = useState(null);
  const [showPlayback, setShowPlayback] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // null | 'uploading' | 'success' | 'error'
  const [sessionId, setSessionId] = useState(null);
  const [meta, setMeta] = useState(null);

  const { addRecording, customData } = useRecordings();

  // 언어에 따라 단어 선택 (커스텀 데이터 우선)
  const assessmentLanguage = location.state?.meta?.assessment_language || 'ko';
  const words = customData?.words || (assessmentLanguage === 'en' ? wordsEn : wordsKo);

  // 세션 ID 가져오기
  useEffect(() => {
    if (location.state?.sessionId !== undefined) setSessionId(location.state.sessionId);
    if (location.state?.meta) setMeta(location.state.meta);
  }, [location.state]);

  const handleRecordingComplete = async (audioBlob) => {
    setRecording(audioBlob);
    setShowPlayback(true);

    // 로컬 저장만 수행 (서버 업로드 제거)
    logger.log('✅ 로컬 저장 완료');
    setUploadStatus('success');

    // 컨텍스트에 로컬 녹음 저장
    const allWordsText = words.join(', ');
    addRecording(audioBlob, allWordsText, RECORDING_TYPES.WORDS);
  };

  const handleNext = () => {
    if (recording && uploadStatus === 'success') {
      // 문장 읽기로 이동
      navigate('/sentence-reading', { 
        state: { 
          sessionId: sessionId,
          meta: meta,
        }
      });
    }
  };

  return (
    <div className="word-reading-page">
      <div className="reading-container">
        <div className="header">
          <h1 className="page-title">단어 읽기</h1>
          <p className="instruction-subtitle">다음 {words.length}개의 단어를 순서대로 읽어주세요</p>
        </div>

        <div className="words-display">
          <div className="words-grid">
            {words.map((word, index) => (
              <div key={index} className="word-item">
                <span className="word-number">{index + 1}</span>
                <span className="word-text">{word}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="recording-section">
          {!showPlayback ? (
            <>
              <RecordButton 
                onRecordingComplete={handleRecordingComplete}
              />
              <p className="instruction-text">
                🎤 녹음 버튼을 눌러 위의 단어들을 순서대로 또박또박 읽어주세요
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
                    문장 읽기로 이동 →
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
      </div>
    </div>
  );
};

export default WordReadingPage;
