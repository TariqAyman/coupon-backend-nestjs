import { REQUEST } from '@nestjs/core';
import { Provider, Scope } from '@nestjs/common';

export const CURRENT_USER = 'CURRENT_USER';

export const CurrentUserProvider: Provider = {
  provide: CURRENT_USER,
  scope: Scope.REQUEST,
  useFactory: (request) => request?.user?.userId,
  inject: [REQUEST],
};
