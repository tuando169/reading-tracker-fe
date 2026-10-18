export interface BookItem {
  id: number;
  workId: string;
  title: string;
  author: string | null;
  description?: string | null;
  publishYear?: number | null;
  totalPages?: number | null;
  subjects?: string[];
  coverUrl?: string;
  inLibrary?: boolean;
}

export interface BookDetail extends BookItem {
  status?: number;
  currentPage?: number;
  rating?: number;
  note?: string;
}

export interface BookSearchParams {
  keyword: string;
  page: number;
  limit?: number;
}
