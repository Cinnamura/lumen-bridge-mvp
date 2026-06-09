import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'role';
export const Roles = (role: 'admin' | 'operator') => SetMetadata(ROLES_KEY, role);
