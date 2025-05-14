import styled, { css } from 'styled-components'

export const Container = styled.button<{ $iconOnly: boolean }>`
  ${({ $iconOnly }) =>
    $iconOnly &&
    css`
      line-height: 0;
    `}
`
