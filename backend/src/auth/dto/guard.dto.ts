import { UserRole } from '../../users/users.entity';

export class ValidatedUserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
