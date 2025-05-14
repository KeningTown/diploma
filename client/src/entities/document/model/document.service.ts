const MAX_LENGTH = 21

export const getShortAbstract = (abstract: string) => {
  const items = abstract.split(' ')

  if (!items || items.length <= MAX_LENGTH) {
    return abstract
  }

  return items.slice(0, MAX_LENGTH).join(' ') + '...'
}
