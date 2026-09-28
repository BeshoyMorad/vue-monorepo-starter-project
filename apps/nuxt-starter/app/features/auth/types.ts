import type * as yup from 'yup';
import type { schema } from '@/features/auth/schemas/login.schema';
import type { AuthSession } from '@/types/auth';

export type LoginForm = Partial<yup.InferType<typeof schema>>;

export type LoginRequest = LoginForm;

export type LoginResponse = AuthSession;
