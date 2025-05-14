import styled from 'styled-components'

export const Container = styled.div<{ $size?: number }>`
  font-size: ${({ $size }) => ($size ? `${$size}px` : 'auto')};
`
