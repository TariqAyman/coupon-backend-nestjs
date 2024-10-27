import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
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
import { log } from 'console';

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

  async generateAccessToken(user: any) {
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

    user.lastLogin = new Date();

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

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAccessToken(user);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      return this.generateAccessToken(payload);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async register(registerDto: RegisterDto, avatar: any) {
    const user = await this.userService.register(registerDto, avatar);
    return new ProfileDto(user);
  }

  async logout(request: any) {
    // Implement your logout logic here
    // For example, you can invalidate the user's session or token
  }

  async profile(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');
    return new ProfileDto(user);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '1h' },
    );

    // TODO: Send email with reset token
    // This part would involve using an email service to send the reset token to the user's email

    return 'Password reset instructions sent to your email';
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const payload = this.jwtService.verify(resetPasswordDto.token);
      const user = await this.userService.findOne(payload.userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await bcrypt.hash(
        resetPasswordDto.newPassword,
        10,
      );
      // await this.userService.updatePassword(user.id, hashedPassword);

      return 'Password reset successful';
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async changeEmail(changeEmailDto: ChangeEmailDto) {
    const user = await this.userService.findOne(changeEmailDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // TODO: Implement email verification logic
    // You might want to send a verification email to the new email address

    // await this.userService.updateEmail(user.id, changeEmailDto.newEmail);
    return 'Email changed successfully';
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.userService.findOne(changePasswordDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );
    // await this.userService.updatePassword(user.id, hashedNewPassword);

    return 'Password changed successfully';
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    try {
      const payload = this.jwtService.verify(verifyEmailDto.token);
      const user = await this.userService.findOne(payload.userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // await this.userService.verifyEmail(user.id);
      return 'Email verified successfully';
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async resendVerificationEmail(
    resendVerificationEmailDto: ResendVerificationEmailDto,
  ) {
    const user = await this.userService.findByEmail(
      resendVerificationEmailDto.email,
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // if (user.isEmailVerified) {
    //   return 'Email is already verified';
    // }

    const verificationToken = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '1d' },
    );

    // TODO: Send verification email
    // This part would involve using an email service to send the verification token to the user's email

    return 'Verification email resent successfully';
  }

  async deleteAccount(deleteAccountDto: DeleteAccountDto) {
    const user = await this.userService.findOne(deleteAccountDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // TODO: Implement any necessary cleanup logic
    // For example, you might want to delete associated data, revoke tokens, etc.

    // await this.userService.deleteUser(user.id);
    return 'Account deleted successfully';
  }

  async signInByGoogle(user: any): Promise<any> {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    let userExists = await this.userService.findByEmail(user.email);

    log('userExists', userExists);

    if (!userExists) {
      const userExists = await this.userService.registerGoogleUser(user);

      if (!userExists) {
        throw new InternalServerErrorException('Failed to register user');
      }
    }

    return await this.generateAccessToken(userExists);
  }
  
  googleLogin(req: any) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
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
