import { useState } from 'react'
import { Tabs, Popup, Form, Input, Selector, Toast } from 'antd-mobile'
import {
    CheckCircleFill, ExclamationCircleFill, PayCircleOutline,
    RightOutline, AddOutline, PieOutline, FilterOutline,
} from 'antd-mobile-icons'
import { fmt, fmtDate, isOverdue } from '../utils'

function RoundForm({ round, classes, preClassId, onSave, onClose }) {
    const [form] = Form.useForm()
    const handleFinish = (values) => {
        onSave({ ...round, ...values, amount: Number(values.amount) || 0 })
        onClose()
    }
    return (
        <div style={{ paddingBottom: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 12px' }}>
                <button onClick={onClose} style={{ background: 'none', border: 'none', fontFamily: 'inherit', fontSize: '15px', fontWeight: 600, color: '#EF4444', cursor: 'pointer', padding: 0 }}>Hủy</button>
                <span style={{ fontWeight: 700, fontSize: '17px', color: 'var(--c-text)' }}>{round ? 'Sửa Đợt Thu' : 'Tạo Đợt Thu'}</span>
                <button onClick={() => form.submit()} style={{ background: 'none', border: 'none', fontFamily: 'inherit', fontSize: '15px', fontWeight: 700, color: 'var(--c-blue)', cursor: 'pointer', padding: 0 }}>Lưu</button>
            </div>
            <div style={{ height: '0.5px', background: 'var(--c-border)', marginBottom: '4px' }} />
            <Form
                form={form}
                initialValues={round || { name: '', classId: preClassId || (classes[0]?.id || ''), amount: '', dueDate: '', note: '' }}
                onFinish={handleFinish}
                layout="vertical"
                style={{ '--border-inner': '0.5px solid var(--c-border)' }}
            >
                <Form.Item name="name" label="Tên đợt thu" rules={[{ required: true, message: 'Nhập tên đợt thu' }]}>
                    <Input placeholder="Tháng 4/2026" />
                </Form.Item>
                <Form.Item name="classId" label="Lớp học" rules={[{ required: true }]}>
                    <Selector
                        options={classes.map(c => ({ label: c.name, value: c.id }))}
                        onChange={([v]) => v && form.setFieldValue('classId', v)}
                    />
                </Form.Item>
                <Form.Item name="amount" label="Số tiền / học sinh (₫)">
                    <Input type="number" placeholder="800000" />
                </Form.Item>
                <Form.Item name="dueDate" label="Hạn nộp">
                    <Input type="date" />
                </Form.Item>
                <Form.Item name="note" label="Ghi chú">
                    <Input placeholder="Ghi chú..." />
                </Form.Item>
            </Form>
        </div>
    )
}

function RoundCard({ round, cls, stats, accent, isDone, overdue, onEdit, onDelete, onView }) {
    const pct = stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0

    return (
        <div style={{
            background: 'var(--c-surface)',
            borderRadius: '16px',
            border: '1px solid var(--c-border)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
        }}>
            <div onClick={onView} style={{ padding: '16px 16px 14px', cursor: 'pointer' }}>
                {/* Row 1 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                        width: '44px', height: '44px', borderRadius: '13px', flexShrink: 0,
                        background: `${accent}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '22px', color: accent,
                    }}>
                        {isDone ? <CheckCircleFill /> : overdue ? <ExclamationCircleFill /> : <PayCircleOutline />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--c-text)', marginBottom: '2px' }}>{round.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--c-text-3)' }}>
                            {cls?.name}
                            {round.dueDate && <> · Hạn <span style={{ color: overdue && !isDone ? '#EF4444' : 'var(--c-text-3)' }}>{fmtDate(round.dueDate)}</span></>}
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <span style={{
                            fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '100px',
                            background: `${accent}15`, color: accent,
                        }}>
                            {isDone ? 'Thu đủ' : overdue ? 'Quá hạn' : 'Đang thu'}
                        </span>
                        <RightOutline style={{ color: 'var(--c-text-3)', fontSize: '12px' }} />
                    </div>
                </div>

                {/* Row 2 */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                        <div style={{ fontSize: '11px', color: 'var(--c-text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Đã thu</div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--c-text)', letterSpacing: '-0.5px' }}>{fmt(stats.totalCollected)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: 'var(--c-text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Tiến độ</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: accent }}>{pct}%</div>
                    </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: '6px', background: 'var(--c-border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: accent, borderRadius: '3px', transition: 'width 0.4s ease' }} />
                </div>

                {/* Mini stats */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    {[
                        { l: `${stats.paid}/${stats.total} HS`, c: 'var(--c-text-2)', icon: '👥' },
                        { l: `${stats.unpaid} chưa nộp`, c: stats.unpaid > 0 ? '#EF4444' : '#10B981', icon: stats.unpaid > 0 ? '⚠️' : '✅' },
                        { l: fmt(round.amount) + '/HS', c: 'var(--c-text-2)', icon: '💰' },
                    ].map((s, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            background: 'var(--c-bg)', borderRadius: '8px', padding: '5px 8px',
                            flex: 1,
                        }}>
                            <span style={{ fontSize: '12px' }}>{s.icon}</span>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: s.c, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.l}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', borderTop: '1px solid var(--c-border)' }}>
                <button onClick={onEdit} style={{ flex: 1, padding: '11px', border: 'none', background: 'none', fontFamily: 'inherit', fontSize: '13px', fontWeight: 600, color: 'var(--c-text-2)', cursor: 'pointer', borderRight: '1px solid var(--c-border)' }}>Chỉnh sửa</button>
                <button onClick={onDelete} style={{ flex: 1, padding: '11px', border: 'none', background: 'none', fontFamily: 'inherit', fontSize: '13px', fontWeight: 600, color: '#EF4444', cursor: 'pointer', borderRight: '1px solid var(--c-border)' }}>Xóa</button>
                <button onClick={onView} style={{ flex: 1, padding: '11px', border: 'none', background: 'none', fontFamily: 'inherit', fontSize: '13px', fontWeight: 700, color: 'var(--c-blue)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>Xem chi tiết <RightOutline style={{ fontSize: '11px' }} /></button>
            </div>
        </div>
    )
}

export default function PaymentRounds({ store, navigate, params }) {
    const { classes, paymentRounds, getRoundStats, addRound, updateRound, deleteRound } = store
    const preClassId = params?.preClassId || ''
    const [popup, setPopup] = useState(!!preClassId)
    const [editing, setEditing] = useState(null)
    const [filterClass, setFilterClass] = useState(preClassId || 'all')
    const [filterStatus, setFilterStatus] = useState('all')

    const filtered = paymentRounds
        .filter(r => {
            const stats = getRoundStats(r.id)
            const isDone = stats.paid === stats.total && stats.total > 0
            const overdue = isOverdue(r.dueDate)
            return (filterClass === 'all' || r.classId === filterClass) &&
                (filterStatus === 'all'
                    || (filterStatus === 'done' && isDone)
                    || (filterStatus === 'overdue' && overdue && !isDone)
                    || (filterStatus === 'pending' && !isDone && !overdue))
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

    const handleSave = (form) => {
        if (editing) updateRound(editing.id, form); else addRound(form)
        Toast.show({ icon: 'success', content: editing ? 'Đã cập nhật!' : 'Đã tạo đợt thu!' })
    }
    const handleDelete = (r) => {
        if (window.confirm(`Xóa đợt thu "${r.name}"?`)) {
            deleteRound(r.id)
            Toast.show({ icon: 'success', content: 'Đã xóa!' })
        }
    }

    const allStats = paymentRounds.map(r => getRoundStats(r.id))
    const totalDone = allStats.filter(s => s.paid === s.total && s.total > 0).length
    const totalOverdue = paymentRounds.filter(r => {
        const s = getRoundStats(r.id)
        return isOverdue(r.dueDate) && !(s.paid === s.total && s.total > 0)
    }).length

    return (
        <div style={{ paddingBottom: '8px' }}>

            {/* Summary strip */}
            <div style={{ background: 'var(--c-surface)', padding: '12px 20px', borderBottom: '1px solid var(--c-border)', display: 'flex', gap: '16px' }}>
                {[
                    { l: 'Tổng đợt', v: paymentRounds.length, c: 'var(--c-text)' },
                    { l: 'Thu đủ', v: totalDone, c: '#10B981' },
                    { l: 'Quá hạn', v: totalOverdue, c: '#EF4444' },
                ].map(i => (
                    <div key={i.l} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '18px', color: i.c }}>{i.v}</span>
                        <span style={{ fontSize: '12px', color: 'var(--c-text-3)', fontWeight: 500 }}>{i.l}</span>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div style={{ background: 'var(--c-surface)', borderBottom: '1px solid var(--c-border)' }}>
                <Tabs activeKey={filterStatus} onChange={setFilterStatus}
                    style={{ '--active-line-color': 'var(--c-blue)', '--active-title-color': 'var(--c-text)', '--title-font-size': '13px' }}>
                    <Tabs.Tab title="Tất cả" key="all" />
                    <Tabs.Tab title="Đang thu" key="pending" />
                    <Tabs.Tab title="Quá hạn" key="overdue" />
                    <Tabs.Tab title="Đã xong" key="done" />
                </Tabs>
            </div>

            {/* Class filter + Add */}
            <div style={{ padding: '10px 16px', display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--c-surface)', borderBottom: '1px solid var(--c-border)' }}>
                <FilterOutline style={{ color: 'var(--c-text-3)', fontSize: '15px', flexShrink: 0 }} />
                <select
                    value={filterClass}
                    onChange={e => setFilterClass(e.target.value)}
                    style={{
                        flex: 1, padding: '7px 10px', borderRadius: '10px',
                        border: '1px solid var(--c-border)', fontSize: '13px',
                        fontFamily: 'inherit', color: 'var(--c-text)', background: 'var(--c-bg)',
                        outline: 'none', fontWeight: 500, cursor: 'pointer',
                    }}
                >
                    <option value="all">Tất cả lớp</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button
                    onClick={() => { setEditing(null); setPopup(true) }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '8px 16px', borderRadius: '10px', border: 'none',
                        background: 'var(--c-blue)', color: '#fff',
                        fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                        boxShadow: '0 2px 8px rgba(59,130,246,0.25)', whiteSpace: 'nowrap',
                    }}
                >
                    <AddOutline style={{ fontSize: '14px' }} /> Tạo đợt
                </button>
            </div>

            {/* Cards */}
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filtered.map(round => {
                    const cls = classes.find(c => c.id === round.classId)
                    const stats = getRoundStats(round.id)
                    const overdue = isOverdue(round.dueDate)
                    const isDone = stats.paid === stats.total && stats.total > 0
                    const accent = isDone ? '#10B981' : overdue ? '#EF4444' : '#3B82F6'
                    return (
                        <RoundCard
                            key={round.id}
                            round={round} cls={cls} stats={stats} accent={accent} isDone={isDone} overdue={overdue}
                            onEdit={() => { setEditing(round); setPopup(true) }}
                            onDelete={() => handleDelete(round)}
                            onView={() => navigate('round-detail', { roundId: round.id })}
                        />
                    )
                })}

                {filtered.length === 0 && (
                    <div style={{ padding: '48px 20px', textAlign: 'center', background: 'var(--c-surface)', borderRadius: '16px', border: '1px solid var(--c-border)' }}>
                        <PieOutline style={{ fontSize: '36px', color: 'var(--c-text-3)', display: 'block', margin: '0 auto 12px' }} />
                        <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--c-text)', marginBottom: '4px' }}>Không có đợt thu</div>
                        <div style={{ fontSize: '13px', color: 'var(--c-text-3)' }}>
                            {filterStatus !== 'all' ? 'Thay đổi bộ lọc hoặc ' : ''}nhấn "Tạo đợt" để bắt đầu
                        </div>
                    </div>
                )}
            </div>

            <Popup visible={popup} onMaskClick={() => setPopup(false)} position="bottom" bodyStyle={{ borderRadius: '20px 20px 0 0', maxHeight: '92vh', overflowY: 'auto' }} onClose={() => setPopup(false)}>
                <RoundForm round={editing} classes={classes} preClassId={preClassId} onSave={handleSave} onClose={() => setPopup(false)} />
            </Popup>
        </div>
    )
}
