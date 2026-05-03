/**
 * Типы для Artists API (Platinumlist API v7)
 */

import { type ApiPagination } from "./events.js";

export interface ApiArtist {
  id:   number;
  name: string;
  url:  string;
}

export interface ArtistsListResponse {
  data: ApiArtist[];
  meta: {
    pagination: ApiPagination;
  };
}

export interface ArtistSingleResponse {
  data: ApiArtist;
}

export interface SearchArtistsParams {
  search?: string;
  page?:   number;
}
