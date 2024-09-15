import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LogoutDto } from './dto/logout.dto';
import { ProfileDto } from './dto/profile.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { ResendVerificationEmailDto } from './dto/resendVerificationEmail.dto';
import { ChangeEmailDto } from './dto/changeEmail.dto';
import { DeleteAccountDto } from './dto/deleteAccount.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { log } from 'console';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    console.log(loginDto);
    return this.authenticationService.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authenticationService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Body() logoutDto: LogoutDto) {
    return this.authenticationService.logout(logoutDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Body() profileDto: ProfileDto, @Request() req: any) {
    const user = req.user; // Extract user from request
    console.log(user);
    return this.authenticationService.profile(profileDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authenticationService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authenticationService.resetPassword(resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authenticationService.changePassword(changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-email')
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authenticationService.verifyEmail(verifyEmailDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('resend-verification-email')
  resendVerificationEmail(
    @Body() resendVerificationEmailDto: ResendVerificationEmailDto,
  ) {
    return this.authenticationService.resendVerificationEmail(
      resendVerificationEmailDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-email')
  changeEmail(@Body() changeEmailDto: ChangeEmailDto) {
    return this.authenticationService.changeEmail(changeEmailDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('delete-account')
  deleteAccount(@Body() deleteAccountDto: DeleteAccountDto) {
    return this.authenticationService.deleteAccount(deleteAccountDto);
  }
}
