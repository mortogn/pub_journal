import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenPayload } from './token.type';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Please log in to continue.');
    }

    try {
      const payload: AuthTokenPayload =
        await this.jwtService.verifyAsync(token);
      // You can attach the payload to the request object if needed
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Please log in to continue.');
    }

    return true;
  }

  extractTokenFromHeader(request: Request): string | null {
    const [type, token] =
      'authorization' in request.headers &&
      typeof request.headers['authorization'] === 'string'
        ? request.headers['authorization'].split(' ')
        : [null, null];
    return type === 'Bearer' && token ? token : null;
  }
}
