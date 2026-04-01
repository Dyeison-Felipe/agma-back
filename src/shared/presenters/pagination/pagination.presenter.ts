export class MetaPresenter {
  constructor(
    readonly totalItems: number,
    readonly itemCount: number,
    readonly itemsPerPage: number,
    readonly totalPages: number,
    readonly currentPage: number,
  ) {}
}

export class PaginationPresenter<T> {
  readonly items: T[];
  readonly meta: MetaPresenter;

  constructor(items: T[], meta: MetaPresenter) {
    this.items = items;
    this.meta = meta;
  }
}

export type Pagination<T> = PaginationPresenter<T>;