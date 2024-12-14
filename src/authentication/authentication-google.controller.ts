import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { GoogleOauthGuard } from 'src/common/guards/google-oauth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { log } from 'console';
import { success } from 'src/common/utils/api-response-wrapper';

@Controller('auth/google')
export class AuthenticationGoogleController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async auth() {}

  @Get('callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const token = await this.authenticationService.signInByGoogle(req.user);

    res.cookie('token', token, {
      maxAge: 2592000000,
      domain: process.env.FRONTEND_DOMAIN,
      secure: true,
      sameSite: false,
    });

    return res.redirect(process.env.FRONTEND_BASE_URL as string);
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: any) {
    return this.authenticationService.googleLogin(req);
  }
}
