import { Handler } from "@netlify/functions";
import fetch from "node-fetch";
import { dpsCalculator, dpsItemsCalculator } from "../lib/dps";
import { Datum } from "../typings/datum";

type ApiResponse = {
  pupskins: Datum[];
  pupitems: Datum[];
  pupcards: Datum[];
};

const handler: Handler = async (event, context) => {
  const t = new Date().getTime();

  const wallet = event.queryStringParameters.wallet;
  if (!wallet) {
    return {
      statusCode: 200,
      body: "Season Pass Wallet Calculator",
    };
  }

  const r: ApiResponse | null = await fetch(
    process.env.BASE_API + `seasonpass/one?wallet=${wallet}`
  )
    .then((d) => d.json())
    .catch((e) => {
      console.error(e);
      return null;
    });

  if (!r) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: "Calculation failed, please contact the developer to fix it.",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  console.log(new Date().getTime() - t);

  // calculate all
  const y = Promise.all([
    dpsCalculator(r.pupskins, wallet),
    dpsCalculator(r.pupcards, wallet),
    dpsCalculator(r.pupitems, wallet),
    dpsItemsCalculator(r.pupskins, r.pupitems, wallet),
  ]);

  return {
    statusCode: 200,
    body: JSON.stringify({
      wallet: wallet,
      dps: {
        pupskins: y[0],
        pupcards: y[1],
        pupitems: {
          raw: y[2],
          real: y[3],
        },
      },
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};

export { handler };
