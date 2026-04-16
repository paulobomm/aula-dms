import { SetMetadata } from "@nestjs/common";
import type { HateoasLink } from "@shared/hateoas/hateoas.types";

export const HATEOAS_ITEM_KEY = "hateoas:item";
export const HATEOAS_LIST_KEY = "hateoas:list";

export interface HateoasItemOptions<T> {
  itemLinks: (item: T) => (HateoasLink | null)[] | null;
}

export interface HateoasListOptions<T> {
  itemLinks: (item: T) => (HateoasLink | null)[] | null;
}

export const HateoasItem = <T>(options: HateoasItemOptions<T>) =>
  SetMetadata(HATEOAS_ITEM_KEY, options);

export const HateoasList = <T>(options: HateoasListOptions<T>) =>
  SetMetadata(HATEOAS_LIST_KEY, options);
