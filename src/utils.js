// Shared utilities
export const fmt = (n) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n || 0)

export const fmtDate = (d) => {
    if (!d) return '—'
    const [y, m, day] = d.split('-')
    return `${day}/${m}/${y}`
}

export const today = () => new Date().toISOString().slice(0, 10)

export const LEVELS = ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9']

export const STATUS_LABEL = {
    paid: 'Đã đóng',
    partial: 'Đóng thiếu',
    unpaid: 'Chưa đóng',
}

export const METHOD_LABEL = {
    cash: 'Tiền mặt',
    transfer: 'Chuyển khoản',
}

export const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date(today())
}
