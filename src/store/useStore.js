import { useState, useEffect, useCallback } from 'react'

const uuid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

// ── Seed data ────────────────────────────────────────────────────────────────
const SEED = {
    classes: [
        { id: 'c1', name: 'Lớp 6A', level: 'Lớp 6', schedule: 'Thứ 2, 4, 6 - 17:30', monthlyFee: 800000, room: 'Phòng 101', status: 'active', createdAt: '2026-01-05' },
        { id: 'c2', name: 'Lớp 7B', level: 'Lớp 7', schedule: 'Thứ 3, 5, 7 - 18:00', monthlyFee: 1000000, room: 'Phòng 102', status: 'active', createdAt: '2026-01-10' },
        { id: 'c3', name: 'Lớp 9C', level: 'Lớp 9', schedule: 'Thứ 2, 5 - 19:00', monthlyFee: 1200000, room: 'Phòng 103', status: 'active', createdAt: '2026-02-01' },
    ],
    students: [
        { id: 's1', name: 'Nguyễn Thị Mai', classId: 'c1', phone: '0901234001', parentPhone: '0901000001', joinDate: '2026-01-06', note: '', status: 'active' },
        { id: 's2', name: 'Trần Văn Hùng', classId: 'c1', phone: '0901234002', parentPhone: '0901000002', joinDate: '2026-01-06', note: '', status: 'active' },
        { id: 's3', name: 'Lê Thị Lan', classId: 'c1', phone: '0901234003', parentPhone: '0901000003', joinDate: '2026-01-07', note: 'Học bổ sung thêm', status: 'active' },
        { id: 's4', name: 'Phạm Minh Tuấn', classId: 'c1', phone: '0901234004', parentPhone: '0901000004', joinDate: '2026-01-07', note: '', status: 'active' },
        { id: 's5', name: 'Hoàng Thị Bích', classId: 'c2', phone: '0901234005', parentPhone: '0901000005', joinDate: '2026-01-11', note: '', status: 'active' },
        { id: 's6', name: 'Vũ Quang Hải', classId: 'c2', phone: '0901234006', parentPhone: '0901000006', joinDate: '2026-01-11', note: '', status: 'active' },
        { id: 's7', name: 'Đỗ Thị Hoa', classId: 'c2', phone: '0901234007', parentPhone: '0901000007', joinDate: '2026-01-12', note: '', status: 'active' },
        { id: 's8', name: 'Bùi Văn Nam', classId: 'c3', phone: '0901234008', parentPhone: '0901000008', joinDate: '2026-02-02', note: '', status: 'active' },
        { id: 's9', name: 'Ngô Thị Thu', classId: 'c3', phone: '0901234009', parentPhone: '0901000009', joinDate: '2026-02-02', note: '', status: 'active' },
        { id: 's10', name: 'Đinh Văn Long', classId: 'c2', phone: '0901234010', parentPhone: '0901000010', joinDate: '2026-01-15', note: 'HS mới chuyển', status: 'active' },
    ],
    paymentRounds: [
        { id: 'r1', name: 'Tháng 1/2026', classId: 'c1', amount: 800000, dueDate: '2026-01-15', note: '', createdAt: '2026-01-05' },
        { id: 'r2', name: 'Tháng 1/2026', classId: 'c2', amount: 1000000, dueDate: '2026-01-15', note: '', createdAt: '2026-01-05' },
        { id: 'r3', name: 'Tháng 2/2026', classId: 'c1', amount: 800000, dueDate: '2026-02-10', note: '', createdAt: '2026-02-01' },
        { id: 'r4', name: 'Tháng 2/2026', classId: 'c2', amount: 1000000, dueDate: '2026-02-10', note: '', createdAt: '2026-02-01' },
        { id: 'r5', name: 'Tháng 3/2026', classId: 'c1', amount: 800000, dueDate: '2026-03-10', note: '', createdAt: '2026-03-01' },
        { id: 'r6', name: 'Tháng 3/2026', classId: 'c3', amount: 1200000, dueDate: '2026-03-10', note: '', createdAt: '2026-03-01' },
    ],
    payments: [
        // Round r1 - c1 (4 hs)
        { id: 'p1', roundId: 'r1', studentId: 's1', paidAmount: 800000, paidDate: '2026-01-08', method: 'cash', status: 'paid', note: '' },
        { id: 'p2', roundId: 'r1', studentId: 's2', paidAmount: 800000, paidDate: '2026-01-10', method: 'transfer', status: 'paid', note: '' },
        { id: 'p3', roundId: 'r1', studentId: 's3', paidAmount: 400000, paidDate: '2026-01-12', method: 'cash', status: 'partial', note: 'Đóng 1 nửa' },
        { id: 'p4', roundId: 'r1', studentId: 's4', paidAmount: 0, paidDate: '', method: '', status: 'unpaid', note: '' },
        // Round r2 - c2 (3 hs + s10)
        { id: 'p5', roundId: 'r2', studentId: 's5', paidAmount: 1000000, paidDate: '2026-01-12', method: 'transfer', status: 'paid', note: '' },
        { id: 'p6', roundId: 'r2', studentId: 's6', paidAmount: 1000000, paidDate: '2026-01-13', method: 'cash', status: 'paid', note: '' },
        { id: 'p7', roundId: 'r2', studentId: 's7', paidAmount: 0, paidDate: '', method: '', status: 'unpaid', note: '' },
        { id: 'p8', roundId: 'r2', studentId: 's10', paidAmount: 0, paidDate: '', method: '', status: 'unpaid', note: '' },
        // Round r3 - c1
        { id: 'p9', roundId: 'r3', studentId: 's1', paidAmount: 800000, paidDate: '2026-02-05', method: 'cash', status: 'paid', note: '' },
        { id: 'p10', roundId: 'r3', studentId: 's2', paidAmount: 0, paidDate: '', method: '', status: 'unpaid', note: '' },
        { id: 'p11', roundId: 'r3', studentId: 's3', paidAmount: 800000, paidDate: '2026-02-06', method: 'transfer', status: 'paid', note: '' },
        { id: 'p12', roundId: 'r3', studentId: 's4', paidAmount: 800000, paidDate: '2026-02-07', method: 'cash', status: 'paid', note: '' },
        // Round r5 - c1 (tháng 3 mới tạo, chưa ai đóng)
        { id: 'p13', roundId: 'r5', studentId: 's1', paidAmount: 0, paidDate: '', method: '', status: 'unpaid', note: '' },
        { id: 'p14', roundId: 'r5', studentId: 's2', paidAmount: 0, paidDate: '', method: '', status: 'unpaid', note: '' },
        { id: 'p15', roundId: 'r5', studentId: 's3', paidAmount: 0, paidDate: '', method: '', status: 'unpaid', note: '' },
        { id: 'p16', roundId: 'r5', studentId: 's4', paidAmount: 0, paidDate: '', method: '', status: 'unpaid', note: '' },
    ],
}

