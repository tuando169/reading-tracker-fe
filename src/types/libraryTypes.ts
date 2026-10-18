export enum ReadingStatus {
  NOT_READ = 0, // Chưa đọc / Muốn đọc
  READING = 1,  // Đang đọc
  COMPLETED = 2 // Đã đọc / Hoàn thành
}

export interface LibraryBook {
  bookId: number;
  title: string;
  author: string;
  coverUrl: string;
  status: ReadingStatus;
  currentPage: number;
  totalPages: number;
  rating: number; // 0: chưa đánh giá, 1-5 sao
  note: string;
  startedAt?: string | null;
  finishedAt?: string | null;
}

export interface LibraryStats {
  totalBooks: number;
  readingBooks: number;
  finishedBooks: number;
}

export interface AddBookPayload {
  bookId: number;
  status: ReadingStatus;
}

export interface UpdateBookPayload {
  status?: ReadingStatus;
  currentPage?: number;
  rating?: number;
  note?: string;
}
