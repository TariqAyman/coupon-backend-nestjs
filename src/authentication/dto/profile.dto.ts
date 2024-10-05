import { UserProvider } from 'firebase-admin/lib/auth/auth-config';
import { UserGender } from 'src/common/enums/UserGender';
import { UserRole } from 'src/common/enums/UserRole';
import { UserStatus } from 'src/common/enums/UserStatus';

export class ProfileDto {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phoneNumber: string;
  phoneNumberCountryCode: string;
  avatar: string;
  birthday: Date;
  joined: Date;
  gender: UserGender;
  provider: UserProvider;
  confirmAccount: boolean = false;
  lastLogin: Date;
  lastLogout: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: any) {
    this.id = user.id;
    this.fullName = user.fullName;
    this.email = user.email;
    this.role = user.role;
    this.status = user.status;
    this.phoneNumber = user.phoneNumber;
    this.phoneNumberCountryCode = user.phoneNumberCountryCode;
    this.avatar = user.avatar;
    this.birthday = user.birthday;
    this.joined = user.joined;
    this.gender = user.gender;
    this.provider = user.provider;
    this.confirmAccount = user.confirmAccount;
    this.lastLogin = user.lastLogin;
    this.lastLogout = user.lastLogout;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