function load(key, fallback) {
    try {
        const raw = localStorage.getItem('tutoring_' + key)
        return raw ? JSON.parse(raw) : fallback
    } catch { return fallback }
}

function save(key, val) {
    localStorage.setItem('tutoring_' + key, JSON.stringify(val))
}

function initStore() {
    if (!localStorage.getItem('tutoring_initialized_v2')) {
        // Clear old keys
        Object.keys(localStorage).filter(k => k.startsWith('tutoring_')).forEach(k => localStorage.removeItem(k))
        Object.keys(SEED).forEach(k => save(k, SEED[k]))
        localStorage.setItem('tutoring_initialized_v2', '1')
    }
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useStore() {
    initStore()

    const [classes, setClassesRaw] = useState(() => load('classes', []))
    const [students, setStudentsRaw] = useState(() => load('students', []))
    const [paymentRounds, setRoundsRaw] = useState(() => load('paymentRounds', []))
    const [payments, setPaymentsRaw] = useState(() => load('payments', []))

    const setClasses = useCallback(v => { setClassesRaw(v); save('classes', v) }, [])
    const setStudents = useCallback(v => { setStudentsRaw(v); save('students', v) }, [])
    const setRounds = useCallback(v => { setRoundsRaw(v); save('paymentRounds', v) }, [])
    const setPayments = useCallback(v => { setPaymentsRaw(v); save('payments', v) }, [])

    // ── Classes ────────────────────────────────────────
    const addClass = useCallback((data) => {
        const next = [...classes, { ...data, id: uuid(), createdAt: new Date().toISOString().slice(0, 10) }]
        setClasses(next)
    }, [classes, setClasses])

    const updateClass = useCallback((id, data) => {
        setClasses(classes.map(c => c.id === id ? { ...c, ...data } : c))
    }, [classes, setClasses])

    const deleteClass = useCallback((id) => {
        setClasses(classes.filter(c => c.id !== id))
        const sids = students.filter(s => s.classId === id).map(s => s.id)
        const nextStudents = students.filter(s => s.classId !== id)
        setStudents(nextStudents)
        const rids = paymentRounds.filter(r => r.classId === id).map(r => r.id)
        setRounds(paymentRounds.filter(r => r.classId !== id))
        setPayments(payments.filter(p => !rids.includes(p.roundId) && !sids.includes(p.studentId)))
    }, [classes, students, paymentRounds, payments, setClasses, setStudents, setRounds, setPayments])

    // ── Students ───────────────────────────────────────
    const addStudent = useCallback((data) => {
        const next = [...students, { ...data, id: uuid() }]
        setStudents(next)
        // Auto-add to existing open rounds of that class
        const openRounds = paymentRounds.filter(r => r.classId === data.classId)
        if (openRounds.length > 0) {
            const newPayments = openRounds.map(r => ({
                id: uuid(), roundId: r.id, studentId: next[next.length - 1]?.id || uuid(),
                paidAmount: 0, paidDate: '', method: '', status: 'unpaid', note: ''
            }))
            setPayments([...payments, ...newPayments])
        }
    }, [students, paymentRounds, payments, setStudents, setPayments])

    const updateStudent = useCallback((id, data) => {
        setStudents(students.map(s => s.id === id ? { ...s, ...data } : s))
    }, [students, setStudents])

    const deleteStudent = useCallback((id) => {
        setStudents(students.filter(s => s.id !== id))
        setPayments(payments.filter(p => p.studentId !== id))
    }, [students, payments, setStudents, setPayments])

    // ── Payment Rounds ─────────────────────────────────
    const addRound = useCallback((data) => {
        const newRound = { ...data, id: uuid(), createdAt: new Date().toISOString().slice(0, 10) }
        setRounds([...paymentRounds, newRound])
        // Auto-create unpaid entries for all active students in that class
        const classStudents = students.filter(s => s.classId === data.classId && s.status === 'active')
        const newPayments = classStudents.map(s => ({
            id: uuid(), roundId: newRound.id, studentId: s.id,
            paidAmount: 0, paidDate: '', method: '', status: 'unpaid', note: ''
        }))
        setPayments([...payments, ...newPayments])
    }, [paymentRounds, students, payments, setRounds, setPayments])

    const updateRound = useCallback((id, data) => {
        setRounds(paymentRounds.map(r => r.id === id ? { ...r, ...data } : r))
    }, [paymentRounds, setRounds])

    const deleteRound = useCallback((id) => {
        setRounds(paymentRounds.filter(r => r.id !== id))
        setPayments(payments.filter(p => p.roundId !== id))
    }, [paymentRounds, payments, setRounds, setPayments])

    // ── Payments ───────────────────────────────────────
    const recordPayment = useCallback((roundId, studentId, data) => {
        const exists = payments.find(p => p.roundId === roundId && p.studentId === studentId)
        if (exists) {
            setPayments(payments.map(p =>
                p.roundId === roundId && p.studentId === studentId ? { ...p, ...data } : p
            ))
        } else {
            setPayments([...payments, { id: uuid(), roundId, studentId, ...data }])
        }
    }, [payments, setPayments])

    // ── Reset ──────────────────────────────────────────
    const resetData = useCallback(() => {
        Object.keys(SEED).forEach(k => save(k, SEED[k]))
        setClassesRaw(SEED.classes)
        setStudentsRaw(SEED.students)
        setRoundsRaw(SEED.paymentRounds)
        setPaymentsRaw(SEED.payments)
    }, [])

    // ── Computed ───────────────────────────────────────
    const getStudentsByClass = useCallback((classId) =>
        students.filter(s => s.classId === classId), [students])

    const getRoundsByClass = useCallback((classId) =>
        paymentRounds.filter(r => r.classId === classId), [paymentRounds])

    const getPaymentsByRound = useCallback((roundId) =>
        payments.filter(p => p.roundId === roundId), [payments])

    const getPaymentsByStudent = useCallback((studentId) =>
        payments.filter(p => p.studentId === studentId), [payments])

    const getRoundStats = useCallback((roundId) => {
        const round = paymentRounds.find(r => r.id === roundId)
        const ps = payments.filter(p => p.roundId === roundId)
        const total = ps.length
        const paid = ps.filter(p => p.status === 'paid').length
        const partial = ps.filter(p => p.status === 'partial').length
        const unpaid = ps.filter(p => p.status === 'unpaid').length
        const totalCollected = ps.reduce((sum, p) => sum + (p.paidAmount || 0), 0)
        const totalExpected = round ? ps.reduce((sum, p) => sum + (p.requiredAmount || round.amount), 0) : 0
        return { total, paid, partial, unpaid, totalCollected, totalExpected }
    }, [payments, paymentRounds])

    // Dashboard stats
    const dashboardStats = {
        totalClasses: classes.filter(c => c.status === 'active').length,
        totalStudents: students.filter(s => s.status === 'active').length,
        totalCollected: payments.filter(p => p.status === 'paid' || p.status === 'partial')
            .reduce((sum, p) => sum + (p.paidAmount || 0), 0),
        totalUnpaid: (() => {
            let sum = 0
            paymentRounds.forEach(r => {
                const ps = payments.filter(p => p.roundId === r.id && (p.status === 'unpaid' || p.status === 'partial'))
                ps.forEach(p => { sum += (p.requiredAmount || r.amount) - (p.paidAmount || 0) })
            })
            return sum
        })(),
    }

    return {
        classes, students, paymentRounds, payments,
        addClass, updateClass, deleteClass,
        addStudent, updateStudent, deleteStudent,
        addRound, updateRound, deleteRound,
        recordPayment,
        resetData,
        getStudentsByClass, getRoundsByClass, getPaymentsByRound,
        getPaymentsByStudent, getRoundStats,
        dashboardStats,
    }
}
