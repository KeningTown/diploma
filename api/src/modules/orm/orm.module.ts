import { Module } from '@nestjs/common'
import { MikroOrmModule } from '@mikro-orm/nestjs'

import { User } from '../users/user.entity'
import { UsersGroups } from '../users-groups/users.groups.entity'
import { Group } from '../groups/group.entity'
import { Role } from '../roles/role.entity'
import { UsersRoles } from '../users-roles/users.roles.entity'
import { Permission } from '../permissions/permission.entity'
import { RolesPermissions } from '../roles-permissions/roles.permissions.entity'
import { Document } from '../documents/document.entity'
import { DocumentsGroups } from '../documents-groups/documentsGroups.entity'
import { Block } from '../blocks/block.entity'
import { Paragraph } from '../paragraph/paragraph.entity'
import { Attachment } from '../attachments/attachment.entity'
import { Term } from '../term/term.entity'
import { TermRelation } from '../termRelation/termRelation.entity'
import { Record } from '../record/record.entity'
import { TermAnalysis } from '../termAnalysis/termAnalysis.entity'
import { TermAnalysisTerm } from '../termAnalysisTerm/termAnalysisTerm.entity'

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    MikroOrmModule.forFeature({
      entities: [
        User,
        UsersGroups,
        UsersRoles,
        Group,
        Role,
        RolesPermissions,
        Permission,
        Document,
        DocumentsGroups,
        Block,
        Paragraph,
        Attachment,
        Term,
        TermRelation,
        Record,
        TermAnalysis,
        TermAnalysisTerm
      ]
    })
  ],
  exports: [MikroOrmModule]
})
export class OrmModule {}
