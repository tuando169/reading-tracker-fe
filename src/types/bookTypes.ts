export interface BookItem {
  id: number;
  workId:string;
  title: string;
  author: string;
  publishYear?: number | null;
  coverUrl: string | null;
  isInLibrary: boolean;
}

export interface BookDetail extends BookItem {
  description: string;
  subjects: string[];
  totalPages: number;
}

export interface BookSearchParams {
  keyword: string;
  page: number;
  limit?: number;
}
