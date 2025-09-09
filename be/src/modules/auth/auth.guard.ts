import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GlobalVar, ITokenPayload } from 'src/types/many.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) { }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      console.error('Auth Guard Missing token');
      throw new UnauthorizedException('Unauthorized');
    }

    const accesToken = authHeader.split(' ')[1];
    const userAgent: string = req.headers['user-agent'] as string;

    const auth = this.authService.verifyToken(accesToken) as ITokenPayload;
    if (auth) {
      const user: GlobalVar = {
        id: auth.id,
        id0: auth.id0,
        modules: auth.modules,
        userAgent,
        accesToken
      };
      req.user = user;
      return true;
    }
    return false;
  }
}
