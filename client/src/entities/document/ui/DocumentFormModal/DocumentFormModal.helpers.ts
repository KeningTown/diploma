import { DocumentProps } from '../../model'

export const getInitialValues = (
  item?: DocumentProps.Item
): DocumentProps.CreateData => {
  if (!item) {
    return {
      title: '',
      abstract: ''
    }
  }

  return {
    title: item.title,
    abstract: item.abstract
  }
}
