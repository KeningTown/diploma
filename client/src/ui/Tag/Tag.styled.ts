import styled from 'styled-components'

export const Container = styled.div`
  cursor: default;
  user-select: none;
  display: flex;
  align-items: center;

  > * {
    font: inherit;
    color: inherit !important;
  }

  button {
    align-self: stretch;
    margin-right: -7px;
    width: 20px !important;
    height: auto !important;
    display: flex;
    justify-content: center;
    align-items: center;

    > span * {
      font-size: 10px !important;
    }
  }
`
