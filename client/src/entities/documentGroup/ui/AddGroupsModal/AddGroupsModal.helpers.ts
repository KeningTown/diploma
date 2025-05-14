import { GroupProps } from '../../../group'

export const dataDecorator = (data: GroupProps.List) => data.data

export const groupsMapper = ({ id, name }: GroupProps.Item) => ({
  value: id,
  label: name
})
