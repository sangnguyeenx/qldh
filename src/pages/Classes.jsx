import { useState } from 'react'
import { Button, SearchBar, Popup, Form, Input, Selector, Toast } from 'antd-mobile'
import { RightOutline, AddOutline } from 'antd-mobile-icons'
import { fmt } from '../utils'

const LEVELS = ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9']

const LEVEL_STYLE = {
    'Lớp 1': { color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    'Lớp 2': { color: '#34D399', bg: 'rgba(52,211,153,0.1)' },
    'Lớp 3': { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
    'Lớp 4': { color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
    'Lớp 5': { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    'Lớp 6': { color: '#FB923C', bg: 'rgba(251,146,60,0.1)' },
    'Lớp 7': { color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
    'Lớp 8': { color: '#EC4899', bg: 'rgba(236,72,153,0.1)' },
    'Lớp 9': { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
}

function ClassForm({ cls, onSave, onClose }) {
    const [form] = Form.useForm()
    const handleFinish = (values) => {
        onSave({ ...cls, ...values, monthlyFee: Number(values.monthlyFee) || 0 }); onClose()
    }
    return (
        <div style={{ paddingBottom: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 12px' }}>
                <Button fill="none" color="danger" onClick={onClose} style={{ padding: '0', fontWeight: 600 }}>Hủy</Button>
                <span style={{ fontWeight: 700, fontSize: '17px', color: '#1A1A2E' }}>{cls ? 'Sửa Lớp Học' : 'Thêm Lớp Học'}</span>
                <Button fill="none" color="primary" onClick={() => form.submit()} style={{ padding: '0', fontWeight: 700 }}>Lưu</Button>
            </div>
            <div style={{ height: '0.5px', background: 'rgba(0,0,0,0.08)', marginBottom: '4px' }} />
            <Form
                form={form}
                initialValues={cls || { name: '', level: 'Lớp 1', schedule: '', monthlyFee: '', room: '', status: 'active' }}
                onFinish={handleFinish}
                layout="vertical"
                style={{ '--border-inner': '0.5px solid rgba(0,0,0,0.07)', '--border-top': 'none', '--border-bottom': 'none' }}
            >
                <Form.Item name="name" label="Tên lớp" rules={[{ required: true, message: 'Nhập tên lớp' }]}>
                    <Input placeholder="VD: Lớp Beginner A" />
                </Form.Item>
                <Form.Item name="level" label="Lớp / Trình độ">
                    <Selector columns={3} options={LEVELS.map(l => ({ label: l, value: l }))} onChange={([v]) => v && form.setFieldValue('level', v)} />
                </Form.Item>
                <Form.Item name="schedule" label="Lịch học">
                    <Input placeholder="Thứ 2, 4, 6 · 17:30" />
                </Form.Item>
                <Form.Item name="monthlyFee" label="Học phí / buổi (₫)">
                    <Input type="number" placeholder="800000" />
                </Form.Item>
                <Form.Item name="room" label="Phòng học">
                    <Input placeholder="Phòng 101" />
                </Form.Item>
                <Form.Item name="status" label="Trạng thái">
                    <Selector options={[{ label: '✓ Đang dạy', value: 'active' }, { label: '✗ Đã đóng', value: 'closed' }]} onChange={([v]) => v && form.setFieldValue('status', v)} />
                </Form.Item>
            </Form>
        </div>
    )
}

const FILTERS = [['all', 'Tất cả'], ['active', 'Đang dạy'], ['closed', 'Đã đóng']]

export default function Classes({ store, navigate }) {
    const { classes, getStudentsByClass, addClass, updateClass, deleteClass } = store
    const [popup, setPopup] = useState(false)
    const [editing, setEditing] = useState(null)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')

    const filtered = classes.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) &&
        (filter === 'all' || c.status === filter)
    )

    const handleSave = (form) => {
        if (editing) updateClass(editing.id, form); else addClass(form)
        Toast.show({ icon: 'success', content: editing ? 'Đã cập nhật!' : 'Đã thêm lớp!' })
    }
    const handleDelete = (cls) => {
        if (window.confirm(`Xóa lớp "${cls.name}"?\nToàn bộ dữ liệu lớp sẽ bị xóa.`)) {
            deleteClass(cls.id)
            Toast.show({ icon: 'success', content: 'Đã xóa!' })
        }
    }

    return (
        <div style={{ paddingTop: '12px', paddingBottom: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Search */}
            <div style={{ padding: '0 16px' }}>
                <SearchBar
                    placeholder="Tìm tên lớp..."
                    value={search}
                    onChange={setSearch}
                    style={{ '--border-radius': '12px', '--background': '#fff', '--border-inner': 'none' }}
                />
            </div>

            {/* Filters row */}
            <div style={{ display: 'flex', gap: '8px', padding: '0 16px', alignItems: 'center' }}>
                {FILTERS.map(([v, l]) => (
                    <button
                        key={v}
                        onClick={() => setFilter(v)}
                        style={{
                            padding: '6px 14px', borderRadius: '100px',
                            border: filter === v ? 'none' : '1px solid rgba(0,0,0,0.12)',
                            background: filter === v ? '#3B82F6' : '#fff',
                            color: filter === v ? '#fff' : '#6B7280',
                            fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                            transition: 'all 0.15s',
                        }}
                    >{l}</button>
                ))}
                <div style={{ flex: 1 }} />
                <button
                    onClick={() => { setEditing(null); setPopup(true) }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '7px 14px', borderRadius: '100px', border: 'none',
                        background: '#3B82F6', color: '#fff',
                        fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                        boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                    }}
                >
                    <AddOutline /> Thêm lớp
                </button>
            </div>

            {/* Section label */}
            <div className="section-label" style={{ marginBottom: 0 }}>
                {filtered.length} lớp học
            </div>

            {/* Class list */}
            <div style={{ margin: '0 16px', background: '#fff', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                {filtered.map((cls, idx) => {
                    const active = getStudentsByClass(cls.id).filter(s => s.status === 'active').length
                    const ls = LEVEL_STYLE[cls.level] || LEVEL_STYLE['Lớp 1']
                    return (
                        <div
                            key={cls.id}
                            onClick={() => navigate('class-detail', { classId: cls.id })}
                            style={{
                                padding: '14px 16px',
                                borderBottom: idx < filtered.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '13px',
                                opacity: cls.status === 'closed' ? 0.55 : 1,
                                transition: 'background 0.12s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                            onMouseLeave={e => e.currentTarget.style.background = ''}
                            onTouchStart={e => e.currentTarget.style.background = '#F5F5F7'}
                            onTouchEnd={e => e.currentTarget.style.background = ''}
                        >
                            {/* Avatar */}
                            <div style={{
                                width: '46px', height: '46px', borderRadius: '13px', flexShrink: 0,
                                background: ls.bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 800, fontSize: '17px', color: ls.color,
                            }}>
                                {cls.level.charAt(0)}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: '15px', color: '#1A1A2E', marginBottom: '3px' }}>{cls.name}</div>
                                <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 400, marginBottom: '4px' }}>
                                    {active} học sinh · {fmt(cls.monthlyFee)}/buổi
                                    {cls.schedule && ` · ${cls.schedule}`}
                                </div>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: `${ls.bg}`, borderRadius: '6px', padding: '2px 8px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: ls.color }}>{cls.level}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={e => e.stopPropagation()}>
                                <button
                                    onClick={() => { setEditing(cls); setPopup(true) }}
                                    style={{
                                        padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)',
                                        background: '#F9FAFB', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                        color: '#6B7280', fontFamily: 'inherit',
                                    }}
                                >Sửa</button>
                                <button
                                    onClick={() => handleDelete(cls)}
                                    style={{
                                        padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)',
                                        background: 'rgba(239,68,68,0.05)', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                        color: '#EF4444', fontFamily: 'inherit',
                                    }}
                                >Xóa</button>
                                <RightOutline style={{ color: '#D1D5DB', fontSize: '13px' }} />
                            </div>
                        </div>
                    )
                })}
                {filtered.length === 0 && (
                    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>📚</div>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: '#1A1A2E', marginBottom: '4px' }}>Chưa có lớp học</div>
                        <div style={{ fontSize: '13px', color: '#9CA3AF' }}>Nhấn "Thêm lớp" để bắt đầu</div>
                    </div>
                )}
            </div>

            <Popup
                visible={popup}
                onMaskClick={() => setPopup(false)}
                position="bottom"
                bodyStyle={{ borderRadius: '20px 20px 0 0', maxHeight: '92vh', overflowY: 'auto' }}
                onClose={() => setPopup(false)}
            >
                <ClassForm cls={editing} onSave={handleSave} onClose={() => setPopup(false)} />
            </Popup>
        </div>
    )
}
