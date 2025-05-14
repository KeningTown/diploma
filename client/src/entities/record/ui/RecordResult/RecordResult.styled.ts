import styled from 'styled-components'

export const Container = styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)};

  .ant-table-expanded-row {
    > .ant-table-cell {
      padding: 0 !important;
      border-width: 1px 0 !important;
    }

    .ant-table,
    .ant-table-container,
    table {
      margin: 0 !important;
      border: none !important;
      border-radius: 0 !important;
    }
  }
`
