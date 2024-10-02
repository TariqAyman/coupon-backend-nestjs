import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from '../../authentication/authentication.service';
import { UsersService } from '../../users/users.service';

/**
 * @deprecated
 */
@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    private authService: AuthenticationService,
    private usersService: UsersService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    let tokenArray = req.headers.authorization;
    if (tokenArray) {
      const userId = await this.authService.decodeToken(
        tokenArray.split(' ')[1],
      ).id;

      const user = await this.usersService.findOne(userId);

      req.body['user'] = user;
    }

    return next
      .handle()
      .pipe
      // tap(() => console.log(``)),
      ();
  }
}
