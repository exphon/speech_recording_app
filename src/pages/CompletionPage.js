import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CompletionPage.css';
import DownloadRecordings from '../components/DownloadRecordings';

/**
 * 녹음 완료 페이지 (로컬 다운로드 전용)
 */
const CompletionPage = () => {
  const navigate = useNavigate();

  const handleRestart = () => {
    navigate('/');
  };

  return (
    <div className="completion-page">
      <div className="completion-container">
        <div className="success-icon">🎉</div>
        
        <h1 className="completion-title">
          말소리 녹음이 완료되었습니다!
        </h1>
        
        <p className="completion-message">
          수고하셨습니다. 녹음된 모든 파일을 다운로드할 수 있습니다.
        </p>

        {/* 다운로드 컴포넌트 */}
        <DownloadRecordings />

        {/* 다시 시작 버튼 */}
        <div className="action-buttons">
          <button onClick={handleRestart} className="restart-btn">
            🔄 처음으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionPage;
