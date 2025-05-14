import styled from 'styled-components'

export const Container = styled.div<{ $width?: number }>`
  position: relative;
  width: ${({ $width }) => ($width ? `${$width}px` : 'auto')};
`
