import type { mastodon } from 'masto';

export type SearchRequest = {
  type: mastodon.v2.SearchType;
  keyword: string;
};
