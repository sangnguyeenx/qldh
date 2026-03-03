import { useState } from 'react'
import { Tabs, Button, ProgressBar, Popup, Form, Input, Selector, Toast } from 'antd-mobile'
import { RightOutline, AddOutline } from 'antd-mobile-icons'
import { fmt, fmtDate, today } from '../utils'

const LEVEL_STYLE = {
    'Lớp 1': { color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
    'Lớp 2': { color: '#34D399', bg: 'rgba(52,211,153,0.12)' },
    'Lớp 3': { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
    'Lớp 4': { color: '#60A5FA', bg: 'rgba(96,165,250,0.12)' },
    'Lớp 5': { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
    'Lớp 6': { color: '#FB923C', bg: 'rgba(251,146,60,0.12)' },
    'Lớp 7': { color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
    'Lớp 8': { color: '#EC4899', bg: 'rgba(236,72,153,0.12)' },
    'Lớp 9': { color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
}

function StudentForm({ student, classId, onSave, onClose }) {
    const [form] = Form.useForm()
    const handleFinish = (values) => { onSave({ ...student, classId, ...values }); onClose() }
    return (
        <div style={{ paddingBottom: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 12px' }}>
                <Button fill="none" color="danger" onClick={onClose} style={{ padding: 0, fontWeight: 600 }}>Hủy</Button>
                <span style={{ fontWeight: 700, fontSize: '17px', color: 'var(--c-text)' }}>{student ? 'Sửa Học Sinh' : 'Thêm Học Sinh'}</span>
                <Button fill="none" color="primary" onClick={() => form.submit()} style={{ padding: 0, fontWeight: 700 }}>Lưu</Button>
            </div>
            <div style={{ height: '0.5px', background: 'var(--c-border)', marginBottom: '4px' }} />
            <Form form={form} initialValues={student || { name: '', phone: '', parentPhone: '', joinDate: today(), note: '', status: 'active' }} onFinish={handleFinish} layout="vertical" style={{ '--border-inner': '0.5px solid var(--c-border)' }}>
                <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}><Input placeholder="Nguyễn Thị Mai" /></Form.Item>
                <Form.Item name="phone" label="SĐT học sinh"><Input placeholder="090xxxxxxx" type="tel" /></Form.Item>
                <Form.Item name="parentPhone" label="SĐT phụ huynh"><Input placeholder="090xxxxxxx" type="tel" /></Form.Item>
                <Form.Item name="joinDate" label="Ngày nhập học"><Input type="date" /></Form.Item>
                <Form.Item name="status" label="Trạng thái">
                    <Selector options={[{ label: '✓ Đang học', value: 'active' }, { label: '✗ Đã nghỉ', value: 'dropped' }]} onChange={([v]) => v && form.setFieldValue('status', v)} />
                </Form.Item>
                <Form.Item name="note" label="Ghi chú"><Input placeholder="Ghi chú nếu có..." /></Form.Item>
            </Form>
        </div>
    )
}

export default function ClassDetail({ store, navigate, params }) {
    const { classId } = params
    const { classes, getStudentsByClass, getRoundsByClass, getRoundStats, addStudent, updateStudent, deleteStudent } = store
    const cls = classes.find(c => c.id === classId)
    const students = getStudentsByClass(classId)
    const rounds = getRoundsByClass(classId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const [popup, setPopup] = useState(false)
    const [editing, setEditing] = useState(null)

    if (!cls) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--c-text-3)' }}>Không tìm thấy lớp.</div>

    const activeStudents = students.filter(s => s.status === 'active')
    const ls = LEVEL_STYLE[cls.level] || { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' }

    const handleSave = (form) => {
        if (editing) updateStudent(editing.id, form); else addStudent({ ...form, classId })
        Toast.show({ icon: 'success', content: 'Đã lưu!' })
    }
    const handleDelete = (s) => {
        if (window.confirm(`Xóa "${s.name}"?`)) { deleteStudent(s.id); Toast.show({ icon: 'success', content: 'Đã xóa!' }) }
    }

    return (
        <div style={{ paddingBottom: '8px' }}>
            {/* Hero */}
            <div style={{ background: 'var(--c-surface)', padding: '16px 20px 20px', borderBottom: '1px solid var(--c-border)' }}>
                <div style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px', color: 'var(--c-text)', marginBottom: '8px' }}>{cls.name}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', background: ls.bg, color: ls.color }}>{cls.level}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: cls.status === 'active' ? 'rgba(16,185,129,0.1)' : 'var(--c-bg)', color: cls.status === 'active' ? '#10B981' : 'var(--c-text-3)' }}>
                        {cls.status === 'active' ? 'Đang dạy' : 'Đã đóng'}
                    </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                        { l: 'Học phí', v: fmt(cls.monthlyFee) + '/buổi' },
                        { l: 'Học sinh', v: `${activeStudents.length} đang học` },
                        { l: 'Lịch học', v: cls.schedule || '—' },
                        { l: 'Phòng học', v: cls.room || '—' },
                    ].map(i => (
                        <div key={i.l} style={{ background: 'var(--c-bg)', borderRadius: '10px', padding: '10px 12px', border: '1px solid var(--c-border)' }}>
                            <div style={{ fontSize: '11px', color: 'var(--c-text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>{i.l}</div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--c-text)' }}>{i.v}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultActiveKey="students" style={{ '--active-line-color': 'var(--c-blue)', '--active-title-color': 'var(--c-text)' }}>
                <Tabs.Tab title={`Học sinh (${activeStudents.length})`} key="students">
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => { setEditing(null); setPopup(true) }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 14px',
                                    borderRadius: '100px', border: 'none', cursor: 'pointer',
                                    background: 'var(--c-blue)', color: '#fff', fontSize: '13px', fontWeight: 700,
                                    fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                                }}
                            >
                                <AddOutline /> Thêm học sinh
                            </button>
                        </div>
                        <div style={{ background: 'var(--c-surface)', borderRadius: '14px', border: '1px solid var(--c-border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                            {students.map((s, i) => (
                                <div key={s.id} style={{ padding: '12px 16px', borderBottom: i < students.length - 1 ? '1px solid var(--c-border)' : 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, background: s.status === 'active' ? 'rgba(59,130,246,0.12)' : 'var(--c-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '15px', color: s.status === 'active' ? 'var(--c-blue)' : 'var(--c-text-3)' }}>
                                        {s.name.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--c-text)' }}>{s.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--c-text-3)' }}>{s.phone || 'Chưa có SĐT'}{s.status === 'dropped' ? ' · Đã nghỉ' : ''}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button onClick={() => { setEditing(s); setPopup(true) }} style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--c-border)', background: 'var(--c-bg)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--c-text-2)', fontFamily: 'inherit' }}>Sửa</button>
                                        <button onClick={() => handleDelete(s)} style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#EF4444', fontFamily: 'inherit' }}>Xóa</button>
                                    </div>
                                </div>
                            ))}
                            {students.length === 0 && <div style={{ padding: '28px', textAlign: 'center', color: 'var(--c-text-3)', fontSize: '14px' }}>Chưa có học sinh</div>}
                        </div>
                    </div>
                </Tabs.Tab>

                <Tabs.Tab title={`Đợt thu (${rounds.length})`} key="rounds">
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => navigate('payment-rounds', { preClassId: classId })}
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 14px', borderRadius: '100px', border: 'none', cursor: 'pointer', background: '#10B981', color: '#fff', fontSize: '13px', fontWeight: 700, fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(16,185,129,0.3)' }}
                            >
                                <AddOutline /> Tạo đợt thu
                            </button>
                        </div>
                        <div style={{ background: 'var(--c-surface)', borderRadius: '14px', border: '1px solid var(--c-border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                            {rounds.map((r, i) => {
                                const stats = getRoundStats(r.id)
                                const pct = stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0
                                return (
                                    <div key={r.id} onClick={() => navigate('round-detail', { roundId: r.id })} style={{ padding: '13px 16px', borderBottom: i < rounds.length - 1 ? '1px solid var(--c-border)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background 0.12s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--c-bg)'}
                                        onMouseLeave={e => e.currentTarget.style.background = ''}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--c-text)' }}>{r.name}</span>
                                                <span style={{ fontWeight: 700, fontSize: '13px', color: '#10B981' }}>{fmt(stats.totalCollected)}</span>
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--c-text-3)', marginBottom: '6px' }}>{stats.paid}/{stats.total} học sinh</div>
                                            <ProgressBar percent={pct} style={{ '--fill-color': pct === 100 ? '#10B981' : 'var(--c-blue)', '--track-color': 'var(--c-border)', '--track-width': '4px' }} />
                                        </div>
                                        <RightOutline style={{ color: 'var(--c-text-3)', fontSize: '13px' }} />
                                    </div>
                                )
                            })}
                            {rounds.length === 0 && <div style={{ padding: '28px', textAlign: 'center', color: 'var(--c-text-3)', fontSize: '14px' }}>Chưa có đợt thu</div>}
                        </div>
                    </div>
                </Tabs.Tab>
            </Tabs>

            <Popup visible={popup} onMaskClick={() => setPopup(false)} position="bottom" bodyStyle={{ borderRadius: '20px 20px 0 0', maxHeight: '92vh', overflowY: 'auto' }} onClose={() => setPopup(false)}>
                <StudentForm student={editing} classId={classId} onSave={handleSave} onClose={() => setPopup(false)} />
            </Popup>
        </div>
    )
}
