import { TableProps } from 'antd'

import { DocumentProps } from '../../model'

export type Data = DocumentProps.Item

export type Columns = TableProps<Data>['columns']
