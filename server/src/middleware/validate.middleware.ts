import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

type ParseTarget = 'body' | 'query' | 'params';

/**
 * Returns an Express middleware that validates `req[target]` against `schema`.
 * On success it replaces the raw value with the parsed (coerced) value.
 * On failure it calls next(zodError), which the centralized error handler converts to a 400.
 */
export function validate(schema: ZodSchema, target: ParseTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      next(result.error);
      return;
    }

    // Replace with parsed/coerced value so downstream code gets correct types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any)[target] = result.data;
    next();
  };
}
