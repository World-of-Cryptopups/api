export type UserDataDPS = {
  wallet?: string;
  key?: string;
  user?: {
    id: string;
    username: string;
    avatar: string;
  };
  dps?: {
    pupskins: number;
    pupcards: number;
    pupitems: {
      real: number;
      raw: number;
    };
  };
};
