import { Type } from '@nestjs/common';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class MetaPresenter {
  @ApiProperty({ example: 100 })
  readonly totalItems: number;

  @ApiProperty({ example: 10 })
  readonly itemCount: number;

  @ApiProperty({ example: 10 })
  readonly itemsPerPage: number;

  @ApiProperty({ example: 10 })
  readonly totalPages: number;

  @ApiProperty({ example: 1 })
  readonly currentPage: number;

  constructor(
    totalItems: number,
    itemCount: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number,
  ) {
    this.totalItems = totalItems;
    this.itemCount = itemCount;
    this.itemsPerPage = itemsPerPage;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
  }
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

export const PaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return {
    allOf: [
      {
        properties: {
          items: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
          meta: {
            $ref: getSchemaPath(MetaPresenter),
          },
        },
      },
    ],
  };
};
