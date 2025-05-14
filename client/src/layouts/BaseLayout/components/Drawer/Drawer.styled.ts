import styled from 'styled-components'

export const Drawer = styled.div`
  > div {
    > div:first-child {
      padding: ${({ theme }) => theme.spacing(2)};
    }

    > div:last-child {
      padding: 0 !important;
    }
  }
`
