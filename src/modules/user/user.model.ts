import { Prisma } from '@prisma/client';
import { UserStatus } from '../../core/enums';

export class User implements Prisma.UserCreateInput {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  status?: UserStatus;
  firstLogin?: boolean | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
