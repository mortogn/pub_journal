import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthTokenPayload } from 'src/auth/token.type';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: AuthTokenPayload) {
    return this.usersService.me(user.sub);
  }

  @Get()
  list(@CurrentUser() user: AuthTokenPayload) {
    return this.usersService.list(user);
  }

  @Patch('role')
  updateRole(
    @CurrentUser() user: AuthTokenPayload,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.usersService.updateRole(user, updateRoleDto);
  }
}
