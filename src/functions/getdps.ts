import { Handler } from "@netlify/functions";
import { db } from "../lib/deta";
import { UserDataDPS } from "../typings/userdpsd";

const handler: Handler = async (event, context) => {
  const { id } = event.queryStringParameters;
  if (!id) {
    return {
      statusCode: 200,
      body: "Get DPS of User",
    };
  }

  const x: UserDataDPS | null = await db.get(id);
  if (!x) {
    return {
      statusCode: 404,
      body: "No User Found",
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(x),
    headers: {
      "Content-Type": "application/json",
    },
  };
};

export { handler };
