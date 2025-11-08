import React from 'react';
import { useNavigate } from 'react-router-dom';
import './IndexPage.css';

/**
 * 메인 페이지 - 환영 메시지와 발음평가/말하기평가 선택
 */
const IndexPage = () => {
  const navigate = useNavigate();

  const handleKoreanClick = () => {
    // 한국어 발음평가 참가
    navigate('/instructions', { state: { language: 'ko' } });
  };

  const handleEnglishClick = () => {
    // 영어 발음평가 참가
    navigate('/instructions', { state: { language: 'en' } });
  };

  return (
    <div className="index-page">
      <div className="welcome-container">
        <h1 className="welcome-title">
          말하기 녹음 시스템에 오신 것을 환영합니다
        </h1>
        
        <div className="welcome-content">
          <p className="welcome-description">
            이 시스템은 여러분의 발음을 녹음하는 도구입니다.
          </p>
          
          <div className="evaluation-types">
            <div className="eval-card">
              <h3>🎤 발음녹음</h3>
              <div className="info-box">
                <h4>녹음 구성</h4>
                <ul>
                  <li>📝 단어 읽기 (10개)</li>
                  <li>📄 문장 읽기 (3개)</li>
                  <li>📖 문단 읽기 (1개)</li>
                </ul>
              </div>
              <div className="language-buttons">
                <button 
                  className="join-button korean"
                  onClick={handleKoreanClick}
                >
                  🇰🇷 한국어 발음 녹음 참가하기
                </button>
                <button 
                  className="join-button english"
                  onClick={handleEnglishClick}
                >
                  🇺🇸 영어 발음 녹음 참가하기
                </button>
              </div>
            </div>

          </div>
        </div>



        <div className="system-info">
          <p>🎤 이 시스템은 마이크 권한이 필요합니다</p>
          <p>🔊 조용한 환경에서 진행해주세요</p>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
