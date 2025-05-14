import React from 'react'
import { Typography } from 'antd'

import {
  termAnalysis,
  TermAnalysis,
  Permission,
  permission,
  TermRelation
} from '@/entities'

import { Page, Fetcher } from '@/components'

import * as Styled from './AnalysisTab.styled'

const AnalysisTab: React.FC = () => {
  return (
    <Fetcher loader request={termAnalysis.api.list}>
      {({ data, reload }) => {
        const first = data.data[0]
        const second = first?.isFinished ? first : data.data[1]

        return (
          <>
            <Page.Title
              extra={
                <Permission.PermissionChecker
                  permissions={{
                    [permission.constants.PermissionEntity.TERM_ANALYSIS]:
                      permission.constants.PermissionAction.CREATE
                  }}
                >
                  <TermAnalysis.TermAnalysisCreate
                    item={first}
                    onSuccess={reload}
                  />
                </Permission.PermissionChecker>
              }
            />
            {second && (
              <Page.Section>
                <Styled.Row>
                  <Typography.Title level={5}>
                    Результат последнего завершенного анализа
                  </Typography.Title>
                  <TermRelation.RelationTags />
                </Styled.Row>
                <TermAnalysis.TermAnalysisTable
                  item={second}
                  onSuccess={reload}
                />
              </Page.Section>
            )}
          </>
        )
      }}
    </Fetcher>
  )
}

export default AnalysisTab
