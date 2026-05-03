/**
 * Типы для Venues API (Platinumlist API v7)
 */

import { type ApiImage, type ApiPagination } from "./events.js";

export interface ApiVenue {
  id:         number;
  name:       string;
  info:       string | null;
  location:   string | null;
  phone:      string | null;
  website:    string | null;
  latitude:   string | null;
  longitude:  string | null;
  image_big:  ApiImage | [];
  image_small: ApiImage | [];
}

export interface VenuesListResponse {
  data: ApiVenue[];
  meta: {
    pagination: ApiPagination;
  };
}

export interface VenueSingleResponse {
  data: ApiVenue;
}

export interface SearchVenuesParams {
  search?:    string;
  "city.id"?: number;
  page?:      number;
}
