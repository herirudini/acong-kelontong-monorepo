// user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GlobalVar } from 'src/types/interfaces';

export const AuthDec = createParamDecorator(
  (ctx: ExecutionContext): GlobalVar => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as GlobalVar;
    return user;
  },
);
