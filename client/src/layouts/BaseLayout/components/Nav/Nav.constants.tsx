import React from 'react'
import { Link } from 'react-router-dom'

import { Permission, permission } from '@/entities'

import * as route from '@/routes'

import { Icon, IconProps } from '@/ui'

type MenuItem = {
  key: string
  type?: string
  label: string
  icon?: IconProps['icon']
  children?: MenuItem[]
}

const setRoutes = (item: MenuItem) => ({
  ...item,
  label: <Link to={item.key}>{item.label}</Link>,
  icon: item.icon ? <Icon icon={item.icon} /> : undefined
})

export const getItems = (checkPermissions: Permission.CheckPermissions) => {
  const adminItems: MenuItem[] = [
    // {
    //   key: route.ADMIN_DASHBOARD,
    //   label: 'Дашборд',
    //   icon: 'dashboard'
    // },
  ]

  if (
    checkPermissions({
      [permission.constants.PermissionEntity.DOCUMENT]:
        permission.constants.PermissionAction.LIST
    })
  ) {
    adminItems.push({
      key: route.ADMIN_DOCUMENTS,
      label: 'Документы',
      icon: 'document'
    })
  }

  if (
    checkPermissions({
      [permission.constants.PermissionEntity.USER]:
        permission.constants.PermissionAction.LIST
    })
  ) {
    adminItems.push({
      key: route.ADMIN_USERS,
      label: 'Пользователи',
      icon: 'user'
    })
  }

  if (
    checkPermissions({
      [permission.constants.PermissionEntity.GROUP]:
        permission.constants.PermissionAction.LIST
    })
  ) {
    adminItems.push({
      key: route.ADMIN_GROUPS,
      label: 'Группы',
      icon: 'group'
    })
  }

  if (
    checkPermissions({
      [permission.constants.PermissionEntity.ROLE]:
        permission.constants.PermissionAction.LIST
    })
  ) {
    adminItems.push({
      key: route.ADMIN_ROLES,
      label: 'Роли',
      icon: 'role'
    })
  }

  if (
    checkPermissions({
      [permission.constants.PermissionEntity.TERM]:
        permission.constants.PermissionAction.LIST
    })
  ) {
    adminItems.push({
      key: route.ADMIN_DICTIONARY,
      label: 'Словарь',
      icon: 'dictionary'
    })
  }

  if (
    checkPermissions({
      [permission.constants.PermissionEntity.RECORD]:
        permission.constants.PermissionAction.LIST
    })
  ) {
    adminItems.push({
      key: route.ADMIN_RECORDS,
      label: 'Мониторинг',
      icon: 'record'
    })
  }

  const items: MenuItem[] = [
    {
      key: route.DOCUMENTS,
      label: 'Обучение',
      icon: 'document'
    }
    // {
    //   key: route.DICTIONARY,
    //   label: 'Словарь',
    //   icon: 'dictionary'
    // },
    // {
    //   key: route.SEARCH,
    //   label: 'Поиск',
    //   icon: 'search'
    // }
  ]

  if (adminItems.length) {
    items.push({
      key: 'group',
      type: 'group',
      label: 'Управление',
      children: adminItems
    })
  }

  return items.map((item) => {
    if (item.children) {
      return { ...item, children: item.children.map(setRoutes) }
    }

    return setRoutes(item)
  })
}
