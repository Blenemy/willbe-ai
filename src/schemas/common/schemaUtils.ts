import { z } from "zod";

// Shared search option schema to prevent duplication
export const searchOptionSchema = z.object({
  title: z.string(),
  id: z.string(),
});

// Shared optional number preprocessing to prevent duplication
export const optionalNumber = z.preprocess(
  (val: unknown) => {
    if (val === "" || val === undefined || val === null) return undefined;
    if (typeof val === "string" && val.trim() === "") return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  },
  z.number().int().min(0).optional()
);

// Simplified version for basic number conversion
export const simpleOptionalNumber = z.preprocess(
  (val: unknown) => {
    if (val === "" || val === undefined || val === null) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  },
  z.number().int().min(0).optional()
); 