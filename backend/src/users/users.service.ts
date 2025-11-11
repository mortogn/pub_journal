import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthTokenPayload } from 'src/auth/token.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async me(userId: string) {
    return this.prismaService.user.findFirst({
      where: { id: userId },
    });
  }

  async list(user: AuthTokenPayload) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    const users = await this.prismaService.user.findMany({
      orderBy: { createdAt: 'desc' },
      omit: {
        password: true,
      },
    });

    return users;
  }

  async updateRole(user: AuthTokenPayload, updateRoleDto: UpdateRoleDto) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    const { id, role } = updateRoleDto;

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: { role },
      omit: {
        password: true,
      },
    });

    return updatedUser;
  }
}
