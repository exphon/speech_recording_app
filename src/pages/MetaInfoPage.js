import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MetaInfoPage.css';

// 6자리 숫자 ID 생성 (발음평가용 - P_ 접두어)
const generatePronunciationId = () => `P_${String(Math.floor(100000 + Math.random() * 900000))}`;

const currentYear = new Date().getFullYear();

const MetaInfoPage = () => {
  const navigate = useNavigate();

  const [autoId, setAutoId] = useState(generatePronunciationId());
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('2000');
  const [gender, setGender] = useState(''); // 성별
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [koreaResidence, setKoreaResidence] = useState(''); // 한국 거주 경험
  const [koreanLearningMonths, setKoreanLearningMonths] = useState(''); // 한국어 학습 기간(개월)
  const [topikLevel, setTopikLevel] = useState(''); // TOPIK 등급
  const [otherTestScore, setOtherTestScore] = useState(''); // 기타 시험 점수
  const [assessmentLanguage, setAssessmentLanguage] = useState('ko'); // 평가 언어: 'ko' 또는 'en'

  const [submitting, setSubmitting] = useState(false);

  const years = useMemo(() => {
    const list = [];
    for (let y = currentYear; y >= 1940; y--) list.push(y);
    return list;
  }, []);

  const handleRegenerateId = () => setAutoId(generatePronunciationId());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const metadata = {
      participant_id: autoId,
      name: name || null,
      birth_year: birthYear || null,
      gender: gender || null,
      native_language: nativeLanguage || null,
      korea_residence: koreaResidence || null,
      korean_learning_months: koreanLearningMonths ? Number(koreanLearningMonths) : null,
      topik_level: topikLevel || null,
      other_test_score: otherTestScore || null,
      assessment_language: assessmentLanguage, // 평가 언어 추가
      created_at: new Date().toISOString(),
    };

    setSubmitting(true);

    // 로컬 녹음으로 바로 진행 (서버 세션 생성 제거)
    navigate('/word-reading', {
      state: {
        sessionId: null, // 세션 없이 진행
        meta: metadata,
      },
    });
  };

  return (
    <div className="meta-page">
      <div className="meta-container">
        <h1 className="meta-title">참여자 메타정보</h1>
        <p className="meta-subtitle">평가 전에 간단한 정보를 입력해주세요.</p>

        <form className="meta-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>평가 언어 선택 *</label>
            <select 
              value={assessmentLanguage} 
              onChange={(e) => setAssessmentLanguage(e.target.value)}
              required
            >
              <option value="ko">🇰🇷 한국어 (Korean)</option>
              <option value="en">🇺🇸 영어 (English)</option>
            </select>
            <p className="hint language-hint">
              {assessmentLanguage === 'ko' 
                ? '✓ 한국어 발음 평가를 진행합니다.' 
                : '✓ English pronunciation assessment will be conducted.'}
            </p>
          </div>

          <div className="form-row">
            <label>참여자 ID (발음평가용)</label>
            <div className="id-row">
              <input type="text" value={autoId} readOnly />
              <button type="button" className="regen-btn" onClick={handleRegenerateId}>
                재생성
              </button>
            </div>
            <p className="hint">P_ 접두어가 붙은 발음평가 전용 ID입니다. (말하기평가는 S_ 접두어)</p>
          </div>

          <div className="form-row">
            <label>이름</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" />
          </div>

          <div className="form-row">
            <label>태어난 해</label>
            <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)}>
              <option value="">선택하세요</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label>성별</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">선택하세요</option>
              <option value="남">남</option>
              <option value="여">여</option>
            </select>
          </div>

          <div className="form-row">
            <label>모국어</label>
            <input
              type="text"
              value={nativeLanguage}
              onChange={(e) => setNativeLanguage(e.target.value)}
              placeholder="예: 한국어, 영어, 스페인어..."
            />
          </div>

          <div className="form-row">
            <label>한국 거주 경험</label>
            <select value={koreaResidence} onChange={(e) => setKoreaResidence(e.target.value)}>
              <option value="">선택하세요</option>
              <option value="무">무</option>
              <option value="6개월 이하">6개월 이하</option>
              <option value="1년 이하">1년 이하</option>
              <option value="2년 이하">2년 이하</option>
              <option value="2년 이상">2년 이상</option>
            </select>
          </div>

          <div className="form-row">
            <label>한국어 학습 기간 (개월)</label>
            <input
              type="number"
              min="0"
              value={koreanLearningMonths}
              onChange={(e) => setKoreanLearningMonths(e.target.value)}
              placeholder="예: 24 (2년)"
            />
          </div>

          <div className="form-row">
            <label>TOPIK 등급</label>
            <select value={topikLevel} onChange={(e) => setTopikLevel(e.target.value)}>
              <option value="">선택하세요</option>
              <option value="TOPIK I - 1급">TOPIK I - 1급</option>
              <option value="TOPIK I - 2급">TOPIK I - 2급</option>
              <option value="TOPIK II - 3급">TOPIK II - 3급</option>
              <option value="TOPIK II - 4급">TOPIK II - 4급</option>
              <option value="TOPIK II - 5급">TOPIK II - 5급</option>
              <option value="TOPIK II - 6급">TOPIK II - 6급</option>
              <option value="응시 안 함">응시 안 함</option>
            </select>
          </div>

          <div className="form-row">
            <label>기타 한국어 시험 점수</label>
            <input
              type="text"
              value={otherTestScore}
              onChange={(e) => setOtherTestScore(e.target.value)}
              placeholder="TOPIK 외 한국어 시험 점수를 입력하세요 (예: KLAT 80점, KBS 한국어능력시험 3급)"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="back-button" onClick={() => navigate('/instructions')} disabled={submitting}>
              ← 뒤로가기
            </button>
            <button type="submit" className="next-button" disabled={submitting}>
              {submitting ? '세션 생성 중...' : '시작하기 →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MetaInfoPage;
