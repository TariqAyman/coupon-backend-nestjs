import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Req,
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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { success } from 'src/common/utils/api-response-wrapper';
import { EntityFileInterceptor } from 'src/upload-media/entity-file.interceptor';
import { UpdateProfileDto } from './dto/updateProfile.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const response = await this.authenticationService.login(loginDto);
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
  @UseInterceptors(EntityFileInterceptor('user', 'avatar'))
  async register(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() registerDto: RegisterDto,
  ) {
    const response = await this.authenticationService.register(
      registerDto,
      avatar,
    );
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
    const response = await this.authenticationService.profile(req.user.id);
    return success(response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @UseInterceptors(EntityFileInterceptor('user', 'avatar'))
  async updateProfile(
    @Req() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const response = await this.authenticationService.updateProfile(
      req.user.id,
      updateProfileDto,
      avatar,
    );
    return success(response);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const response =
      await this.authenticationService.forgotPassword(forgotPasswordDto);
    return success({ message: response });
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const response =
      await this.authenticationService.resetPassword(resetPasswordDto);
    return success({ message: response });
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const response = await this.authenticationService.changePassword(
      req.user.id,
      changePasswordDto,
    );
    return success({ message: response });
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    const response =
      await this.authenticationService.verifyEmail(verifyEmailDto);
    return success({ message: response });
  }

  @UseGuards(JwtAuthGuard)
  @Post('resend-verification-email')
  async resendVerificationEmail(
    @Body() resendVerificationEmailDto: ResendVerificationEmailDto,
  ) {
    const response = await this.authenticationService.resendVerificationEmail(
      resendVerificationEmailDto,
    );
    return success({ message: response });
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-email')
  async changeEmail(
    @Request() req: any,
    @Body() changeEmailDto: ChangeEmailDto,
  ) {
    const response = await this.authenticationService.changeEmail(
      req.user.id,
      changeEmailDto,
    );
    return success({ message: response });
  }

  @UseGuards(JwtAuthGuard)
  @Post('delete-account')
  async deleteAccount(@Request() req: any) {
    const response = await this.authenticationService.deleteAccount(
      req.user.id,
    );
    return success({ message: response });
  }
}
