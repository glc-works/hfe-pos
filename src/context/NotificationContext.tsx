import React, { createContext, useContext, useState, useMemo, useCallback } from 'react'
import { HfeNotification, ServiceTicket } from '../types/pos'

export interface NotificationContextType {
  notifications: HfeNotification[]
  unreadCount: number
  serviceTickets: ServiceTicket[]
  openServiceTicketsCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAllNotifications: () => void
  addNotification: (notif: Omit<HfeNotification, 'id' | 'timestamp' | 'isRead'> & { id?: string; timestamp?: string; isRead?: boolean }) => void
  createServiceTicket: (ticket: Omit<ServiceTicket, 'id' | 'createdAt' | 'status'> & { id?: string; createdAt?: string; status?: ServiceTicket['status'] }) => ServiceTicket
  resolveTicket: (id: string, staffName?: string) => void
  updateTicketStatus: (id: string, status: ServiceTicket['status'], staffName?: string) => void
  deleteTicket: (id: string) => void
}

const INITIAL_NOTIFICATIONS: HfeNotification[] = [
  { id: 'notif-1', title: 'Peringatan Alergen Makanan', message: 'Tamu Meja IND-02 alergi Kacang & Gluten.', category: 'safety_allergen', timestamp: new Date(Date.now() - 2 * 60000).toISOString(), isRead: false, priority: 'urgent', tableNumber: 'IND-02' },
  { id: 'notif-2', title: 'Permintaan Bill Fisik', message: 'Meja OUT-04 meminta tagihan cetak fisik.', category: 'operational', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), isRead: false, priority: 'high', tableNumber: 'OUT-04' },
  { id: 'notif-3', title: 'Penjualan Tiket Event', message: 'Tiket VIP Cupping terjual (TKT-2026-089 - Rudi H).', category: 'tickets', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), isRead: false, priority: 'normal' },
  { id: 'notif-4', title: 'Ulasan Positif Bintang 5', message: 'Maya S: "Espresso Blend Nusantara mantap!"', category: 'feedback', timestamp: new Date(Date.now() - 35 * 60000).toISOString(), isRead: true, priority: 'low' },
  { id: 'notif-5', title: 'Rekonsiliasi Shift Kasir', message: 'Shift Pagi ditutup. Kas fisik Rp 1.450.000 sinkron 100%.', category: 'financial_shifts', timestamp: new Date(Date.now() - 60 * 60000).toISOString(), isRead: true, priority: 'normal' }
]

const INITIAL_SERVICE_TICKETS: ServiceTicket[] = [
  { id: 'srv-101', tableNumber: 'OUT-04', type: 'bill_request', status: 'open', createdAt: new Date(Date.now() - 4 * 60000).toISOString(), notes: 'Minta tagihan cetak fisik' },
  { id: 'srv-102', tableNumber: 'IND-02', type: 'water_refill', status: 'open', createdAt: new Date(Date.now() - 8 * 60000).toISOString(), notes: 'Refill 2 infused water' },
  { id: 'srv-103', tableNumber: 'VIP-01', type: 'sommelier_advice', status: 'resolved', createdAt: new Date(Date.now() - 30 * 60000).toISOString(), resolvedAt: new Date(Date.now() - 18 * 60000).toISOString(), assignedStaffName: 'Budi (Sommelier)', notes: 'Rekomendasi Pinot Noir' }
]

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<HfeNotification[]>(INITIAL_NOTIFICATIONS)
  const [serviceTickets, setServiceTickets] = useState<ServiceTicket[]>(INITIAL_SERVICE_TICKETS)

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications])
  const openServiceTicketsCount = useMemo(() => serviceTickets.filter(t => t.status !== 'resolved').length, [serviceTickets])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }, [])

  const clearAllNotifications = useCallback(() => setNotifications([]), [])

  const addNotification = useCallback((notif: Omit<HfeNotification, 'id' | 'timestamp' | 'isRead'> & { id?: string; timestamp?: string; isRead?: boolean }) => {
    const newNotif: HfeNotification = {
      id: notif.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: notif.timestamp || new Date().toISOString(),
      isRead: notif.isRead ?? false,
      title: notif.title,
      message: notif.message,
      category: notif.category,
      priority: notif.priority || 'normal',
      actionUrl: notif.actionUrl,
      tableNumber: notif.tableNumber,
      metadata: notif.metadata
    }
    setNotifications(prev => [newNotif, ...prev])
  }, [])

  const createServiceTicket = useCallback((ticket: Omit<ServiceTicket, 'id' | 'createdAt' | 'status'> & { id?: string; createdAt?: string; status?: ServiceTicket['status'] }) => {
    const newTicket: ServiceTicket = {
      id: ticket.id || `srv-${Date.now().toString().slice(-4)}`,
      tableNumber: ticket.tableNumber,
      type: ticket.type,
      status: ticket.status || 'open',
      createdAt: ticket.createdAt || new Date().toISOString(),
      notes: ticket.notes,
      assignedStaffName: ticket.assignedStaffName
    }
    setServiceTickets(prev => [newTicket, ...prev])

    const typeLabelMap: Record<ServiceTicket['type'], string> = {
      bill_request: 'Permintaan Cetak Tagihan (Bill)',
      waiter_call: 'Panggilan Pelayan / Waiter',
      water_refill: 'Permintaan Refill Air Minum',
      clean_table: 'Permintaan Pembersihan Meja',
      sommelier_advice: 'Konsultasi Sommelier / Wine Pairing'
    }

    addNotification({
      title: `Panggilan Meja ${ticket.tableNumber}`,
      message: `${typeLabelMap[ticket.type] || ticket.type}${ticket.notes ? ` — ${ticket.notes}` : ''}`,
      category: 'operational',
      priority: ticket.type === 'bill_request' ? 'high' : 'normal',
      tableNumber: ticket.tableNumber
    })

    return newTicket
  }, [addNotification])

  const resolveTicket = useCallback((id: string, staffName: string = 'Staff On Duty') => {
    setServiceTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'resolved' as const, resolvedAt: new Date().toISOString(), assignedStaffName: staffName } : t))
  }, [])

  const updateTicketStatus = useCallback((id: string, status: ServiceTicket['status'], staffName?: string) => {
    setServiceTickets(prev => prev.map(t => t.id === id ? { ...t, status, resolvedAt: status === 'resolved' ? new Date().toISOString() : t.resolvedAt, assignedStaffName: staffName || t.assignedStaffName } : t))
  }, [])

  const deleteTicket = useCallback((id: string) => {
    setServiceTickets(prev => prev.filter(t => t.id !== id))
  }, [])

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    serviceTickets,
    openServiceTicketsCount,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    addNotification,
    createServiceTicket,
    resolveTicket,
    updateTicketStatus,
    deleteTicket
  }), [notifications, unreadCount, serviceTickets, openServiceTicketsCount, markAsRead, markAllAsRead, clearAllNotifications, addNotification, createServiceTicket, resolveTicket, updateTicketStatus, deleteTicket])

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
