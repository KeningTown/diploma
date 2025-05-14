import * as bcrypt from 'bcrypt'

export const encrypt = async (str: string) => {
  return await bcrypt.hash(str, process.env.SALT)
}
