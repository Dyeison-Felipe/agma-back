export type Meta = {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type Pagination<Item> = {
  items: Item[];
  meta: Meta;
};

export type PaginationInput = {
  page: number;
  direction: 'ASC' | 'DESC' | null;
  limit: number;
};



