import { ReadingStatus } from '@/types';

export function useBookStatus() {
  const getStatusLabel = (status: ReadingStatus): string => {
    switch (status) {
      case ReadingStatus.NOT_READ:
        return 'Muốn đọc';
      case ReadingStatus.READING:
        return 'Đang đọc';
      case ReadingStatus.COMPLETED:
        return 'Đã đọc xong';
      default:
        return 'Chưa xác định';
    }
  };

  const getStatusBadgeClass = (status: ReadingStatus): string => {
    switch (status) {
      case ReadingStatus.NOT_READ:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case ReadingStatus.READING:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case ReadingStatus.COMPLETED:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return {
    getStatusLabel,
    getStatusBadgeClass
  };
}
