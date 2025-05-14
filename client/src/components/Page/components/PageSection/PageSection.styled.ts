import styled, { css } from 'styled-components'

export const Container = styled.section<{
  $fitContent: boolean
  $noBackground: boolean
}>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: ${({ $fitContent }) => ($fitContent ? 'fit-content' : 'auto')};

  ${({ $noBackground, theme }) =>
    !$noBackground &&
    css`
      padding: ${theme.breakpoint.lg ? theme.spacing(3) : theme.spacing(2)};
      background-color: ${theme.palette.white};
      border-radius: ${({ theme }) => theme.atom}px;
    `}
`
