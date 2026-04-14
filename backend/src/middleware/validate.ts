import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Validates req.body against a Zod schema.
 * Returns 400 with field-level errors on failure.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      res.status(400).json({ message: "Validation failed.", errors });
      return;
    }
    req.body = result.data;
    next();
  };
}

function formatZodErrors(error: ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_root";
    out[key] = [...(out[key] ?? []), issue.message];
  }
  return out;
}
