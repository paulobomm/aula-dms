import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { map, type Observable } from "rxjs";
import {
  HATEOAS_ITEM_KEY,
  HATEOAS_LIST_KEY,
  type HateoasItemOptions,
  type HateoasListOptions,
} from "@shared/hateoas/hateoas.decorators";
import type { HateoasLink, PaginatedResult } from "@shared/hateoas/hateoas.types";

@Injectable()
export class HateoasInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const itemOptions = this.reflector.get<HateoasItemOptions<unknown>>(
      HATEOAS_ITEM_KEY,
      context.getHandler(),
    );
    const listOptions = this.reflector.get<HateoasListOptions<unknown>>(
      HATEOAS_LIST_KEY,
      context.getHandler(),
    );

    if (!itemOptions && !listOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<{
      path: string;
      protocol: string;
      get: (header: string) => string;
    }>();

    return next.handle().pipe(
      map((data) => {
        if (itemOptions) {
          if (data === null || data === undefined) return data;
          const rawLinks = itemOptions.itemLinks(data);
          const links: HateoasLink[] = rawLinks
            ? (rawLinks.filter(Boolean) as HateoasLink[])
            : [];
          return { data, _links: links };
        }

        if (listOptions) {
          const paginated = data as PaginatedResult<unknown>;
          const { items, total, page, limit, totalPages } = paginated;

          const mappedItems = items.map((item) => {
            const rawLinks = listOptions.itemLinks(item);
            const links: HateoasLink[] = rawLinks
              ? (rawLinks.filter(Boolean) as HateoasLink[])
              : [];
            return { data: item, _links: links };
          });

          const collectionLinks: HateoasLink[] = [
            {
              rel: "self",
              href: `${request.path}?page=${page}&limit=${limit}`,
              method: "GET",
            },
          ];

          if (page > 1) {
            collectionLinks.push({
              rel: "prev",
              href: `${request.path}?page=${page - 1}&limit=${limit}`,
              method: "GET",
            });
          }

          if (page < totalPages) {
            collectionLinks.push({
              rel: "next",
              href: `${request.path}?page=${page + 1}&limit=${limit}`,
              method: "GET",
            });
          }

          return {
            items: mappedItems,
            total,
            page,
            limit,
            totalPages,
            _links: collectionLinks,
          };
        }
      }),
    );
  }
}
