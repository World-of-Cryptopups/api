export interface Datum {
  contract: string;
  asset_id: string;
  owner: string;
  is_transferable: boolean;
  is_burnable: boolean;
  collection: Collection;
  schema: Schema;
  template: Template;
  mutable_data: MutableData;
  immutable_data: MutableData;
  template_mint: string;
  backed_tokens: any[];
  burned_by_account: null;
  burned_at_block: null;
  burned_at_time: null;
  updated_at_block: string;
  updated_at_time: string;
  transferred_at_block: string;
  transferred_at_time: string;
  minted_at_block: string;
  minted_at_time: string;
  data: Data;
  name: string;
}

export interface Collection {
  collection_name: string;
  name: string;
  img: string;
  author: string;
  allow_notify: boolean;
  authorized_accounts: Author[];
  notify_accounts: any[];
  market_fee: number;
  created_at_block: string;
  created_at_time: string;
}

export type Author = string[];

export interface Data {
  DPS: string;
  img: string;
  name: string;
  Power: string;
  League: string;
  Agility: string;
  BackImg: string;
  Description: string;
  "Authenticity Card": string;
  "Item Owner"?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MutableData {}

export interface Schema {
  schema_name: string;
  format: Format[];
  created_at_block: string;
  created_at_time: string;
}

export interface Format {
  name: string;
  type: string;
}

export interface Template {
  template_id: string;
  max_supply: string;
  is_transferable: boolean;
  is_burnable: boolean;
  issued_supply: string;
  immutable_data: Data;
  created_at_time: string;
  created_at_block: string;
}
