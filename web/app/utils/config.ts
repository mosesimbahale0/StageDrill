// app/utils/config.ts


const ENV = (process.env.NODE_ENV || "production") as keyof typeof CONFIG;

const CONFIG = {
  development: {
    GRAPHQL_API_URL: "http://localhost:8080/graphql",
  },
  production: {
    GRAPHQL_API_URL: "https://portfolio-nczo.onrender.com/graphql",
  },
};

export const GRAPHQL_API_URL = CONFIG[ENV]?.GRAPHQL_API_URL;
