import React from 'react'
import { TableOpsModal, TableOpsModalProps } from './TableOpsModal'

export interface TableOperationsModalProps extends TableOpsModalProps {}

export const TableOperationsModal: React.FC<TableOperationsModalProps> = (props) => {
  return <TableOpsModal {...props} />
}

export default TableOperationsModal
