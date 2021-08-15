import { Handler } from "@netlify/functions";
import { client } from "../lib/mongodb";
import fetch from "node-fetch";

const SCHEMAS = ["pupskincards", "pupitems", "puppycards"];
const dbName = "db";

const _fetcher = async (schema: string) => {
  try {
    return await (
      await fetch(process.env.BASE_API + "fetcher/" + schema)
    ).json();
  } catch {
    return _fetcher(schema);
  }
};

const _getColDB = async (): Promise<string> => {
  const r = await (
    await fetch(process.env.BASE_API + "fetcher/get/current")
  ).json();

  return r.current;
};

const _setColDB = async (c: string): Promise<void> => {
  await fetch(process.env.BASE_API + "fetcher/set/current/" + c);
};

const handler: Handler = async (event, context) => {
  try {
    await client.connect();

    const _col = await _getColDB();
    const db = client.db(dbName);

    const datas = await Promise.all(SCHEMAS.map((s) => _fetcher(s)));
    await db
      .collection(_col)
      .createIndex({ createdAt: 1 }, { expireAfterSeconds: 300, unique: true });
    await db.collection(_col).insertMany(datas);

    await _setColDB(_col === "sample" ? "alt" : "sample");

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ message: "Done :)" }),
    };
  } finally {
    await client.close();
  }
};

export { handler };
