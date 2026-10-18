import { ReadingStatusEnum } from "@/constants/readingStatus";

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description?: string | null;
  publishYear?: number | null;
  totalPages?: number | null;
  subjects?: string[];
  status: ReadingStatusEnum;
  currentPage: number;
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
  id: number;
  status: ReadingStatusEnum;
}

export interface UpdateBookPayload {
  id: string;
  currentPage?: number;
  rating?: number;
  note?: string;
}
