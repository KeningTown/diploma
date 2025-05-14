import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards
} from '@nestjs/common'
import { LoginData } from './auth.types'
import { AuthService } from './auth.service'
import { NotFoundError } from '@mikro-orm/core'
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard'
import { getCurrentUserData } from '../common/decorators/getCurrentUserData.decorator'
import { getCurrentUserId } from '../common/decorators/getCurrentUserId.decorator'
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() data: LoginData) {
    return await this.authService.login(data)
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/logout')
  async logout(@getCurrentUserId() userId: number) {
    await this.authService.logout(userId)
  }

  // TODO: не всегда работает (вроде только в докере)
  @UseGuards(RefreshTokenGuard)
  @Get('/refreshTokens')
  async refreshTokens(
    @getCurrentUserData('userId') userId: number,
    @getCurrentUserData('refreshToken') refreshToken: string
  ) {
    try {
      return await this.authService.refreshTokens(userId, refreshToken)
    } catch (e) {
      const status =
        e instanceof NotFoundError
          ? HttpStatus.NOT_FOUND
          : e instanceof ForbiddenException
            ? HttpStatus.FORBIDDEN
            : HttpStatus.BAD_REQUEST
      throw new HttpException({ message: e.message }, status)
    }
  }
}
