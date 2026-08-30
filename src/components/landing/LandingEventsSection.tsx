import React, { useRef } from 'react'
import { Music, MapPin, Ticket, ChevronLeft, ChevronRight, ArrowRight, CalendarCheck, Sparkles } from 'lucide-react'
import { EventTicketItem } from '../../types/pos'
import { useTranslation } from '../../context/LanguageContext'

interface LandingEventsSectionProps {
  events: EventTicketItem[]
  onSelectEvent: (evt: EventTicketItem) => void
  onViewAllEvents: () => void
  isMobile: boolean
}

export const LandingEventsSection: React.FC<LandingEventsSectionProps> = ({
  events,
  onSelectEvent,
  onViewAllEvents,
  isMobile
}) => {
  const { t, formatPrice } = useTranslation()
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!events || events.length === 0) return null

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -320 : 320
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }

  return (
    <section id="events-section" className={`py-6 sm:py-8 max-w-6xl mx-auto w-full flex flex-col gap-4 border-t border-slate-200 dark:border-slate-800/80 ${
      isMobile ? 'px-4' : 'px-4 sm:px-8'
    }`}>
      {/* SECTION HEADER WITH CLICKABLE TITLE & CONTROLS AT FAR RIGHT */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onViewAllEvents}
          className="group text-left cursor-pointer transition-transform active:scale-98"
        >
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 group-hover:text-purple-400 transition-colors">
            <Music className="w-4 h-4 text-purple-500 dark:text-purple-400 shrink-0" />
            <span>{t.landing.eventsTitle}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all hidden sm:inline-block" />
          </h3>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onViewAllEvents}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 flex items-center gap-1 cursor-pointer"
          >
            <span>Seluruh Event</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {events.length > 2 && (
            <div className="hidden sm:flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-purple-600 hover:text-white transition-all cursor-pointer active:scale-95"
                title="Geser Kiri"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-purple-600 hover:text-white transition-all cursor-pointer active:scale-95"
                title="Geser Kanan"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* HORIZONTAL EVENT SNAP CAROUSEL */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3.5 pb-1 scroll-smooth"
      >
        {events.map((evt) => {
          const isFree = evt.price === 0
          return (
            <div
              key={evt.id}
              className="min-w-[280px] sm:min-w-[340px] max-w-[360px] snap-start shrink-0 bg-white dark:bg-slate-900/90 border border-purple-500/25 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs dark:shadow-xl hover:border-purple-500/50 transition-all"
            >
              {/* EVENT BANNER PHOTO */}
              {evt.bannerUrl && (
                <div className="relative h-32 sm:h-36 w-full bg-slate-950 overflow-hidden shrink-0">
                  <img
                    src={evt.bannerUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[10px] font-bold text-purple-200 bg-purple-900/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-purple-400/40 font-mono uppercase">
                      {evt.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    {!evt.bannerUrl && (
                      <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-500/10 dark:bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30 font-mono uppercase">
                        {evt.category.replace('_', ' ')}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 dark:text-slate-300 font-mono ml-auto">
                      Sisa Kuota: <strong className="text-amber-600 dark:text-amber-400">{evt.quotaRemaining}</strong>/{evt.quotaTotal}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">{evt.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{evt.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-purple-600 dark:text-purple-300 mt-2 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 shrink-0" />
                    <span>{evt.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-300 font-mono block">Akses Masuk:</span>
                    {isFree ? (
                      <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                        Gratis / Free Entry
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400">
                        {formatPrice(evt.price)}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectEvent(evt)}
                    className={`text-xs font-bold px-3.5 py-2 rounded-xl text-white shadow-md flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer ${
                      isFree
                        ? 'bg-emerald-600 hover:bg-emerald-500'
                        : 'bg-purple-600 hover:bg-purple-500'
                    }`}
                  >
                    {isFree ? <CalendarCheck className="w-3.5 h-3.5" /> : <Ticket className="w-3.5 h-3.5" />}
                    <span>{isFree ? 'RSVP Masuk' : evt.category === 'workshop_class' ? 'Booking Kelas' : 'Beli Tiket'}</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
