import React from 'react'
import {
  Store,
  Plus,
  Settings,
  TrendingUp,
  ShoppingBag,
  Banknote,
  MapPin,
  Clock,
  Wifi,
  Phone,
  CheckCircle2,
} from 'lucide-react'
import { useBranch } from '../hooks/useBranch'
import { BranchSwitcherDropdown } from '../components/branches/BranchSwitcherDropdown'
import { BranchConfigModal } from '../components/branches/BranchConfigModal'
import { CreateBranchModal } from '../components/branches/CreateBranchModal'

export interface BranchManagementViewProps {
  bookId?: string
}

export const BranchManagementView: React.FC<BranchManagementViewProps> = ({
  bookId = 'BOOK-CAFE-HQ-88',
}) => {
  const {
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
    handleCreateBranch,
    handleUpdateBranch,
  } = useBranch(bookId)

  const formatIdr = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)

  const totalOmzetAllBranches = salesMetrics.reduce((acc, m) => acc + m.totalSalesIdr, 0)
  const totalOrdersAllBranches = salesMetrics.reduce((acc, m) => acc + m.orderCount, 0)

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-600 text-white rounded-xl shadow-xs">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Manajemen Cabang & Performance Multi-Outlet</h1>
            <p className="text-xs text-slate-500">Monitoring omzet komparatif, setting jam buka & WiFi per outlet</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <BranchSwitcherDropdown
            branches={branches}
            activeBranchId={activeBranchId}
            onSelectBranch={setActiveBranchId}
          />
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Cabang Baru</span>
          </button>
        </div>
      </div>

      {/* Global Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Total Outlet Cabang</span>
            <Store className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">{branches.length} Outlet</h3>
          <p className="text-xs text-slate-400 mt-1">1 Headquarter + {branches.length - 1} Branch</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Total Omzet Gabungan</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-xl font-black text-emerald-600">{formatIdr(totalOmzetAllBranches)}</h3>
          <p className="text-xs text-slate-400 mt-1">Hari ini across all branches</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Total Transaksi Order</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">{totalOrdersAllBranches} Transaksi</h3>
          <p className="text-xs text-slate-400 mt-1">Gabungan seluruh cabang</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Workstation Aktif Saat Ini</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-base font-bold text-slate-800 truncate">{activeBranch.name}</h3>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            {activeBranch.code}
          </span>
        </div>
      </div>

      {/* ⚡ HQ Network Impact: Transaksi Terakhir dari Outlet (Issue #33 Part C) */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-sm">⚡</span>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">HQ Network Impact: Transaksi Terakhir Outlet</h3>
              <p className="text-[11px] text-slate-500">Konsolidasi real-time pergerakan omzet dan laba kotor seluruh cabang</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
            Governed Consensus Active ✓
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-emerald-100">
            <span className="text-[10px] text-slate-400 block">Outlet Penghasil:</span>
            <strong className="text-slate-800 font-semibold">{activeBranch.name}</strong>
          </div>
          <div className="bg-white p-3 rounded-xl border border-emerald-100">
            <span className="text-[10px] text-slate-400 block">Delta Omzet Jaringan:</span>
            <strong className="text-emerald-600 font-mono font-bold">+Rp 57.500</strong>
          </div>
          <div className="bg-white p-3 rounded-xl border border-emerald-100">
            <span className="text-[10px] text-slate-400 block">Delta Laba Kotor:</span>
            <strong className="text-emerald-600 font-mono font-bold">+Rp 36.000 (72%)</strong>
          </div>
          <div className="bg-white p-3 rounded-xl border border-emerald-100">
            <span className="text-[10px] text-slate-400 block">Status Batas Data:</span>
            <span className="text-[10px] font-mono text-purple-700 font-semibold">Protected Boundary</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 pt-1 border-t border-emerald-100 flex items-center justify-between">
          <span>Prinsip Tenancy: Hanya data agregat & ringkasan resmi yang dikonsolidasikan ke HQ.</span>
          <span className="font-mono text-emerald-700 font-bold">1 Transaksi. 1 Kebenaran.</span>
        </div>
      </div>

      {/* Comparative Outlet Cards Grid */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-4">Performa Sales Komparatif Per Cabang</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {branches.map((branch) => {
            const metrics = salesMetrics.find((m) => m.branchId === branch.id) || {
              totalSalesIdr: 0,
              orderCount: 0,
              shiftFloatIdr: branch.initialFloat || 500000,
              topSku: 'Belum ada data',
            }

            const isCurrentActive = branch.id === activeBranchId

            return (
              <div
                key={branch.id}
                className={`bg-white rounded-2xl border transition-all shadow-xs p-6 space-y-4 ${
                  isCurrentActive ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Branch Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-slate-800 text-base">{branch.name}</h3>
                      {branch.isHQ && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                          HQ
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono">Kode: {branch.code}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBranchForConfig(branch)
                      setIsConfigModalOpen(true)
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    title="Edit Pengaturan Outlet"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>

                {/* Sales Metrics */}
                <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Omzet Penjualan:</span>
                    <span className="font-bold text-emerald-600 text-sm">{formatIdr(metrics.totalSalesIdr)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Jumlah Transaksi:</span>
                    <span className="font-bold text-slate-800">{metrics.orderCount} Orders</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Modal Kas Kasir (Float):</span>
                    <span className="font-semibold text-slate-700">{formatIdr(metrics.shiftFloatIdr)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Top Selling SKU:</span>
                    <span className="font-bold text-amber-700 truncate max-w-[140px]">{metrics.topSku}</span>
                  </div>
                </div>

                {/* Outlet Details */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center space-x-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{branch.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{branch.operatingHours || '07:00 - 22:00 WIB'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wifi className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>WiFi: {branch.wifiSsid || '-'}</span>
                  </div>
                  {branch.managerContact && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>WA: {branch.managerContact}</span>
                    </div>
                  )}
                </div>

                {/* Switch Active Button */}
                <button
                  onClick={() => setActiveBranchId(branch.id)}
                  disabled={isCurrentActive}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    isCurrentActive
                      ? 'bg-amber-100 text-amber-800 cursor-default'
                      : 'bg-slate-800 hover:bg-slate-900 text-white'
                  }`}
                >
                  {isCurrentActive ? '✓ Workstation Aktif' : 'Pilih Workstation Ini'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modals */}
      <BranchConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false)
          setSelectedBranchForConfig(null)
        }}
        onSave={handleUpdateBranch}
        branch={selectedBranchForConfig}
      />

      <CreateBranchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateBranch}
      />
    </div>
  )
}
