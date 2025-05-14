import { RoleProps } from '../../../role'

export const dataDecorator = (data: RoleProps.List) => data.data

export const rolesMapper = ({ id, name }: RoleProps.Item) => ({
  value: id,
  label: name
})
