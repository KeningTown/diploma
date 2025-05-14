import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository, wrap } from '@mikro-orm/core'
import { Group } from './group.entity'
import { EntityManager } from '@mikro-orm/postgresql'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PageDto } from '../common/dtos/page.dto'
import { UsersGroups } from '../users-groups/users.groups.entity'
import { GroupDto } from './dtos/group.dto'
import { GroupUsersDto } from './dtos/groupUsers.dto'
import { GetGroupUsersDto } from './dtos/getGroupUsers.dto'
import { GetGroupsDto } from './dtos/getGroups.dto'
import { AddGroupDto } from './dtos/addGroup.dto'
import { UpdateGroupDto } from './dtos/updateGroup.dto'
import { AddEntityResultDto } from '../common/dtos/addEntityResult.dto'
import { UpdateEntityResultDto } from '../common/dtos/updateEntityResult.dto'
import { DeleteEntityResultFailDto } from '../common/dtos/deleteEntityResultFail.dto'
import { DeleteEntityResultSuccessDto } from '../common/dtos/deleteEntityResultSuccess.dto'

@Injectable()
export default class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupsRepository: EntityRepository<Group>,
    private readonly em: EntityManager
  ) {}

  async getGroups(limit = 50, offset = 0) {
    const [groups, count] = await this.groupsRepository.findAndCount(
      {},
      { limit, offset, orderBy: { id: 'asc' } }
    )
    const groupDtos = groups.map((group) => new GroupDto(group))
    return new GetGroupsDto(groupDtos, new PageDto(count, limit, offset))
  }

  async getGroup(id: number) {
    try {
      const group = await this.groupsRepository.findOneOrFail(id)

      return new GroupDto(group)
    } catch ({ message }) {
      throw new HttpException({ message }, HttpStatus.BAD_REQUEST)
    }
  }

  async getGroupUsers(id: number, limit = 50, offset = 0) {
    const [usersGroups, count] = await this.em.findAndCount(
      UsersGroups,
      { group: { id: id } },
      { limit, offset, populate: ['user'], orderBy: { createdAt: 'desc' } }
    )
    const groupUsers = usersGroups.map(
      (groupUsers) => new GroupUsersDto(groupUsers)
    )
    return new GetGroupUsersDto(groupUsers, new PageDto(count, limit, offset))
  }

  async addGroup(body: AddGroupDto) {
    try {
      const group = this.groupsRepository.create(body)
      await this.em.flush()
      return new AddEntityResultDto({
        data: { id: group.id, createdAt: group.createdAt }
      })
    } catch (e) {
      throw new HttpException(
        new AddEntityResultDto({
          errorMessage: 'Error description: ' + e.message
        }),
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async updateGroup(id: number, body: UpdateGroupDto) {
    const group = await this.em.findOne(Group, { id: id })
    if (group == null) {
      throw new HttpException(
        new UpdateEntityResultDto({
          errorMessage: 'Specified group does not exist!'
        }),
        HttpStatus.BAD_REQUEST
      )
    }
    try {
      wrap(group).assign(body)
      await this.em.flush()
      return new UpdateEntityResultDto({
        data: { updatedAt: group.updatedAt }
      })
    } catch (e) {
      throw new HttpException(
        new UpdateEntityResultDto({
          errorMessage: 'Error description: ' + e.message
        }),
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async deleteGroup(id: number) {
    const group = await this.em.findOne(Group, { id: id })
    if (group == null) {
      throw new HttpException(
        new DeleteEntityResultFailDto('Specified group does not exist!'),
        HttpStatus.BAD_REQUEST
      )
    }
    try {
      await this.em.nativeDelete(Group, { id: id })
      await this.em.flush()
      return new DeleteEntityResultSuccessDto()
    } catch (e) {
      throw new HttpException(
        new DeleteEntityResultFailDto('Error description: ' + e.message),
        HttpStatus.BAD_REQUEST
      )
    }
  }
}
