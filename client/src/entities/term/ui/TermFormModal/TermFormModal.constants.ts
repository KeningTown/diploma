import { TermProps } from '../../model'

export const getInitialValues = (
  item?: TermProps.Item
): TermProps.CreateData => {
  return {
    term: item?.term || '',
    definition: item?.definition || ''
  }
}
