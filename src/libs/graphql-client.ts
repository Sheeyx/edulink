// temp-only: src/libs/graphql-client.ts
import { GraphQLClient } from "graphql-request";
const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`;

export const graphql = new GraphQLClient(endpoint, {
  headers: () => ({
    Authorization: process.env.NEXT_PUBLIC_API_TOKEN
      ? `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
      : "",
  }),
});
