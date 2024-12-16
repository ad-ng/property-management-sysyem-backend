import { SetMetadata } from '@nestjs/common';
import { ROLE } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: [ROLE, ...ROLE[]]) =>
  SetMetadata(ROLES_KEY, roles);
