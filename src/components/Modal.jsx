import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { XIcon } from '@primer/octicons-react'

export default function Modal({ title, onClose, children }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        const onKey = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', onKey)
        }
    }, [onClose])

    return createPortal(
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                animation: 'fadeIn 0.15s ease',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#FFFFFF',
                    borderRadius: '20px 20px 0 0',
                    width: '100%',
                    maxWidth: '430px',
                    maxHeight: '92vh',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideUp 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
                    overflow: 'hidden',
                }}
            >
                {/* ── Handle ── */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
                    <div style={{ width: '36px', height: '5px', background: 'rgba(60,60,67,0.18)', borderRadius: '3px' }} />
                </div>

                {/* ── Header ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 20px 14px',
                    borderBottom: '0.5px solid rgba(60,60,67,0.12)',
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(120,120,128,0.12)', border: 'none', cursor: 'pointer',
                            width: '30px', height: '30px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'rgba(60,60,67,0.6)',
                        }}
                    >
                        <XIcon size={15} />
                    </button>
                    <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.3px' }}>{title}</span>
                    <div style={{ width: '30px' }} />
                </div>

                {/* ── Scrollable body ── */}
                <div style={{ overflowY: 'auto', padding: '20px', flex: 1, WebkitOverflowScrolling: 'touch' }}>
                    {children}
                </div>
            </div>

            <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>
        </div>,
        document.body
    )
}
