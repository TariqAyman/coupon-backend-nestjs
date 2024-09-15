import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LogoutDto } from './dto/logout.dto';
import { ProfileDto } from './dto/profile.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { ResendVerificationEmailDto } from './dto/resendVerificationEmail.dto';
import { DeleteAccountDto } from './dto/deleteAccount.dto';
import { ChangeEmailDto } from './dto/changeEmail.dto';
import { log } from 'console';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    console.log(await bcrypt.hash(pass, 10));
    if (user && await bcrypt.compare(pass,user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: user.role,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
    };

    return {
      user: payload,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.register(registerDto);
    return user;
  }

  async logout(logoutDto: LogoutDto) {
    return 'Logout successful';
  }

  async profile(profileDto: ProfileDto) {
    return 'Profile retrieved';
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return 'Forgot password successful';
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return 'Reset password successful';
  }

  async changeEmail(changeEmailDto: ChangeEmailDto) {
    return 'Change email successful';
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    return 'Change password successful';
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    return 'Email verified';
  }

  async resendVerificationEmail(
    resendVerificationEmailDto: ResendVerificationEmailDto,
  ) {
    return 'Verification email resent';
  }

  async deleteAccount(deleteAccountDto: DeleteAccountDto) {
    return 'Account deleted';
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}
