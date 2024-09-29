import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { ResendVerificationEmailDto } from './dto/resendVerificationEmail.dto';
import { ChangeEmailDto } from './dto/changeEmail.dto';
import { DeleteAccountDto } from './dto/deleteAccount.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { success } from 'src/common/utils/api-response-wrapper';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const response = await this.authenticationService.login(
      loginDto.email,
      loginDto.password,
    );
    return success(response);
  }

  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    const response = await this.authenticationService.refresh(
      body.refresh_token,
    );
    return success(response);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const response = await this.authenticationService.register(registerDto);
    return success(response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    await this.authenticationService.logout(req);
    return success([]);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req: any) {
    const response = await this.authenticationService.profile(req.user);
    return success(response);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const response =
      await this.authenticationService.forgotPassword(forgotPasswordDto);
    return success(response);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const response =
      await this.authenticationService.resetPassword(resetPasswordDto);
    return success(response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const response =
      await this.authenticationService.changePassword(changePasswordDto);
    return success(response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    const response =
      await this.authenticationService.verifyEmail(verifyEmailDto);
    return success(response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('resend-verification-email')
  async resendVerificationEmail(
    @Body() resendVerificationEmailDto: ResendVerificationEmailDto,
  ) {
    const response = await this.authenticationService.resendVerificationEmail(
      resendVerificationEmailDto,
    );
    return success(response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-email')
  async changeEmail(@Body() changeEmailDto: ChangeEmailDto) {
    const response =
      await this.authenticationService.changeEmail(changeEmailDto);
    return success(response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('delete-account')
  async deleteAccount(@Body() deleteAccountDto: DeleteAccountDto) {
    const response =
      await this.authenticationService.deleteAccount(deleteAccountDto);
    return success(response);
  }
}
