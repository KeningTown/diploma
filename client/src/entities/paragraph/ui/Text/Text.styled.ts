import styled, { css } from 'styled-components'

export const Container = styled.div<{
  $isSelected: boolean
  $isTable: boolean
}>`
  cursor: default;
  display: ${({ $isTable }) => ($isTable ? 'block' : 'inline')};

  ${({ $isSelected, theme }) =>
    $isSelected &&
    css`
      background-color: ${theme.palette.purple[0]};
    `}
`
