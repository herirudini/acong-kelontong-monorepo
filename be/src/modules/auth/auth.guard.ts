// jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

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

    const token = authHeader.split(' ')[1];

    const auth = this.authService.verifyToken(token);
    if (auth) {
      req.user = auth;
      return true;
    }
    return false;
  }
}
