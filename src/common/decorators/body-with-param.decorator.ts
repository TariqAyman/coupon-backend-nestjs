import {
  createParamDecorator,
  ExecutionContext,
  ParseIntPipe,
} from '@nestjs/common';

export enum transformToTypeTypes {
  INT = 'int',
  STRING = 'string',
}

export interface IAddParamsToBodyArgs {
  paramName: string;
  transformTo?: transformToTypeTypes;
}

export const BodyWithParam = createParamDecorator(
  (args: IAddParamsToBodyArgs, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    let value = req.params[args.paramName];

    if (args.transformTo === transformToTypeTypes.INT) value = parseInt(value);
    if (args.transformTo === transformToTypeTypes.STRING)
      value = value.toString();

    req.body[args.paramName] = value;

    return req.body;
  },
);
