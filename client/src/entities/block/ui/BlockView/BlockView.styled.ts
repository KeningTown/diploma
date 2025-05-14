import styled, { css } from 'styled-components'

export const Container = styled.div<{ $isSelected: boolean }>`
  ${({ $isSelected, theme }) =>
    $isSelected &&
    css`
      outline: 1px solid ${theme.palette.purple[3]};
    `}
`

export const Space = styled.div`
  max-width: 100%;
`
