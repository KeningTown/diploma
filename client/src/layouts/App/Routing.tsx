import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { Permission, permission } from '@/entities'

import * as route from '@/routes'

import BaseLayout from '../BaseLayout'
import * as Page from '@/pages'

const Routing: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route path={route.LOGIN} element={<Page.LoginPage />} />
        <Route index element={<Navigate to={route.DOCUMENTS} />} />
        <Route path={route.DOCUMENTS} element={<Page.DocumentsPage />} />
        <Route path={route.DOCUMENT} element={<Page.DocumentPage />} />
        <Route
          path={route.DOCUMENT_CONTENT}
          element={<Page.DocumentContentPage />}
        />
        {/* <Route path={route.DICTIONARY} element={<>Dictionary</>} /> */}
        {/* <Route path={route.SEARCH} element={<Page.SearchPage />} /> */}
        <Route path={route.PROFILE} element={<Page.UserPage />} />

        <Route
          path={route.ADMIN_ROOT}
          element={<Navigate to={route.ADMIN_DOCUMENTS} />}
        />
        {/* <Route path={route.ADMIN_DASHBOARD} element={<>Admin dashboard</>} /> */}

        <Route
          path={route.ADMIN_DOCUMENTS}
          element={
            <Permission.PermissionChecker
              showStatus
              permissions={{
                [permission.constants.PermissionEntity.DOCUMENT]:
                  permission.constants.PermissionAction.LIST
              }}
            >
              <Page.AdminDocumentsPage />
            </Permission.PermissionChecker>
          }
        />
        <Route
          path={route.ADMIN_DOCUMENT}
          element={
            <Permission.PermissionChecker
              showStatus
              permissions={{
                [permission.constants.PermissionEntity.DOCUMENT]:
                  permission.constants.PermissionAction.READ
              }}
            >
              <Page.AdminDocumentPage />
            </Permission.PermissionChecker>
          }
        />
        <Route
          path={route.ADMIN_DOCUMENT_CONTENT}
          element={
            <Permission.PermissionChecker
              showStatus
              permissions={{
                [permission.constants.PermissionEntity.DOCUMENT]:
                  permission.constants.PermissionAction.READ,
                [permission.constants.PermissionEntity.BLOCK]:
                  permission.constants.PermissionAction.LIST
              }}
            >
              <Page.AdminDocumentContentPage />
            </Permission.PermissionChecker>
          }
        />

        <Route
          path={route.ADMIN_USERS}
          element={
            <Permission.PermissionChecker
              showStatus
              permissions={{
                [permission.constants.PermissionEntity.USER]:
                  permission.constants.PermissionAction.LIST
              }}
            >
              <Page.AdminUsersPage />
            </Permission.PermissionChecker>
          }
        />
        <Route
          path={route.ADMIN_USER}
          element={
            <Permission.PermissionChecker
              showStatus
              permissions={{
                [permission.constants.PermissionEntity.USER]:
                  permission.constants.PermissionAction.READ
              }}
            >
              <Page.AdminUserPage />
            </Permission.PermissionChecker>
          }
        />

        <Route
          path={route.ADMIN_ROLES}
          element={
            <Permission.PermissionChecker
              showStatus
              permissions={{
                [permission.constants.PermissionEntity.ROLE]:
                  permission.constants.PermissionAction.LIST
              }}
            >
              <Page.AdminRolesPage />
            </Permission.PermissionChecker>
          }
        />
        <Route
          path={route.ADMIN_ROLE}
          element={
            <Permission.PermissionChecker
              showStatus
              permissions={{
                [permission.constants.PermissionEntity.ROLE]:
                  permission.constants.PermissionAction.READ
              }}
            >
              <Page.AdminRolePage />
            </Permission.PermissionChecker>
          }
        />

        <Route
          path={route.ADMIN_GROUPS}
          element={
            <Permission.PermissionChecker
              showStatus
              permissions={{
                [permission.constants.PermissionEntity.GROUP]:
                  permission.constants.PermissionAction.LIST
              }}
            >
              <Page.AdminGroupsPage />
            </Permission.PermissionChecker>
          }
        />
        <Route
          path={route.ADMIN_GROUP}
          element={
            <Permission.PermissionChecker
              showStatus
              permissions={{
                [permission.constants.PermissionEntity.GROUP]:
                  permission.constants.PermissionAction.READ
              }}
            >
              <Page.AdminGroupPage />
            </Permission.PermissionChecker>
          }
        />

        <Route
          path={route.ADMIN_DICTIONARY + '/*'}
          element={
            <Permission.PermissionChecker
              showStatus
              permissions={{
                [permission.constants.PermissionEntity.TERM]:
                  permission.constants.PermissionAction.LIST
              }}
            >
              <Page.AdminDictionaryPage />
            </Permission.PermissionChecker>
          }
        />
        <Route
          path={route.ADMIN_DICTIONARY_TERM}
          element={
            <Permission.PermissionChecker
              showStatus
              permissions={{
                [permission.constants.PermissionEntity.TERM]:
                  permission.constants.PermissionAction.READ
              }}
            >
              <Page.AdminDictionaryTermPage />
            </Permission.PermissionChecker>
          }
        />

        <Route
          path={route.ADMIN_RECORDS}
          element={
            <Permission.PermissionChecker
              showStatus
              permissions={{
                [permission.constants.PermissionEntity.RECORD]:
                  permission.constants.PermissionAction.LIST
              }}
            >
              <Page.AdminRecordsPage />
            </Permission.PermissionChecker>
          }
        />
        <Route
          path={route.ADMIN_RECORD}
          element={
            <Permission.PermissionChecker
              showStatus
              permissions={{
                [permission.constants.PermissionEntity.RECORD]:
                  permission.constants.PermissionAction.READ
              }}
            >
              <Page.AdminRecordPage />
            </Permission.PermissionChecker>
          }
        />

        <Route path="*" element={<Page.NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default Routing
