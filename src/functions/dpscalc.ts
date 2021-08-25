import { Handler } from "@netlify/functions";
import { Deta } from "deta";
import { db } from "../lib/deta";
import { dpsCalculator, dpsItemsCalculator } from "../lib/dps";
import { Datum } from "../typings/datum";
import { UserDataDPS } from "../typings/userdpsd";

type CalcBody = {
  id: string;
  username: string;
  avatar: string;
  tag: string;
};

type GetDataProps = {
  wallet: string;
  data: {
    pupskins: Datum[];
    pupcards: Datum[];
    pupitems: Datum[];
  };
};

const handler: Handler = async (event, context) => {
  const wallet = event.queryStringParameters.wallet;
  if (!wallet) {
    return {
      statusCode: 200,
      body: "DPS Calculator",
    };
  }

  // get post body
  const { id, username, avatar, tag }: CalcBody = JSON.parse(event.body);

  const data: GetDataProps = await fetch(
    process.env.BASE_API + `fetchall/${wallet}`
  )
    .then((r) => r.json())
    .catch((e) => {
      console.error(e);
      return {
        body: JSON.stringify({
          wallet,
          data: {},
        }),
      };
    });

  // calculate all
  const pupskinsDps = dpsCalculator(data.data.pupskins, wallet);
  const pupcardsDps = dpsCalculator(data.data.pupcards, wallet);
  const pupitemsDpsRaw = dpsCalculator(data.data.pupitems, wallet);
  const pupitemsDpsReal = dpsItemsCalculator(
    data.data.pupskins,
    data.data.pupitems,
    wallet
  );

  // parse data
  const x: UserDataDPS = {
    wallet,
    user: {
      id,
      username,
      avatar,
      tag,
    },
    dps: {
      pupskins: pupskinsDps,
      pupcards: pupcardsDps,
      pupitems: {
        real: pupitemsDpsReal,
        raw: pupitemsDpsRaw,
      },
    },
  };

  await db.put(x, String(id));

  return {
    statusCode: 200,
    body: JSON.stringify(x),
    headers: {
      "Content-Type": "application/json",
    },
  };
};

export { handler };
