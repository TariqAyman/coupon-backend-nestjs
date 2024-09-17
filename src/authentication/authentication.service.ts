import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
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
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { success } from 'src/common/utils/api-response-wrapper';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
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
      fullName: user.fullName,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return success({
      user: payload,
      token: {
        type: 'Bearer',
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const newPayload = {
        id: payload.id,
        email: payload.email,
        fullName: payload.fullName,
        role: payload.role,
        created_at: payload.created_at,
        updated_at: payload.updated_at,
      };

      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      return success({
        token: {
          type: 'Bearer',
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
        },
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.register(registerDto);
    return user;
  }

  async logout(logoutDto: LogoutDto) {
    return 'Logout successful';
  }

  async profile(request: any) {
    const user = await this.userService.findOne(request.userId);
    if (!user) throw new NotFoundException('User not found');
    return user as ProfileDto;
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
