import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginateOptions } from 'mongoose';

export type FindQueryResult = {
  pagination: PaginateOptions;
  filters: Record<string, any>;
};

export const FindQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): FindQueryResult => {
    const request = ctx.switchToHttp().getRequest();
    const { page, limit, offset, ...query } = request.query;
    const filters: Record<string, string | number | boolean> = {};
    const sort: [string, number][] = [];

    Object.keys(query).forEach((key) => {
      if (key.startsWith('orderBy')) {
        let orderBy = key.replace('orderBy', '');
        orderBy = orderBy.charAt(0).toLowerCase() + orderBy.slice(1);
        sort.push([orderBy, query[key] === 'desc' ? -1 : 1]);
        return;
      }
      if (query[key] === 'null') {
        filters[key] = null;
        return;
      }
      if (query[key] === 'undefined') {
        filters[key] = undefined;
        return;
      }
      if (query[key] === 'true') {
        filters[key] = true;
        return;
      }
      if (query[key] === 'false') {
        filters[key] = false;
        return;
      }
      filters[key] = query[key];
    });

    const pagination: PaginateOptions =
      offset !== undefined
        ? {
            offset: parseInt(offset, 10) || 0,
            limit: parseInt(limit, 10) || 10,
          }
        : {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
          };

    return {
      pagination: {
        ...pagination,
        sort,
      },
      filters,
    };
  },
);
