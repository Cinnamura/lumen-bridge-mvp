import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
/** Accepts one role or a list — guards allow access if user.role is in the list. */
export const Roles = (...roles: ('admin' | 'operator')[]) => SetMetadata(ROLES_KEY, roles);
