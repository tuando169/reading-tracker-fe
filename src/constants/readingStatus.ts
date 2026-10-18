export enum ReadingStatusEnum {
  NotRead = 0,
  Reading = 1,
  Completed = 2,
}

export interface ReadingStatusOption {
  id: ReadingStatusEnum;
  label: string;
  color: string;
  badgeClass: string;
}

export const readingStatusOptions: ReadingStatusOption[] = [
  {
    id: ReadingStatusEnum.NotRead,
    label: "Chưa đọc",
    color: "bg-slate-200",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    id: ReadingStatusEnum.Reading,
    label: "Đang đọc",
    color: "bg-blue-200",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: ReadingStatusEnum.Completed,
    label: "Đã đọc",
    color: "bg-green-200",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
];
