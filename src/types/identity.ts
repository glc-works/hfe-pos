import { StaffRole } from './pos'

// --- HFE CARD DUAL-PERSONA & MULTI-IDENTITY TYPES ---
export type IdentityType = 'life' | 'work'

export interface WorkIdentityConfig {
  companyName: string
  companyBookId: string
  branchName: string
  role: StaffRole
  employeeId: string
  qrPassCode: string
  activeShift?: {
    clockInTime: string
    shiftDuration: string
    isClockedIn: boolean
  }
  staffCoffeeQuotaRemaining?: number
  pendingApprovalsCount?: number
}

export interface HfeUserIdentity {
  id: string
  type: IdentityType
  label: string
  icon: string
  workConfig?: WorkIdentityConfig
}

export interface DeliveryTask {
  id: string
  orderId: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  itemsSummary: string
  totalAmount: number
  paymentStatus: 'PAID' | 'COD_UNPAID'
  status: 'assigned' | 'in_transit' | 'delivered'
  assignedCourierName: string
  estimatedArrivalMinutes?: number
}

export interface ManagerApprovalRequest {
  id: string
  orderId: string
  tableNumber?: string
  type: 'void_item' | 'void_bill' | 'refund' | 'custom_discount' | 'open_drawer'
  amount: number
  reason: string
  requestedByCashierName: string
  requestedAt: string
  status: 'pending' | 'approved' | 'rejected'
}
