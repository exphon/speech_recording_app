/**
 * 환경변수 기반 로깅 유틸리티
 * 개발 환경에서만 로그를 출력하고, 프로덕션에서는 에러만 출력합니다.
 */
export const logger = {
  log: (...args) => process.env.NODE_ENV === 'development' && console.log(...args),
  error: (...args) => console.error(...args), // 에러는 항상 출력
  warn: (...args) => process.env.NODE_ENV === 'development' && console.warn(...args),
};
