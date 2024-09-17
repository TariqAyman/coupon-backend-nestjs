import { UserRole } from 'src/common/enums/UserRole';

export class ProfileDto {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
