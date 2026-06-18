import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form';
import * as v from 'valibot';

function toFieldPath(issue: any) {
  const segments = (issue?.path ?? [])
    .map((item: any) => item?.key)
    .filter((key: unknown) => key !== null && key !== undefined && key !== '')
    .map((key: string | number) => String(key));

  return segments.join('.');
}

export function createValibotResolver<TValues extends FieldValues>(schema: any): Resolver<TValues> {
  return (async (values) => {
    const result = v.safeParse(schema, values);

    if (result.success) {
      return {
        values: result.output as TValues,
        errors: {} as FieldErrors<TValues>,
      };
    }

    const errors = {} as FieldErrors<TValues>;

    for (const issue of result.issues ?? []) {
      const path = toFieldPath(issue);
      if (!path || (errors as Record<string, unknown>)[path]) continue;
      (errors as Record<string, unknown>)[path] = {
        type: 'validation',
        message: issue.message,
      };
    }

    return {
      values: {} as any,
      errors,
    };
  }) as Resolver<TValues>;
}
