import { RoleProps, role } from '../../model'

export const getInitialValues = (
  item?: RoleProps.Item
): RoleProps.CreateData => {
  if (!item) {
    return {
      name: '',
      type: role.constants.RoleType.CUSTOM
      // permissions: []
    }
  }

  return {
    name: item.name,
    type: item.type
    // permissions: item.permissions?.map(({ id }) => id)
  }
}
