import React from 'react'
import { Flame, Sparkles } from 'lucide-react'
import { fireCourse } from '../../services/hfeApi'

export type CourseStatus = 'Holding' | 'Fired' | 'Plating' | 'Served'

export interface TastingCourse {
  number: number
  name: string
  dishes: string[]
  status: CourseStatus
  firedAt?: string
}

export interface TableCourseOrder {
  id: string
  tableNumber: string
  guestName: string
  menuType: '3-Course' | '5-Course' | '7-Course' | '9-Course'
  currentCourseIndex: number
  courses: TastingCourse[]
}

export interface FineDiningCourseMatrixProps {
  courseOrders: TableCourseOrder[]
  setCourseOrders: React.Dispatch<React.SetStateAction<TableCourseOrder[]>>
}

export const FineDiningCourseMatrix: React.FC<FineDiningCourseMatrixProps> = ({
  courseOrders,
  setCourseOrders
}) => {
  const handleFireNextCourse = async (orderId: string) => {
    const order = courseOrders.find(o => o.id === orderId)
    if (!order) return

    const nextIndex = order.courses.findIndex(c => c.status === 'Holding')
    if (nextIndex < 0) return

    const courseToFire = order.courses[nextIndex]
    await fireCourse(orderId, courseToFire.number, courseToFire.name)

    setCourseOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedCourses = [...o.courses]
        updatedCourses[nextIndex] = {
          ...updatedCourses[nextIndex],
          status: 'Fired',
          firedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        }
        return {
          ...o,
          currentCourseIndex: nextIndex,
          courses: updatedCourses
        }
      }
      return o
    }))
  }

  const handleUpdateCourseStatus = (orderId: string, courseNumber: number, newStatus: CourseStatus) => {
    setCourseOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedCourses = o.courses.map(c => c.number === courseNumber ? { ...c, status: newStatus } : c)
        return { ...o, courses: updatedCourses }
      }
      return o
    }))
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" /> Active Tasting Menu Orders ({courseOrders.length})
        </span>
        <span className="px-2.5 py-0.5 bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-amber-400 rounded-lg">
          Live Course Sync
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {courseOrders.map((order) => {
          const canFireNext = order.courses.some(c => c.status === 'Holding')

          return (
            <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{order.tableNumber}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {order.menuType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Tamu: <span className="text-slate-200 font-semibold">{order.guestName}</span></p>
                </div>
                <button
                  onClick={() => handleFireNextCourse(order.id)}
                  disabled={!canFireNext}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Flame className="w-4 h-4" /> Fire Next Course
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matriks Course Sequence</h3>
                <div className="space-y-2">
                  {order.courses.map((course) => {
                    let badgeStyle = 'bg-slate-950 text-slate-500 border-slate-800'
                    if (course.status === 'Fired') badgeStyle = 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                    if (course.status === 'Plating') badgeStyle = 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    if (course.status === 'Served') badgeStyle = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'

                    return (
                      <div
                        key={course.number}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          course.status === 'Fired' ? 'bg-slate-950 border-rose-500/50' : 'bg-slate-950/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center font-bold">
                            C{course.number}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{course.name}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyle}`}>
                                {course.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">{course.dishes.join(', ')}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {course.status === 'Fired' && (
                            <button
                              onClick={() => handleUpdateCourseStatus(order.id, course.number, 'Plating')}
                              className="px-2.5 py-1 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-[10px] font-bold rounded-lg border border-amber-500/30"
                            >
                              Plating
                            </button>
                          )}
                          {(course.status === 'Fired' || course.status === 'Plating') && (
                            <button
                              onClick={() => handleUpdateCourseStatus(order.id, course.number, 'Served')}
                              className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[10px] font-bold rounded-lg border border-emerald-500/30"
                            >
                              Served
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
