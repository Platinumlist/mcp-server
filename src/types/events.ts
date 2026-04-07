/**
 * Типы для Events API (Platinumlist API v7)
 */

export interface ApiImage {
  src:    string;
  width:  number;
  height: number;
}

export interface ApiEvent {
  id:                        number;
  name:                      string;
  start:                     number;   // unix timestamp
  end:                       number;   // unix timestamp
  vat:                       number;
  image_big:                 ApiImage | [];
  image_medium:              ApiImage | [];
  image_small:               ApiImage | [];
  image_full:                ApiImage | [];
  is_extra_security_mode_on: boolean;
  has_tickets:               boolean;
  has_sales_started:         boolean;
  description:               string;
  text_teaser:               string;
  entry_gate_mode:           number;
  url:                       string;
  white_label_url:           string;
  is_attraction:             boolean;
  is_online?:                boolean;
  status:                    EventStatus;
  rating:                    number;
  artwork_label:             string | null;
  has_dynamic_tickets:       boolean;
}

export type EventStatus =
  | "approved"
  | "on sale"
  | "pre-register"
  | "pre-sale"
  | "sold out";

export type EventSort = "start" | "end" | "rating" | "-rating";

export interface ApiPagination {
  total:        number;
  count:        number;
  per_page:     number;
  current_page: number;
  total_pages:  number;
  links: {
    next?:     string;
    previous?: string;
  };
}

export interface EventsListResponse {
  data: ApiEvent[];
  meta: {
    pagination: ApiPagination;
  };
}

export interface EventSingleResponse {
  data: ApiEvent;
}

export interface SearchEventsParams {
  search?:               string;
  has_tickets?:          boolean;
  start_from?:           number;   // unix timestamp
  start_to?:             number;   // unix timestamp
  end_from?:             number;   // unix timestamp
  end_to?:               number;   // unix timestamp
  "city.id"?:            number;
  "event_type.id"?:      number;
  event_type_recursive?: boolean;
  is_attraction?:        number;
  is_online?:            number;
  status?:               EventStatus;
  sort?:                 EventSort;
  page?:                 number;
}
