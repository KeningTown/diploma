import { UserWithGroupsAndRolesDto } from '../users/dtos/userWithGroupsAndRoles.dto'

export type LoginData = {
  email: string
  password: string
}

export type JwtAccessPayload = {
  user: UserWithGroupsAndRolesDto
}

export type JwtRefreshPayload = {
  userId: number
}
