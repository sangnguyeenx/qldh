import { ProgressBar } from 'antd-mobile'
import {
    BillOutline, AppOutline, PayCircleOutline, ClockCircleOutline,
    CheckCircleFill, ExclamationCircleFill, CloseCircleFill, RightOutline,
} from 'antd-mobile-icons'
import { fmt, fmtDate, isOverdue } from '../utils'

const STATS = [
    { key: 'totalClasses', label: 'Lớp học', icon: BillOutline, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
    { key: 'totalStudents', label: 'Học sinh', icon: AppOutline, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    { key: 'totalUnpaid', label: 'Còn nợ', icon: ClockCircleOutline, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
]

export default function Dashboard({ store, navigate }) {
    const { classes, students, paymentRounds, payments, dashboardStats, getRoundStats } = store

    const recentRounds = [...paymentRounds]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 6)

    const latestRound = recentRounds[0]
    const unpaidList = latestRound
        ? payments
            .filter(p => p.roundId === latestRound.id && p.status === 'unpaid')
            .map(p => ({ p, stu: students.find(s => s.id === p.studentId) }))
            .filter(r => r.stu)
        : []

    return (
        <div style={{ paddingTop: '16px', paddingBottom: '8px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* ── Stats block ── */}
            <div style={{ padding: '0 16px' }}>
                <div style={{
                    background: 'var(--c-surface)', borderRadius: '16px',
                    border: '1px solid var(--c-border)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'grid', gridTemplateColumns: '1fr 1fr 2fr',
                    overflow: 'hidden',
                }}>
                    {STATS.map(({ key, label, icon: Icon, color, bg }, i) => (
                        <div key={key} style={{
                            padding: '16px 8px 14px',
                            borderRight: i < STATS.length - 1 ? '1px solid var(--c-border)' : 'none',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                        }}>
                            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', color }}>
                                <Icon />
                            </div>
                            <div style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--c-text)', lineHeight: 1 }}>
                                {key === 'totalUnpaid' ? fmt(dashboardStats[key]) : dashboardStats[key]}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--c-text-3)', fontWeight: 600 }}>{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Recent rounds ── */}
            <div>
                <div className="section-label">Đợt thu gần nhất</div>
                <div style={{ margin: '0 16px', background: 'var(--c-surface)', borderRadius: '14px', border: '1px solid var(--c-border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                    {recentRounds.map((round, idx) => {
                        const cls = classes.find(c => c.id === round.classId)
                        const stats = getRoundStats(round.id)
                        const pct = stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0
                        const overdue = isOverdue(round.dueDate)
                        const isDone = pct === 100 && stats.total > 0
                        const accent = isDone ? '#10B981' : overdue ? '#EF4444' : '#3B82F6'
                        return (
                            <div
                                key={round.id}
                                onClick={() => navigate('round-detail', { roundId: round.id })}
                                style={{
                                    padding: '14px 16px',
                                    borderBottom: idx < recentRounds.length - 1 ? '1px solid var(--c-border)' : 'none',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                                    transition: 'background 0.12s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--c-bg)'}
                                onMouseLeave={e => e.currentTarget.style.background = ''}
                                onTouchStart={e => e.currentTarget.style.background = 'var(--c-bg)'}
                                onTouchEnd={e => e.currentTarget.style.background = ''}
                            >
                                <div style={{ width: '38px', height: '38px', borderRadius: '11px', flexShrink: 0, background: `${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '19px', color: accent }}>
                                    {isDone ? <CheckCircleFill /> : overdue ? <ExclamationCircleFill /> : <PayCircleOutline />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--c-text)' }}>{round.name}</span>
                                        <span style={{ fontWeight: 700, fontSize: '13px', color: '#10B981' }}>{fmt(stats.totalCollected)}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--c-text-3)', marginBottom: '6px', fontWeight: 400 }}>
                                        {cls?.name} · {stats.paid}/{stats.total} học sinh
                                        {overdue && !isDone && <span style={{ color: '#EF4444', marginLeft: '4px' }}>· Quá hạn</span>}
                                    </div>
                                    <ProgressBar percent={pct} style={{ '--fill-color': accent, '--track-color': 'var(--c-border)', '--track-width': '4px' }} />
                                </div>
                                <RightOutline style={{ color: 'var(--c-text-3)', fontSize: '13px', flexShrink: 0 }} />
                            </div>
                        )
                    })}
                    {recentRounds.length === 0 && (
                        <div style={{ padding: '36px', textAlign: 'center', color: 'var(--c-text-3)' }}>
                            <PayCircleOutline style={{ fontSize: '32px', display: 'block', margin: '0 auto 8px' }} />
                            <div style={{ fontWeight: 600, fontSize: '14px' }}>Chưa có đợt thu</div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Unpaid students ── */}
            {unpaidList.length > 0 && (
                <div>
                    <div className="section-label">Chưa đóng — {latestRound?.name}</div>
                    <div style={{ margin: '0 16px', background: 'var(--c-surface)', borderRadius: '14px', border: '1px solid rgba(239,68,68,0.15)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                        {unpaidList.slice(0, 5).map(({ stu: s }, idx) => {
                            const cls = classes.find(c => c.id === s?.classId)
                            return (
                                <div key={s.id} style={{ padding: '11px 16px', borderBottom: idx < Math.min(unpaidList.length, 5) - 1 ? '1px solid var(--c-border)' : 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', color: '#EF4444' }}>
                                        {s.name.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--c-text)' }}>{s.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--c-text-3)' }}>{cls?.name}</div>
                                    </div>
                                    <CloseCircleFill style={{ color: '#EF4444', fontSize: '16px' }} />
                                </div>
                            )
                        })}
                        {unpaidList.length > 5 && (
                            <div style={{ padding: '10px 16px', textAlign: 'center', fontSize: '12px', color: 'var(--c-text-3)', background: 'var(--c-bg)' }}>
                                và {unpaidList.length - 5} học sinh khác...
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── All paid banner ── */}
            {unpaidList.length === 0 && latestRound && (
                <div style={{ margin: '0 16px' }}>
                    <div style={{ background: 'rgba(16,185,129,0.08)', borderRadius: '14px', padding: '20px', textAlign: 'center', border: '1px solid rgba(16,185,129,0.18)' }}>
                        <CheckCircleFill style={{ color: '#10B981', fontSize: '28px' }} />
                        <div style={{ fontWeight: 700, fontSize: '15px', color: '#10B981', marginTop: '8px' }}>Tất cả đã đóng tiền! 🎉</div>
                        <div style={{ fontSize: '12px', color: 'rgba(16,185,129,0.7)', marginTop: '3px' }}>{latestRound.name}</div>
                    </div>
                </div>
            )}

            <div style={{ height: '4px' }} />
        </div>
    )
}
