import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { Injectable } from '@nestjs/common'
import { JwtRefreshPayload } from '../auth.types'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `${process.env.JWT_REFRESH_SECRET}`,
      ignoreExpiration: false,
      passReqToCallback: true
    })
  }

  validate(req: Request, payload: JwtRefreshPayload) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim()
    return { ...payload, refreshToken }
  }
}
