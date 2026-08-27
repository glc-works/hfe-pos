import React from 'react'
import { Badge } from './Badge'
import { useDataTruth, type DataTruthChannel } from '../context/DataTruthContext'
import { useTranslation } from '../context/LanguageContext'

export interface TruthChannelBadgeProps {
  /** Override the ambient channel from useDataTruth() (rare; prefer ambient). */
  channel?: DataTruthChannel
  className?: string
}

const CHANNEL_BADGE_CLASS: Record<DataTruthChannel, string> = {
  'live-core': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  'pending-sync': 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  demo: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
}

/**
 * Orthogonal truth-channel indicator: exactly ONE visual channel declaring
 * where a surface's data comes from (live CORE / pending sync / demo).
 */
export function TruthChannelBadge({ channel, className }: TruthChannelBadgeProps) {
  const { channel: ambientChannel } = useDataTruth()
  const { t } = useTranslation()
  const effective = channel ?? ambientChannel

  const label =
    effective === 'live-core'
      ? t.truth.liveLabel
      : effective === 'pending-sync'
        ? t.truth.pendingLabel
        : t.truth.demoLabel

  return (
    <Badge
      variant="outline"
      className={`text-[10px] font-mono font-bold ${CHANNEL_BADGE_CLASS[effective]} ${className ?? ''}`}
    >
      {effective === 'live-core' ? '' : effective === 'pending-sync' ? '⏳ ' : '🧪 '}
      {label}
    </Badge>
  )
}
