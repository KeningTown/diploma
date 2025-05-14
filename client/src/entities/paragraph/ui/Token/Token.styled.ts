import styled, { css } from 'styled-components'

export const Container = styled.span<{ $opened: boolean }>`
  display: inline !important;
  white-space: nowrap;

  ${({ $opened, theme }) =>
    !$opened &&
    css`
      cursor: pointer;
      color: ${theme.palette.blue[5]};
      /* color: $theme.palette.geekblue[6]}; */
      /* background-color: ${theme.palette.geekblue[0]}; */
    `}
`
