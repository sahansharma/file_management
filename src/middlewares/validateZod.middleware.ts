import { ZodSchema } from "zod";
import { validate } from "./validate";

// Lightweight compatibility wrapper. Prefer importing `validate` from `src/middlewares/validate`.
export const validateZod = (schema: ZodSchema<any>, target: "body" | "params" | "query" | "all" = "body") => {
  return validate(schema, target === "all" ? "body" : (target as "body" | "params"));
};
