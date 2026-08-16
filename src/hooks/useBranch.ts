import { useState, useEffect } from 'react'
import {
  BranchInfo,
  BranchSalesMetrics,
  CreateBranchPayload,
  fetchBranches,
  createBranch as apiCreateBranch,
  updateBranch as apiUpdateBranch,
  fetchMultiBranchSales,
} from '../services/hfeApi'

const STORAGE_ACTIVE_BRANCH_KEY = 'hfe_pos_active_branch'

export function useBranch(bookId: string = 'BOOK-CAFE-HQ-88') {
  const [activeBranchId, setActiveBranchIdState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_ACTIVE_BRANCH_KEY) || 'BRANCH-SENOPATI'
    } catch {
      return 'BRANCH-SENOPATI'
    }
  })

  const [branches, setBranches] = useState<BranchInfo[]>([])
  const [salesMetrics, setSalesMetrics] = useState<BranchSalesMetrics[]>([])
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedBranchForConfig, setSelectedBranchForConfig] = useState<BranchInfo | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchBranches(bookId), fetchMultiBranchSales(bookId)])
      .then(([bList, mList]) => {
        setBranches(bList)
        setSalesMetrics(mList)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [bookId])

  const setActiveBranchId = (branchId: string) => {
    setActiveBranchIdState(branchId)
    try {
      localStorage.setItem(STORAGE_ACTIVE_BRANCH_KEY, branchId)
    } catch (err) {
      console.warn('[useBranch] Failed to save active branch to localStorage:', err)
    }
  }

  const handleCreateBranch = async (payload: CreateBranchPayload) => {
    setLoading(true)
    try {
      const newBranch = await apiCreateBranch(bookId, payload)
      setBranches((prev) => [...prev, newBranch])
      setIsCreateModalOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBranch = async (branchId: string, payload: Partial<CreateBranchPayload>) => {
    setLoading(true)
    try {
      const updated = await apiUpdateBranch(bookId, branchId, payload)
      setBranches((prev) => prev.map((b) => (b.id === branchId ? { ...b, ...updated } : b)))
      setIsConfigModalOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const activeBranch = branches.find((b) => b.id === activeBranchId) ||
    branches[0] || {
      id: 'BRANCH-SENOPATI',
      code: 'SNP-01',
      name: 'Kopitiam Senopati HQ',
      address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
      status: 'active',
      initialFloat: 500000,
    }

  return {
    activeBranchId,
    setActiveBranchId,
    activeBranch,
    branches,
    salesMetrics,
    isConfigModalOpen,
    setIsConfigModalOpen,
    isCreateModalOpen,
    setIsCreateModalOpen,
    selectedBranchForConfig,
    setSelectedBranchForConfig,
    loading,
    handleCreateBranch,
    handleUpdateBranch,
  }
}
