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
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
    private readonly prismaService: PrismaService,
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

      const user = await this.prismaService.user.findUnique({
        where: { id: payload.sub },
        select: {
          role: true,
        },
      });
      // Attach payload to the request, preferring DB role when available; fallback to JWT role
      request['user'] = { ...payload, role: user?.role ?? payload.role };
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
