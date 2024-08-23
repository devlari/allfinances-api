import { InvalidInputError } from '../http-helper';
import { z } from 'zod';

export function ValidateInputSchema<T>(
  input: T,
  schema: z.Schema<T>,
): InvalidInputError | null {
  try {
    schema.parse(input);
    return null;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return new InvalidInputError(
        error.errors.map((e) => e.message).join(', '),
      );
    }
    return new InvalidInputError('Erro ao validar dados');
  }
}
