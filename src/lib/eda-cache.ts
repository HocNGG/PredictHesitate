const CACHE_KEY_RUN_ID = 'eda_scatter_run_id';
const CACHE_KEY_CSV = 'eda_scatter_csv';

/**
 * Lấy dữ liệu scatter CSV từ cache nếu run_id trùng khớp.
 * @param currentRunId Run ID hiện tại lấy từ version API
 * @returns Nội dung CSV dạng text nếu cache hợp lệ, ngược lại trả về null
 */
export function getCachedScatter(currentRunId: string): string | null {
  try {
    const cachedRunId = localStorage.getItem(CACHE_KEY_RUN_ID);
    
    // Nếu run_id giữ nguyên, tái sử dụng dữ liệu CSV từ cache
    if (cachedRunId === currentRunId) {
      return localStorage.getItem(CACHE_KEY_CSV);
    }
  } catch (error) {
    console.error('Failed to read scatter cache from localStorage:', error);
  }
  
  // Nếu run_id đổi hoặc không có, trả về null để tải mới
  return null;
}

/**
 * Lưu trữ dữ liệu scatter CSV mới tải vào cache cùng với run_id.
 * @param runId Run ID xác định phiên bản tệp
 * @param csvText Nội dung CSV
 */
export function setCachedScatter(runId: string, csvText: string): void {
  try {
    localStorage.setItem(CACHE_KEY_RUN_ID, runId);
    localStorage.setItem(CACHE_KEY_CSV, csvText);
  } catch (error) {
    // Xử lý trường hợp localStorage bị đầy (QuotaExceededError)
    console.error('Failed to save scatter cache to localStorage:', error);
  }
}

/**
 * Optional: Xóa cache nếu cần dọn dẹp dung lượng
 */
export function clearScatterCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY_RUN_ID);
    localStorage.removeItem(CACHE_KEY_CSV);
  } catch (error) {
    console.error('Failed to clear scatter cache:', error);
  }
}
