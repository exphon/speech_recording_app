import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MetaInfoPage.css';

const currentYear = new Date().getFullYear();

const MetaInfoEngPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // InstructionPage에서 전달받은 언어
  const assessmentLanguage = location.state?.language || 'en';

  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('2000');
  const [gender, setGender] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [englishLearningYears, setEnglishLearningYears] = useState(''); // 영어 학습 기간(년)
  const [englishTestScore, setEnglishTestScore] = useState(''); // 영어 시험 점수 (TOEFL, IELTS 등)

  const [submitting, setSubmitting] = useState(false);

  const years = useMemo(() => {
    const list = [];
    for (let y = currentYear; y >= 1940; y--) list.push(y);
    return list;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const metadata = {
      name: name || null,
      birth_year: birthYear || null,
      gender: gender || null,
      native_language: nativeLanguage || null,
      english_learning_years: englishLearningYears ? Number(englishLearningYears) : null,
      english_test_score: englishTestScore || null,
      assessment_language: assessmentLanguage,
      created_at: new Date().toISOString(),
    };

    setSubmitting(true);

    // 로컬 녹음으로 바로 진행 (서버 세션 생성 제거)
    navigate('/word-reading', {
      state: {
        sessionId: null,
        meta: metadata,
      },
    });
  };

  return (
    <div className="meta-page">
      <div className="meta-container">
        <h1 className="meta-title">Participant Information (English Pronunciation Assessment)</h1>
        <p className="meta-subtitle">Please provide some basic information before starting the assessment.</p>

        <form className="meta-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>

          <div className="form-row">
            <label>Birth Year</label>
            <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)}>
              <option value="">Select</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-row">
            <label>Native Language</label>
            <input
              type="text"
              value={nativeLanguage}
              onChange={(e) => setNativeLanguage(e.target.value)}
              placeholder="e.g., Korean, Spanish, Chinese..."
            />
          </div>

          <div className="form-section-divider">
            <p className="section-instruction">Please complete the following if English is not your native language</p>
          </div>

          <div className="form-row">
            <label>Years of English Learning</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={englishLearningYears}
              onChange={(e) => setEnglishLearningYears(e.target.value)}
              placeholder="e.g., 5.5"
            />
            <p className="hint">How many years have you been learning English?</p>
          </div>

          <div className="form-row">
            <label>English Test Scores (Optional)</label>
            <input
              type="text"
              value={englishTestScore}
              onChange={(e) => setEnglishTestScore(e.target.value)}
              placeholder="e.g., TOEFL 95, IELTS 7.0, TOEIC 850"
            />
            <p className="hint">Include test name and score if applicable</p>
          </div>

          <div className="form-actions">
            <button type="button" className="back-button" onClick={() => navigate('/instructions')} disabled={submitting}>
              ← Back
            </button>
            <button type="submit" className="next-button" disabled={submitting}>
              {submitting ? 'Starting...' : 'Start Assessment →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MetaInfoEngPage;
