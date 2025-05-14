import { GroupProps } from '../../model'

export const getInitialValues = (
  item?: GroupProps.Item
): GroupProps.CreateData => {
  if (item) {
    return {
      name: item.name
    }
  }

  return {
    name: ''
  }
}
