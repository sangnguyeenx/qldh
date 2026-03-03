// ── iOS-style form components ─────────────────────────────────────────

export function Field({ label, children, caption }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(60,60,67,0.6)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {label}
            </label>
            {children}
            {caption && (
                <span style={{ fontSize: '12px', color: caption.includes('thiếu') ? '#FF3B30' : caption.includes('đủ') || caption.startsWith('✓') ? '#34C759' : 'rgba(60,60,67,0.5)' }}>
                    {caption}
                </span>
            )}
        </div>
    )
}

const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    border: '0.5px solid rgba(60,60,67,0.2)',
    borderRadius: '12px',
    fontSize: '16px',
    color: '#000',
    background: 'rgba(120,120,128,0.06)',
    outline: 'none',
    transition: 'border-color 0.15s, background 0.15s',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
}

export function Input(props) {
    return (
        <input
            {...props}
            style={{ ...inputStyle, ...props.style }}
            onFocus={e => { e.target.style.borderColor = '#007AFF'; e.target.style.background = '#FFF' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(60,60,67,0.2)'; e.target.style.background = 'rgba(120,120,128,0.06)' }}
        />
    )
}

export function SelectInput({ children, ...props }) {
    return (
        <select
            {...props}
            style={{
                ...inputStyle,
                appearance: 'none',
                WebkitAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2360636e' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
                paddingRight: '36px',
                cursor: 'pointer',
            }}
        >
            {children}
        </select>
    )
}

export function FormStack({ children }) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</div>
}

export function FormGrid({ children }) {
    return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>{children}</div>
}

export function FormActions({ children }) {
    return (
        <div style={{
            display: 'flex', gap: '10px', paddingTop: '8px',
            borderTop: '0.5px solid rgba(60,60,67,0.12)',
            marginTop: '4px',
        }}>
            {children}
        </div>
    )
}

export function Btn({ children, onClick, variant }) {
    const isPrimary = variant === 'primary'
    return (
        <button
            onClick={onClick}
            style={{
                flex: 1, padding: '13px', borderRadius: '13px', border: 'none',
                cursor: 'pointer', fontSize: '16px', fontWeight: 600, fontFamily: 'inherit',
                background: isPrimary ? '#007AFF' : 'rgba(120,120,128,0.12)',
                color: isPrimary ? '#FFFFFF' : '#000000',
                transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            onTouchStart={e => e.currentTarget.style.opacity = '0.7'}
            onTouchEnd={e => e.currentTarget.style.opacity = '1'}
        >
            {children}
        </button>
    )
}
