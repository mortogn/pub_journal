import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthTokenPayload } from 'src/auth/token.type';

@Controller('stats')
@UseGuards(AuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('admin')
  async getAdminStats() {
    return this.statsService.getAdminStats();
  }

  @Get('author')
  async getAuthorStats(@CurrentUser() user: AuthTokenPayload) {
    return this.statsService.getAuthorStats(user.sub);
  }

  @Get('reviewer')
  async getReviewerStats(@CurrentUser() user: AuthTokenPayload) {
    return this.statsService.getReviewerStats(user.sub);
  }

  @Get('editor')
  async getEditorStats(@CurrentUser() user: AuthTokenPayload) {
    return this.statsService.getEditorStats(user.sub);
  }
}
