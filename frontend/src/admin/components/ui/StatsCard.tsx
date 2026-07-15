import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const SURFACE  = '#111118';
const SURFACE2 = '#1A1A25';
const BORDER   = 'rgba(255,255,255,0.07)';
const TEXT     = '#F1F5F9';
const MUTED    = '#64748B';

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: number;       // % change vs previous period (positive = up)
  trendLabel?: string;
  accentColor?: string; // hex
  loading?: boolean;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendLabel = 'so với hôm qua',
  accentColor = '#6366F1',
  loading = false,
}: StatsCardProps) {
  if (loading) return <StatsCardSkeleton />;

  const trendPositive = trend !== undefined && trend > 0;
  const trendNeutral  = trend === 0 || trend === undefined;
  const trendColor    = trendNeutral ? MUTED : trendPositive ? '#22C55E' : '#EF4444';
  const TrendIcon     = trendNeutral ? Minus : trendPositive ? TrendingUp : TrendingDown;

  return (
    <div
      className="relative rounded-2xl p-5 overflow-hidden transition-all duration-300 cursor-default group"
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = accentColor + '40';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = BORDER;
      }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-10 blur-2xl pointer-events-none transition-opacity duration-300 group-hover:opacity-20"
        style={{ background: accentColor }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium" style={{ color: MUTED }}>{title}</p>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: accentColor + '18', color: accentColor }}
        >
          {icon}
        </div>
      </div>

      {/* Value */}
      <p
        className="text-2xl font-bold mb-1 font-mono"
        style={{ color: TEXT, fontFamily: "'Fira Code', 'Fira Mono', monospace" }}
      >
        {value}
      </p>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs mb-3" style={{ color: MUTED }}>{subtitle}</p>
      )}

      {/* Trend */}
      {trend !== undefined && (
        <div className="flex items-center gap-1">
          <div
            className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: trendColor + '18',
              color: trendColor,
            }}
          >
            <TrendIcon className="w-3 h-3" />
            {Math.abs(trend)}%
          </div>
          <span className="text-xs" style={{ color: MUTED }}>{trendLabel}</span>
        </div>
      )}
    </div>
  );
}

function StatsCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-5 animate-pulse"
      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="h-4 w-28 rounded" style={{ background: SURFACE2 }} />
        <div className="w-9 h-9 rounded-xl" style={{ background: SURFACE2 }} />
      </div>
      <div className="h-8 w-32 rounded mb-2" style={{ background: SURFACE2 }} />
      <div className="h-3 w-24 rounded" style={{ background: SURFACE2 }} />
    </div>
  );
}
