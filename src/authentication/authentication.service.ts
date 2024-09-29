import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
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
import { jwtConstants } from './constants';

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
    };


    // Calculate the expiration time
    const expirationDate = new Date(
      Date.now() + this.parseExpirationTime(jwtConstants.expiresIn) * 1000,
    );

    // Calculate the expiration time
    const refreshExpirationDate = new Date(
      Date.now() +
        this.parseExpirationTime(jwtConstants.refreshExpiresIn) * 1000,
    );

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: jwtConstants.refreshExpiresIn,
    });

    return {
      user: payload,
      token: {
        type: 'Bearer',
        access_token: accessToken,
        access_token_expire: expirationDate.toISOString(),
        refresh_token: refreshToken,
        refresh_token_expire: refreshExpirationDate.toISOString(),
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const newPayload = {
        id: payload.id,
        email: payload.email,
        fullName: payload.fullName,
        role: payload.role,
      };

      // Calculate the expiration time
      const expirationDate = new Date(
        Date.now() + this.parseExpirationTime(jwtConstants.expiresIn) * 1000,
      );

      // Calculate the expiration time
      const refreshExpirationDate = new Date(
        Date.now() +
          this.parseExpirationTime(jwtConstants.refreshExpiresIn) * 1000,
      );
      
      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: jwtConstants.refreshExpiresIn,
      });

      return {
        token: {
          type: 'Bearer',
          access_token: newAccessToken,
          access_token_expire: expirationDate.toISOString(),
          refresh_token: newRefreshToken,
          refresh_token_expire: refreshExpirationDate.toISOString(),
        },
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.register(registerDto);
    return user;
  }

  async logout(request: any) {
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

  // Helper method to parse expiration time
  private parseExpirationTime(expiration: string | number): number {
    if (typeof expiration === 'number') {
      return expiration;
    }
    const match = expiration.match(/(\d+)([smhd])/);
    if (!match) {
      return 3600; // Default to 1 hour if parsing fails
    }
    const value = parseInt(match[1]);
    const unit = match[2];
    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 3600;
    }
  }
}
