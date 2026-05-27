import { config } from "dotenv";
config({ path: ".env.local" });

console.log(process.env.AEM_HOST);

export const schema = {
  [`${process.env.AEM_HOST}/${process.env.AEM_GRAPHQL_ENDPOINT}`]: {
    headers: {
      Authorization: `Bearer ${process.env.AEM_TOKEN}`,
    },
  },
};
export const documents = ["src/**/*.graphql", "src/**/*.{ts,tsx,js,jsx}"];
