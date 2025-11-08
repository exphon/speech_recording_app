import React, { useMemo, useState } from 'react';
import JSZip from 'jszip';
import { useRecordings } from '../contexts/RecordingContext';
import { logger } from '../utils/logger';

/**
 * 모든 녹음 파일 ZIP 다운로드 컴포넌트
 */
const DownloadRecordings = () => {
  const { recordingStore, metadata } = useRecordings();
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

      // 메타정보 JSON 파일 추가
      if (metadata) {
        const metadataJson = JSON.stringify(metadata, null, 2);
        root.file('metadata.json', metadataJson);
      }

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
      {!hasAny && (
        <div className="no-recordings">
          <p>아직 다운로드할 녹음이 없습니다.</p>
        </div>
      )}

      {hasAny && (
        <div className="zip-download-container">
          <div className="download-info">
            <div className="info-icon">📦</div>
            <div className="info-text">
              <h3>녹음 파일 준비 완료</h3>
              <p>모든 녹음 파일(단어, 문장, 문단)과 텍스트가 ZIP 파일로 압축됩니다.</p>
            </div>
          </div>
          
          <button 
            className="zip-download-button" 
            onClick={handleZipAll} 
            disabled={zipping}
          >
            {zipping ? (
              <>
                <span className="spinner">⏳</span>
                <span>압축 생성 중...</span>
              </>
            ) : (
              <>
                <span className="download-icon">⬇️</span>
                <span>모든 파일 ZIP 다운로드</span>
              </>
            )}
          </button>
          
          {zipError && (
            <div className="message error">
              <span>❌</span>
              <span>오류 발생: {zipError}</span>
            </div>
          )}
          
          {zipSuccess && (
            <div className="message success">
              <span>✅</span>
              <span>ZIP 파일이 성공적으로 다운로드되었습니다!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DownloadRecordings;
