// app/utils/config.ts


const ENV = (process.env.NODE_ENV || "production") as keyof typeof CONFIG;

const CONFIG = {
  development: {
    GRAPHQL_API_URL: "http://localhost:4000/graphql",
  },
  production: {
    GRAPHQL_API_URL: "http://localhost:4000/graphql",
  },
};

export const GRAPHQL_API_URL = CONFIG[ENV]?.GRAPHQL_API_URL;
