import { useState } from 'react'
import { Grid, Button, ProgressBar, Popup, Form, Input, Selector, Toast } from 'antd-mobile'
import { CheckCircleFill, ExclamationCircleFill, PayCircleOutline, BankcardOutline } from 'antd-mobile-icons'
import { fmt, fmtDate, today, isOverdue } from '../utils'

const STATUS = {
    paid: { label: 'Đã đóng', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
    partial: { label: 'Đóng thiếu', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
    unpaid: { label: 'Chưa đóng', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
}

function PaymentForm({ student, round, existing, onSave, onClose }) {
    const [form] = Form.useForm()
    const defaultPaid = (existing?.paidAmount > 0) ? existing.paidAmount : round.amount

    const handleFinish = (values) => {
        const paidAmount = Number(values.paidAmount) || 0
        const requiredAmount = Number(values.requiredAmount) || round.amount
        const statusArr = values.status
        const status = Array.isArray(statusArr) && statusArr[0]
            ? statusArr[0]
            : paidAmount >= requiredAmount ? 'paid' : paidAmount > 0 ? 'partial' : 'unpaid'
        onSave({ ...values, paidAmount, requiredAmount, status })
        onClose()
    }

    return (
        <div style={{ paddingBottom: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 12px' }}>
                <Button fill="none" color="danger" onClick={onClose} style={{ padding: 0, fontWeight: 600 }}>Hủy</Button>
                <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--c-text)', textAlign: 'center' }}>
                    Thu tiền · {student.name}
                </span>
                <Button fill="none" color="primary" onClick={() => form.submit()} style={{ padding: 0, fontWeight: 700 }}>Lưu</Button>
            </div>
            <div style={{ height: '0.5px', background: 'var(--c-border)' }} />

            <Form
                form={form}
                initialValues={{
                    requiredAmount: existing?.requiredAmount || round.amount,
                    paidAmount: defaultPaid,
                    paidDate: existing?.paidDate || today(),
                    method: existing?.method || 'cash',
                    note: existing?.note || '',
                    status: [existing?.status || 'paid'],
                }}
                onFinish={handleFinish}
                layout="vertical"
                style={{ '--border-inner': '0.5px solid var(--c-border)' }}
            >
                <Form.Item name="requiredAmount" label="Cần đóng (₫)">
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="paidAmount" label="Số tiền đã đóng (₫)"><Input type="number" /></Form.Item>
                <Form.Item name="paidDate" label="Ngày đóng"><Input type="date" /></Form.Item>
                <Form.Item name="method" label="Phương thức">
                    <Selector options={[{ label: '💵 Tiền mặt', value: 'cash' }, { label: '🏦 Chuyển khoản', value: 'transfer' }]} onChange={([v]) => v && form.setFieldValue('method', v)} />
                </Form.Item>
                <Form.Item name="status" label="Trạng thái">
                    <Selector options={[
                        { label: '✅ Đã đóng đủ', value: 'paid' },
                        { label: '⚠️ Đóng thiếu', value: 'partial' },
                        { label: '❌ Chưa đóng', value: 'unpaid' },
                    ]} />
                </Form.Item>
                <Form.Item name="note" label="Ghi chú"><Input placeholder="Ghi chú..." /></Form.Item>
            </Form>
        </div>
    )
}

export default function RoundDetail({ store, navigate, params }) {
    const { roundId } = params
    const { paymentRounds, classes, students, payments, getPaymentsByRound, getRoundStats, recordPayment, deleteRound } = store
    const round = paymentRounds.find(r => r.id === roundId)
    const cls = round ? classes.find(c => c.id === round.classId) : null
    const roundPayments = getPaymentsByRound(roundId)
    const [payingStudent, setPayingStudent] = useState(null)
    const [filterStatus, setFilterStatus] = useState('all')

    if (!round) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--c-text-3)' }}>Không tìm thấy đợt thu.</div>

    const stats = getRoundStats(roundId)
    const pct = stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0
    const overdue = isOverdue(round.dueDate)
    const isDone = pct === 100 && stats.total > 0
    const accent = isDone ? '#10B981' : overdue ? '#EF4444' : '#3B82F6'

    const rows = roundPayments
        .map(p => ({ payment: p, student: students.find(s => s.id === p.studentId) }))
        .filter(r => r.student && (filterStatus === 'all' || r.payment.status === filterStatus))

    const handleSave = (form) => {
        recordPayment(roundId, payingStudent.payment.studentId, form)
        setPayingStudent(null)
        Toast.show({ icon: 'success', content: 'Đã lưu!' })
    }
    const handleDeleteRound = () => {
        if (window.confirm(`Xóa đợt thu "${round.name}"?`)) { deleteRound(roundId); navigate('payment-rounds') }
    }

    const FILTER_PILLS = [
        { v: 'all', l: `Tất cả (${stats.total})` },
        { v: 'paid', l: `Đã đóng (${stats.paid})` },
        { v: 'partial', l: `Thiếu (${stats.partial})` },
        { v: 'unpaid', l: `Chưa (${stats.unpaid})` },
    ]

    return (
        <div style={{ paddingBottom: '8px' }}>
            {/* Hero */}
            <div style={{ background: 'var(--c-surface)', padding: '16px 20px 20px', borderBottom: '1px solid var(--c-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px', color: 'var(--c-text)' }}>{round.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--c-text-3)', marginTop: '3px' }}>
                            {cls?.name} · Hạn {fmtDate(round.dueDate)} · {fmt(round.amount)}/HS
                        </div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px', background: `${accent}15`, color: accent, flexShrink: 0, marginTop: '2px' }}>
                        {isDone ? 'Thu đủ' : overdue ? 'Quá hạn' : 'Đang thu'}
                    </span>
                </div>

                {/* KPIs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '7px', marginBottom: '14px' }}>
                    {[
                        { l: 'Tổng', v: stats.total, c: 'var(--c-text)' },
                        { l: 'Đã đóng', v: stats.paid, c: '#10B981' },
                        { l: 'Thiếu', v: stats.partial, c: '#F59E0B' },
                        { l: 'Chưa', v: stats.unpaid, c: '#EF4444' },
                    ].map(i => (
                        <div key={i.l} style={{ background: 'var(--c-bg)', borderRadius: '10px', padding: '8px', textAlign: 'center', border: '1px solid var(--c-border)' }}>
                            <div style={{ fontSize: '11px', color: 'var(--c-text-3)', fontWeight: 600, marginBottom: '3px' }}>{i.l}</div>
                            <div style={{ fontSize: '20px', fontWeight: 800, color: i.c }}>{i.v}</div>
                        </div>
                    ))}
                </div>

                {/* Finance */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7px', marginBottom: '14px' }}>
                    {[
                        { l: 'Đã thu', v: fmt(stats.totalCollected), c: '#10B981' },
                        { l: 'Cần thu', v: fmt(stats.totalExpected), c: 'var(--c-text)' },
                        { l: 'Còn thiếu', v: fmt(stats.totalExpected - stats.totalCollected), c: '#EF4444' },
                    ].map(i => (
                        <div key={i.l} style={{ background: 'var(--c-bg)', borderRadius: '10px', padding: '10px', textAlign: 'center', border: '1px solid var(--c-border)' }}>
                            <div style={{ fontSize: '11px', color: 'var(--c-text-3)', fontWeight: 600, marginBottom: '3px' }}>{i.l}</div>
                            <div style={{ fontSize: '13px', fontWeight: 800, color: i.c }}>{i.v}</div>
                        </div>
                    ))}
                </div>

                {/* Progress */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--c-text-3)', fontWeight: 600, marginBottom: '6px' }}>
                        <span>Tiến độ</span>
                        <span style={{ color: 'var(--c-text)' }}>{pct}%</span>
                    </div>
                    <ProgressBar percent={pct} style={{ '--fill-color': accent, '--track-color': 'var(--c-border)', '--track-width': '8px' }} />
                </div>
            </div>

            {/* Filter pills */}
            <div style={{ padding: '12px 16px', display: 'flex', gap: '7px', flexWrap: 'wrap', alignItems: 'center', background: 'var(--c-surface)', borderBottom: '1px solid var(--c-border)' }}>
                {FILTER_PILLS.map(({ v, l }) => (
                    <button
                        key={v}
                        onClick={() => setFilterStatus(v)}
                        style={{
                            padding: '5px 12px', borderRadius: '100px', cursor: 'pointer', fontFamily: 'inherit',
                            border: filterStatus === v ? 'none' : '1px solid var(--c-border)',
                            background: filterStatus === v ? 'var(--c-blue)' : 'var(--c-surface)',
                            color: filterStatus === v ? '#fff' : 'var(--c-text-2)',
                            fontSize: '12px', fontWeight: 600, transition: 'all 0.12s',
                        }}
                    >{l}</button>
                ))}
            </div>

            {/* Student list */}
            <div style={{ background: 'var(--c-surface)', margin: '12px 16px', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--c-border)', boxShadow: 'var(--shadow-sm)' }}>
                {rows.map(({ payment: p, student: s }, i) => {
                    const st = STATUS[p.status] || STATUS.unpaid
                    const required = p.requiredAmount || round.amount
                    const deficit = required - (p.paidAmount || 0)
                    return (
                        <div key={p.id} style={{
                            padding: '13px 16px',
                            borderBottom: i < rows.length - 1 ? '1px solid var(--c-border)' : 'none',
                            display: 'flex', alignItems: 'center', gap: '12px',
                            borderLeft: `3px solid ${st.color}`,
                        }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0, background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '15px', color: st.color }}>
                                {s.name.charAt(0)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                                    <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--c-text)' }}>{s.name}</span>
                                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '100px', background: st.bg, color: st.color }}>{st.label}</span>
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--c-text-3)' }}>
                                    Cần {fmt(required)}
                                    {p.paidAmount > 0 && <> · Đã <span style={{ color: '#10B981', fontWeight: 700 }}>{fmt(p.paidAmount)}</span></>}
                                    {deficit > 0 && <> · Thiếu <span style={{ color: '#EF4444', fontWeight: 700 }}>{fmt(deficit)}</span></>}
                                </div>
                                {p.paidDate && (
                                    <div style={{ fontSize: '11px', color: 'var(--c-text-3)', marginTop: '1px' }}>
                                        {fmtDate(p.paidDate)} · {p.method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setPayingStudent({ payment: p, student: s })}
                                style={{
                                    flexShrink: 0, padding: '6px 12px', borderRadius: '8px', fontFamily: 'inherit',
                                    border: p.status === 'paid' ? '1px solid var(--c-border)' : 'none',
                                    background: p.status === 'paid' ? 'var(--c-bg)' : 'var(--c-blue)',
                                    color: p.status === 'paid' ? 'var(--c-text-2)' : '#fff',
                                    fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                                    boxShadow: p.status !== 'paid' ? '0 2px 6px rgba(59,130,246,0.3)' : 'none',
                                }}
                            >
                                {p.status === 'paid' ? 'Sửa' : 'Thu tiền'}
                            </button>
                        </div>
                    )
                })}
                {rows.length === 0 && <div style={{ padding: '28px', textAlign: 'center', color: 'var(--c-text-3)', fontSize: '14px' }}>Không có học sinh</div>}

                {rows.length > 0 && (
                    <div style={{ padding: '12px 16px', background: 'var(--c-bg)', borderTop: '1px solid var(--c-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--c-text-3)' }}>{rows.length} học sinh</span>
                        <div style={{ fontSize: '13px' }}>
                            <span style={{ color: '#10B981', fontWeight: 800 }}>{fmt(rows.reduce((s, r) => s + (r.payment.paidAmount || 0), 0))}</span>
                            <span style={{ color: 'var(--c-text-3)' }}> / {fmt(rows.reduce((s, r) => s + (r.payment.requiredAmount || round.amount), 0))}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete */}
            <div style={{ padding: '4px 16px 12px' }}>
                <button
                    onClick={handleDeleteRound}
                    style={{
                        width: '100%', padding: '13px', borderRadius: '12px',
                        border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)',
                        color: '#EF4444', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    }}
                >
                    Xóa đợt thu này
                </button>
            </div>

            {/* Payment popup */}
            <Popup visible={!!payingStudent} onMaskClick={() => setPayingStudent(null)} position="bottom" bodyStyle={{ borderRadius: '20px 20px 0 0', maxHeight: '92vh', overflowY: 'auto' }} onClose={() => setPayingStudent(null)}>
                {payingStudent && <PaymentForm student={payingStudent.student} round={round} existing={payingStudent.payment} onSave={handleSave} onClose={() => setPayingStudent(null)} />}
            </Popup>
        </div>
    )
}
