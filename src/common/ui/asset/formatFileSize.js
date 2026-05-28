/**
 * 파일 사이즈(bytes)를 사람이 읽기 쉬운 단위로 포맷한다.
 *
 * @param {number} bytes - 바이트 단위 크기
 * @returns {string} '320 KB' 또는 '1.2 MB' 형태의 문자열
 *
 * Example usage:
 * formatFileSize(245760) // '240 KB'
 * formatFileSize(5242880) // '5.0 MB'
 */
function formatFileSize(bytes) {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes < 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export { formatFileSize };
export default formatFileSize;
