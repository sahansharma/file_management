import { config } from "dotenv";
config();

export const datasource = {
  adapter: "postgresql",
  url: process.env.DATABASE_URL,
};
