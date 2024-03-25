import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '../utils/commonValidation';

extendZodWithOpenApi(z);

z.string().openapi({ description: 'Some string' });

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  password: z.string()
});

export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export type UserCreate = z.infer<typeof UserCreateSchema.shape.body>;
export const UserCreateSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
  }),
});

export type UserDelete = z.infer<typeof UserDeleteSchema.shape.body>;
export const UserDeleteSchema = z.object({
  body: z.object({
    id: z.number(),
  }),
});

export type AuthData = z.infer<typeof AuthenticationSchema.shape.body>;
export const AuthenticationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string()
  }),
});



