import { FieldError } from '@notreddit/types';

export const toErrorMap = (errors: FieldError[]): Record<string, string> => {
  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    errorMap[field.toLowerCase()] = message;
  });

  return errorMap;
};
