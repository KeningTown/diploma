import { Permission, permission } from '@/entities'

import { ADMIN_DICTIONARY_TERMS, ADMIN_DICTIONARY_ANALYSIS } from '@/routes'

import { TermsTab, AnalysisTab } from './tabs'

export const getTabs = (checkPermissions: Permission.CheckPermissions) => {
  const tabs = []

  const canListTerm = checkPermissions({
    [permission.constants.PermissionEntity.TERM]:
      permission.constants.PermissionAction.LIST
  })

  if (canListTerm) {
    tabs.push({
      route: ADMIN_DICTIONARY_TERMS,
      label: 'Термины',
      Component: TermsTab
    })
  }

  const canListTermAnalysis = checkPermissions({
    [permission.constants.PermissionEntity.TERM_ANALYSIS]:
      permission.constants.PermissionAction.LIST
  })

  if (canListTermAnalysis) {
    tabs.push({
      route: ADMIN_DICTIONARY_ANALYSIS,
      label: 'Терминологический анализ',
      Component: AnalysisTab
    })
  }

  return tabs
}
