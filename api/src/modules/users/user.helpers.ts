import { encrypt } from '../auth/auth.helpers'

export const getDefaultUser = async () => {
  const password = await encrypt(process.env.DEFAULT_USER_PASSWORD)

  return {
    firstName: '',
    lastName: 'Администратор',
    middleName: '',
    email: process.env.DEFAULT_USER_EMAIL,
    password
  }
}
