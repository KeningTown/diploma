import { UserProps } from '../../model'

export const getInitialValues = (
  item?: UserProps.Item
): UserProps.CreateData => {
  if (!item) {
    return {
      lastName: '',
      firstName: '',
      middleName: '',
      email: '',
      active: true
    }
  }

  return {
    lastName: item.lastName,
    firstName: item.firstName,
    middleName: item.middleName,
    email: item.email,
    active: item.active
  }
}
