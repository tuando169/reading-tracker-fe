export function formatDate(dateString?: string | null): string {
  if (!dateString) return 'Chưa cập nhật';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateString;
  }
}

export function calculateProgress(currentPage: number, totalPages: number): number {
  if (!totalPages || totalPages <= 0) return 0;
  if (currentPage <= 0) return 0;
  if (currentPage >= totalPages) return 100;
  return Math.round((currentPage / totalPages) * 100);
}
