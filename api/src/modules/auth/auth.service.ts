import {
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { LoginData } from './auth.types'

import UsersService from '../users/users.service'

import { encrypt } from './auth.helpers'

import { UserWithGroupsAndRolesDto } from '../users/dtos/userWithGroupsAndRoles.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login({ email, password }: LoginData) {
    const { user, dto } = await this.usersService.getUserFullByEmail(email)
    bcrypt.compare(password, user?.password, function (_, result) {
      if (!result) {
        throw new UnauthorizedException('Wrong password')
      }
    })

    const tokens = await this.getTokens(dto)
    await this.usersService.updateUser(user.id, {
      refreshToken: await encrypt(tokens.refreshToken)
    })
    return tokens
  }

  async logout(userId: number) {
    const user = await this.usersService.getUser(userId)
    await this.usersService.updateUser(user.id, {
      refreshToken: null
    })
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.getUser(userId)

    if (!user.refreshToken) {
      throw new ForbiddenException('No active refresh token')
    }

    const refreshTokenHash = await encrypt(refreshToken)

    if (refreshTokenHash !== user.refreshToken) {
      throw new ForbiddenException('Refresh token is malformed')
    }

    const { dto } = await this.usersService.getUserFullByEmail(user.email)
    const tokens = await this.getTokens(dto)
    await this.usersService.updateUser(dto.id, {
      refreshToken: await encrypt(tokens.refreshToken)
    })
    return tokens
  }

  getUserFromAuthHeader(authHeader: string) {
    const data = this.jwtService.decode(authHeader.split(' ')[1])
    return data.user as UserWithGroupsAndRolesDto
  }

  async getTokens(user: UserWithGroupsAndRolesDto) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { user: user },
        // TODO: вернуть 15m
        { expiresIn: '1d', secret: `${process.env.JWT_ACCESS_SECRET}` }
      ),
      this.jwtService.signAsync(
        { userId: user.id },
        { expiresIn: '180d', secret: `${process.env.JWT_REFRESH_SECRET}` }
      )
    ])

    return {
      accessToken,
      refreshToken
    }
  }
}
