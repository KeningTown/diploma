import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'

import {
  DEFAULT_ROLES,
  ADMIN_ROLE_NAME
} from '../modules/permissions/permission.constants'

import { getDefaultUser } from '../modules/users/user.helpers'

import { User } from '../modules/users/user.entity'
import {
  Permission,
  PermissionAction,
  PermissionEntity
} from '../modules/permissions/permission.entity'
import { Role, RolesType } from '../modules/roles/role.entity'
import { UsersRoles } from '../modules/users-roles/users.roles.entity'
import { RolesPermissions } from '../modules/roles-permissions/roles.permissions.entity'

export class InitialDbSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Добавляем администратора
    const user = await getDefaultUser()
    const adminUser = em.create(User, user)

    // Заполняем справочник пермишенов
    for (const entity of Object.values(PermissionEntity)) {
      for (const action of Object.values(PermissionAction)) {
        em.create(Permission, {
          entity,
          action
        })
      }
    }

    for (const item of DEFAULT_ROLES) {
      // Создаем роль
      const role = em.create(Role, { name: item.name, type: RolesType.BASIC })

      // Добавляем роль администратору
      if (item.name === ADMIN_ROLE_NAME) {
        em.create(UsersRoles, { user: adminUser, role })
      }

      for (const [entity, actions] of Object.entries(item.permissions)) {
        for (const action of actions) {
          // Получаем пермишен
          const permission = await em.findOne(Permission, {
            entity: entity as PermissionEntity,
            action
          })
          // Связываем роль и пермишен
          em.create(RolesPermissions, {
            role,
            permission
          })
        }
      }
    }
  }
}
