import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { resolve } from 'path'

import { UsersModule } from './modules/users/users.module'
import { OrmModule } from './modules/orm/orm.module'
import { GroupsModule } from './modules/groups/groups.module'
import { RolesModule } from './modules/roles/roles.module'
import { UsersGroupsModule } from './modules/users-groups/usersGroups.module'
import { UsersRolesModule } from './modules/users-roles/usersRoles.module'
import { RolesPermissionsModule } from './modules/roles-permissions/rolesPermissions.module'
import { PermissionsModule } from './modules/permissions/permissions.module'
import { DocumentsModule } from './modules/documents/documents.module'
import { DocumentsGroupsModule } from './modules/documents-groups/documentsGroups.module'
import { BlocksModule } from './modules/blocks/blocks.module'
import { ParagraphsModule } from './modules/paragraph/paragraphs.module'
import { AttachmentsModule } from './modules/attachments/attachments.module'
import { AuthModule } from './modules/auth/auth.module'
import { TermModule } from './modules/term/term.module'
import { TermRelationModule } from './modules/termRelation/termRelation.module'
import { RecordModule } from './modules/record/record.module'
import { TermAnalysisModule } from './modules/termAnalysis/termAnalysis.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: resolve('./upload'),
      serveRoot: '/files'
    }),
    OrmModule,
    UsersModule,
    GroupsModule,
    RolesModule,
    UsersGroupsModule,
    UsersRolesModule,
    RolesPermissionsModule,
    PermissionsModule,
    DocumentsModule,
    DocumentsGroupsModule,
    BlocksModule,
    ParagraphsModule,
    AttachmentsModule,
    AuthModule,
    TermModule,
    TermRelationModule,
    RecordModule,
    TermAnalysisModule
  ]
})
export class AppModule {}
