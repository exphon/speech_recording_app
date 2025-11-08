import React, { useMemo, useState } from 'react';
import JSZip from 'jszip';
import { useRecordings } from '../contexts/RecordingContext';
import { logger } from '../utils/logger';

/**
 * 모든 녹음 파일 (WAV + TXT) 개별 및 ZIP 다운로드 컴포넌트
 */
const DownloadRecordings = () => {
  const { recordingStore, downloadBlob, downloadText } = useRecordings();
  const [zipping, setZipping] = useState(false);
  const [zipError, setZipError] = useState(null);
  const [zipSuccess, setZipSuccess] = useState(false);

  const sentenceSorted = useMemo(() => {
    return [...recordingStore.sentences].sort((a, b) => a.index - b.index);
  }, [recordingStore.sentences]);

  const handleZipAll = async () => {
    setZipping(true);
    setZipError(null);
    setZipSuccess(false);
    try {
      const zip = new JSZip();
      const root = zip.folder('recordings');

      // 단어
      if (recordingStore.words) {
        const wordsFolder = root.folder('words');
        wordsFolder.file(recordingStore.words.filename, recordingStore.words.blob);
        wordsFolder.file('words_all.txt', recordingStore.words.text || '');
      }

      // 문장
      if (sentenceSorted.length > 0) {
        const sentencesFolder = root.folder('sentences');
        sentenceSorted.forEach(s => {
          sentencesFolder.file(s.filename, s.blob);
          const txtName = s.filename.replace(/\.[^.]+$/, '.txt');
          sentencesFolder.file(txtName, s.text || '');
        });
      }

      // 문단
      if (recordingStore.paragraph) {
        const paragraphFolder = root.folder('paragraph');
        paragraphFolder.file(recordingStore.paragraph.filename, recordingStore.paragraph.blob);
        paragraphFolder.file('paragraph.txt', recordingStore.paragraph.text || '');
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
      const zipName = `recordings_${timestamp}.zip`;
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = zipName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setZipSuccess(true);
    } catch (error) {
      logger.error('ZIP 생성 실패:', error);
      setZipError(error.message);
    } finally {
      setZipping(false);
    }
  };

  const hasAny = recordingStore.words || sentenceSorted.length > 0 || recordingStore.paragraph;

  return (
    <div className="download-recordings">
      <h3>📥 녹음 파일 다운로드</h3>
      {!hasAny && <p>아직 다운로드할 녹음이 없습니다.</p>}

      {recordingStore.words && (
        <div className="download-section">
          <h4>📝 단어 전체</h4>
          <div className="download-row">
            <button onClick={() => downloadBlob(recordingStore.words.blob, recordingStore.words.filename)}>WAV 다운로드</button>
            <button onClick={() => downloadText(recordingStore.words.text, 'words_all.txt')}>TEXT 다운로드</button>
          </div>
        </div>
      )}

      {sentenceSorted.length > 0 && (
        <div className="download-section">
          <h4>📄 문장</h4>
          <ul className="sentence-list">
            {sentenceSorted.map(s => (
              <li key={s.index} className="sentence-item">
                <span>{(s.index + 1).toString().padStart(2, '0')}.</span>
                <span className="sentence-text">{s.text}</span>
                <div className="actions">
                  <button onClick={() => downloadBlob(s.blob, s.filename)}>WAV</button>
                  <button onClick={() => downloadText(s.text, s.filename.replace(/\.[^.]+$/, '.txt'))}>TXT</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recordingStore.paragraph && (
        <div className="download-section">
          <h4>📖 문단</h4>
          <div className="download-row">
            <button onClick={() => downloadBlob(recordingStore.paragraph.blob, recordingStore.paragraph.filename)}>WAV 다운로드</button>
            <button onClick={() => downloadText(recordingStore.paragraph.text, 'paragraph.txt')}>TEXT 다운로드</button>
          </div>
        </div>
      )}

      {hasAny && (
        <div className="zip-section">
          <button onClick={handleZipAll} disabled={zipping}>{zipping ? '압축 생성 중...' : '모든 파일 ZIP 다운로드'}</button>
          {zipError && <p className="error">❌ {zipError}</p>}
          {zipSuccess && <p className="success">✅ ZIP 다운로드 완료</p>}
        </div>
      )}
    </div>
  );
};

export default DownloadRecordings;
