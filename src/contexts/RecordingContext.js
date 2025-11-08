import React, { createContext, useState, useContext, useCallback } from 'react';
import { logger } from '../utils/logger';

// 녹음 타입 상수
export const RECORDING_TYPES = {
  WORDS: 'words',
  SENTENCE: 'sentence',
  PARAGRAPH: 'paragraph'
};

const RecordingContext = createContext();

export const useRecordings = () => useContext(RecordingContext);

/**
 * 녹음 데이터를 전역으로 관리하는 Context
 * - 녹음된 Blob과 텍스트를 저장
 * - 완료 페이지에서 다운로드 기능 제공
 */
export const RecordingProvider = ({ children }) => {
  const [recordingStore, setRecordingStore] = useState({
    words: null,
    sentences: [],
    paragraph: null
  });
  const [participantId, setParticipantId] = useState('');
  const [metadata, setMetadata] = useState(null); // 메타정보 저장

  /**
   * MediaRecorder blob을 WAV로 변환 (webm/ogg → pcm wav)
   * 반환: Promise<Blob> (audio/wav)
   */
  const convertToWav = useCallback(async (blob) => {
    let audioCtx = null;
    
    try {
      // 이미 wav 인 경우 그대로 반환
      if (blob.type === 'audio/wav') return blob;
      
      // 브라우저 디코딩
      const arrayBuffer = await blob.arrayBuffer();
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const { numberOfChannels, length, sampleRate } = audioBuffer;

      // 인터리브 채널 데이터
      const channelData = [];
      for (let ch = 0; ch < numberOfChannels; ch++) {
        channelData.push(audioBuffer.getChannelData(ch));
      }

      // 단일/다중 채널 병합
      let interleaved;
      if (numberOfChannels === 1) {
        interleaved = channelData[0];
      } else {
        interleaved = new Float32Array(length * numberOfChannels);
        for (let i = 0; i < length; i++) {
          for (let ch = 0; ch < numberOfChannels; ch++) {
            interleaved[i * numberOfChannels + ch] = channelData[ch][i];
          }
        }
      }

      // 16-bit PCM 변환
      const buffer = new ArrayBuffer(44 + interleaved.length * 2);
      const view = new DataView(buffer);

      // WAV 헤더 작성
      const writeString = (offset, str) => {
        for (let i = 0; i < str.length; i++) {
          view.setUint8(offset + i, str.charCodeAt(i));
        }
      };

      const pcmLength = interleaved.length * 2;
      writeString(0, 'RIFF');
      view.setUint32(4, 36 + pcmLength, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true); // PCM 서브청크 크기
      view.setUint16(20, 1, true); // 오디오 포맷 (PCM)
      view.setUint16(22, numberOfChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * numberOfChannels * 2, true); // 바이트/sec
      view.setUint16(32, numberOfChannels * 2, true); // 블록 정렬
      view.setUint16(34, 16, true); // 비트 깊이
      writeString(36, 'data');
      view.setUint32(40, pcmLength, true);

      // PCM 데이터 작성
      let offset = 44;
      for (let i = 0; i < interleaved.length; i++) {
        let sample = Math.max(-1, Math.min(1, interleaved[i]));
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, sample, true);
        offset += 2;
      }

      return new Blob([view], { type: 'audio/wav' });
    } catch (error) {
      logger.error('WAV 변환 실패, 원본 blob 사용:', error);
      return blob; // fallback
    } finally {
      // AudioContext 리소스 정리 (메모리 누수 방지)
      if (audioCtx && audioCtx.state !== 'closed') {
        try {
          await audioCtx.close();
        } catch (closeError) {
          logger.warn('AudioContext 닫기 실패:', closeError);
        }
      }
    }
  }, []);

  /**
   * 녹음 추가 (단어 묶음 / 문장 / 문단)
   * type: 'words' | 'sentence' | 'paragraph'
   * index: 문장 인덱스 (sentence일 때)
   */
  const addRecording = useCallback(async (blob, originalText, type, index = null) => {
    try {
      const wavBlob = await convertToWav(blob);
      if (type === RECORDING_TYPES.WORDS) {
        const filename = 'words_all.wav';
        setRecordingStore(prev => ({
          ...prev,
          words: { blob: wavBlob, text: originalText, filename }
        }));
      } else if (type === RECORDING_TYPES.SENTENCE) {
        const filename = `sentence_${(index + 1).toString().padStart(2, '0')}.wav`;
        setRecordingStore(prev => ({
          ...prev,
          sentences: [
            ...prev.sentences,
            { blob: wavBlob, text: originalText, filename, index }
          ]
        }));
      } else if (type === RECORDING_TYPES.PARAGRAPH) {
        const filename = 'paragraph.wav';
        setRecordingStore(prev => ({
          ...prev,
          paragraph: { blob: wavBlob, text: originalText, filename }
        }));
      }
    } catch (error) {
      logger.error('WAV 변환 실패, 원본 blob 사용:', error);
      // 실패 시 원본 저장 (확장자 webm 등)
      const fallbackExt = blob.type.includes('webm') ? 'webm' : 'ogg';
      if (type === RECORDING_TYPES.WORDS) {
        setRecordingStore(prev => ({
          ...prev,
          words: { blob, text: originalText, filename: `words_all.${fallbackExt}` }
        }));
      } else if (type === RECORDING_TYPES.SENTENCE) {
        setRecordingStore(prev => ({
          ...prev,
          sentences: [
            ...prev.sentences,
            { blob, text: originalText, filename: `sentence_${(index + 1).toString().padStart(2,'0')}.${fallbackExt}`, index }
          ]
        }));
      } else if (type === RECORDING_TYPES.PARAGRAPH) {
        setRecordingStore(prev => ({
          ...prev,
          paragraph: { blob, text: originalText, filename: `paragraph.${fallbackExt}` }
        }));
      }
    }
  }, [convertToWav]);

  const resetRecordings = useCallback(() => {
    setRecordingStore({ words: null, sentences: [], paragraph: null });
    setParticipantId('');
    setMetadata(null);
  }, []);

  /** 개별 다운로드용 헬퍼 */
  const downloadBlob = useCallback((blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  /** 텍스트 파일 다운로드 */
  const downloadText = useCallback((text, filename) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, filename);
  }, [downloadBlob]);

  const value = {
    recordingStore,
    addRecording,
    resetRecordings,
    participantId,
    setParticipantId,
    metadata,
    setMetadata,
    downloadBlob,
    downloadText
  };

  return (
    <RecordingContext.Provider value={value}>
      {children}
    </RecordingContext.Provider>
  );
};