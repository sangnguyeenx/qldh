import { useState } from 'react'
import { Toast, Popup, Form, Input, Button } from 'antd-mobile'
import { LockOutline, CheckOutline } from 'antd-mobile-icons'

const THEMES = [
    {
        key: 'default',
        label: 'Mặc định',
        desc: 'Sáng, tối giản',
        emoji: '☀️',
        preview: {
            bg: '#F2F2F7',
            nav: '#fff',
            card: '#fff',
            accent: '#3B82F6',
            text: '#1A1A2E',
            sub: '#9CA3AF',
        },
    },
    {
        key: 'dark',
        label: 'Tối',
        desc: 'Dark mode',
        emoji: '🌙',
        preview: {
            bg: '#0F172A',
            nav: '#1E293B',
            card: '#1E293B',
            accent: '#818CF8',
            text: '#F1F5F9',
            sub: '#64748B',
        },
    },
    {
        key: 'glass',
        label: 'Thủy tinh',
        desc: 'Glassmorphism',
        emoji: '💎',
        preview: {
            bg: 'linear-gradient(135deg,#a8edea,#d4b5f7)',
            nav: 'rgba(255,255,255,0.3)',
            card: 'rgba(255,255,255,0.25)',
            accent: '#5B5FFF',
            text: '#1A1A2E',
            sub: 'rgba(30,30,60,0.5)',
        },
    },
]

function loadSetting(key, fallback) {
    try { return JSON.parse(localStorage.getItem('setting_' + key)) ?? fallback }
    catch { return fallback }
}
function saveSetting(key, val) {
    localStorage.setItem('setting_' + key, JSON.stringify(val))
}

function ThemePreviewCard({ theme, selected, onSelect }) {
    const p = theme.preview
    const isBgGradient = p.bg.startsWith('linear')

    return (
        <button
            onClick={onSelect}
            style={{
                border: selected ? `2.5px solid ${p.accent}` : '2px solid transparent',
                borderRadius: '16px',
                padding: '10px',
                background: selected ? `${p.accent}12` : '#F9FAFB',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: '6px',
                transition: 'all 0.15s', fontFamily: 'inherit',
                outline: 'none',
            }}
        >
            {/* Mini app mockup */}
            <div style={{
                borderRadius: '10px', overflow: 'hidden',
                background: isBgGradient ? p.bg : p.bg,
                height: '80px', position: 'relative',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}>
                {/* Mini NavBar */}
                <div style={{
                    height: '18px',
                    background: p.nav,
                    borderBottom: `1px solid ${isBgGradient ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.06)'}`,
                    display: 'flex', alignItems: 'center', paddingLeft: '6px', gap: '3px',
                }}>
                    <div style={{ width: '20px', height: '3px', borderRadius: '2px', background: p.accent }} />
                </div>
                {/* Mini content */}
                <div style={{ padding: '5px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{
                        background: isBgGradient ? 'rgba(255,255,255,0.25)' : p.card,
                        borderRadius: '5px', padding: '4px 5px',
                        border: `1px solid ${isBgGradient ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.06)'}`,
                        display: 'flex', gap: '3px', alignItems: 'center',
                    }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: p.accent, flexShrink: 0 }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ height: '2px', borderRadius: '1px', background: p.text, width: '60%' }} />
                            <div style={{ height: '2px', borderRadius: '1px', background: p.sub, width: '40%' }} />
                        </div>
                    </div>
                    <div style={{
                        background: isBgGradient ? 'rgba(255,255,255,0.25)' : p.card,
                        borderRadius: '5px', padding: '4px 5px',
                        border: `1px solid ${isBgGradient ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.06)'}`,
                        display: 'flex', gap: '3px', alignItems: 'center',
                    }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ height: '2px', borderRadius: '1px', background: p.text, width: '70%' }} />
                            <div style={{ height: '2px', borderRadius: '1px', background: p.sub, width: '30%' }} />
                        </div>
                    </div>
                </div>
                {/* Mini TabBar */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: '14px', background: p.nav,
                    borderTop: `1px solid ${isBgGradient ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.06)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-around',
                }}>
                    {[p.accent, p.sub, p.sub, p.sub].map((c, i) => (
                        <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: c }} />
                    ))}
                </div>
            </div>

            {/* Label */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '12px', color: selected ? p.accent : '#1A1A2E', textAlign: 'left' }}>
                        {theme.emoji} {theme.label}
                    </div>
                    <div style={{ fontSize: '10px', color: '#9CA3AF', textAlign: 'left' }}>{theme.desc}</div>
                </div>
                {selected && (
                    <div style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        background: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <CheckOutline style={{ color: '#fff', fontSize: '11px' }} />
                    </div>
                )}
            </div>
        </button>
    )
}

function applyWallpaper(base64) {
    const BG_ID = 'wallpaper-fixed-bg'
    let bgEl = document.getElementById(BG_ID)

    if (base64) {
        // Tạo div fixed đứng sau tất cả — hoạt động trên mọi thiết bị kể cả iOS
        if (!bgEl) {
            bgEl = document.createElement('div')
            bgEl.id = BG_ID
            bgEl.style.cssText = [
                'position:fixed', 'top:0', 'left:0', 'right:0', 'bottom:0',
                'z-index:-1', 'background-size:cover', 'background-position:center',
                'background-repeat:no-repeat', 'pointer-events:none',
            ].join(';')
            document.body.insertBefore(bgEl, document.body.firstChild)
        }
        bgEl.style.backgroundImage = `url(${base64})`
        // CSS variable cho glass theme
        document.documentElement.style.setProperty('--body-bg-image', `url(${base64})`)
        document.documentElement.style.setProperty('--body-bg-size', 'cover')
        document.documentElement.style.setProperty('--body-bg-pos', 'center')
        // Xóa background trên #root để div fixed hiện ra
        const root = document.getElementById('root')
        if (root) { root.style.background = 'none'; root.style.backgroundImage = '' }
    } else {
        if (bgEl) bgEl.remove()
        document.documentElement.style.removeProperty('--body-bg-image')
        document.documentElement.style.removeProperty('--body-bg-size')
        document.documentElement.style.removeProperty('--body-bg-pos')
        const root = document.getElementById('root')
        if (root) { root.style.background = ''; root.style.backgroundImage = '' }
    }
}

function applyGlassOpacity(opacity) {
    document.documentElement.style.setProperty('--glass-opacity', opacity)
}

export default function Settings({ onThemeChange }) {
    const [themeKey, setThemeKey] = useState(() => loadSetting('theme', 'default'))
    const [hasPassword, setHasPassword] = useState(() => !!loadSetting('password', null))
    const [showSetPass, setShowSetPass] = useState(false)
    const [showChangePass, setShowChangePass] = useState(false)
    const [form] = Form.useForm()
    const [changeForm] = Form.useForm()
    const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('setting_wallpaper') || null)
    const [glassOpacity, setGlassOpacity] = useState(() => {
        const saved = parseFloat(loadSetting('glassOpacity', 0.2))
        applyGlassOpacity(saved)
        return saved
    })

    const currentTheme = THEMES.find(t => t.key === themeKey) || THEMES[0]

    const applyTheme = (key) => {
        setThemeKey(key)
        saveSetting('theme', key)
        const theme = THEMES.find(t => t.key === key)
        document.documentElement.setAttribute('data-theme', key === 'default' ? '' : key)
        onThemeChange && onThemeChange(theme)
    }

    const handleWallpaperUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return
        if (file.size > 5 * 1024 * 1024) {
            Toast.show({ icon: 'fail', content: 'Ảnh quá lớn! Chọn ảnh dưới 5MB' })
            return
        }
        const reader = new FileReader()
        reader.onload = (ev) => {
            const base64 = ev.target.result
            localStorage.setItem('setting_wallpaper', base64)
            setWallpaper(base64)
            applyWallpaper(base64)
            Toast.show({ icon: 'success', content: 'Đã đặt hình nền!' })
        }
        reader.readAsDataURL(file)
    }

    const handleRemoveWallpaper = () => {
        localStorage.removeItem('setting_wallpaper')
        setWallpaper(null)
        applyWallpaper(null)
        Toast.show({ icon: 'success', content: 'Đã xóa hình nền!' })
    }

    const handleSetPassword = (values) => {
        if (values.newPass !== values.confirmPass) {
            Toast.show({ icon: 'fail', content: 'Mật khẩu không khớp!' })
            return
        }
        saveSetting('password', values.newPass)
        setHasPassword(true)
        setShowSetPass(false)
        form.resetFields()
        Toast.show({ icon: 'success', content: 'Đã đặt mật khẩu!' })
    }

    const handleChangePassword = (values) => {
        const saved = loadSetting('password', null)
        if (values.oldPass !== saved) {
            Toast.show({ icon: 'fail', content: 'Mật khẩu cũ không đúng!' })
            return
        }
        if (values.newPass !== values.confirmPass) {
            Toast.show({ icon: 'fail', content: 'Mật khẩu mới không khớp!' })
            return
        }
        saveSetting('password', values.newPass)
        setShowChangePass(false)
        changeForm.resetFields()
        Toast.show({ icon: 'success', content: 'Đã đổi mật khẩu!' })
    }

    const handleRemovePassword = () => {
        if (!window.confirm('Bỏ mật khẩu bảo vệ?')) return
        saveSetting('password', null)
        setHasPassword(false)
        Toast.show({ icon: 'success', content: 'Đã bỏ mật khẩu!' })
    }

    const accent = currentTheme.preview.accent

    return (
        <div style={{ paddingBottom: 24 }}>

            {/* Theme picker */}
            <div style={{
                background: 'var(--c-surface, #fff)', margin: '16px 16px 0',
                borderRadius: '16px', overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                border: '1px solid var(--c-border, rgba(0,0,0,0.06))',
            }}>
                <div style={{ padding: '14px 16px 10px', fontSize: '12px', fontWeight: 700, color: 'var(--c-text-3, #9CA3AF)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    🎨 Giao diện
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', padding: '0 12px 14px' }}>
                    {THEMES.map(t => (
                        <ThemePreviewCard
                            key={t.key}
                            theme={t}
                            selected={themeKey === t.key}
                            onSelect={() => applyTheme(t.key)}
                        />
                    ))}
                </div>
            </div>

            {/* Glass opacity slider — chỉ hiện khi theme=glass */}
            {themeKey === 'glass' && (
                <div style={{
                    background: 'var(--c-surface, #fff)', margin: '14px 16px 0',
                    borderRadius: '16px', overflow: 'hidden',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    border: '1px solid var(--c-border, rgba(0,0,0,0.06))',
                    padding: '14px 16px 18px',
                }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--c-text-3, #9CA3AF)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '16px' }}>
                        🫧 Độ trong suốt
                    </div>

                    {/* Preview strip */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        {[0.08, 0.18, 0.32, 0.5, 0.72].map(v => (
                            <div
                                key={v}
                                onClick={() => {
                                    setGlassOpacity(v)
                                    saveSetting('glassOpacity', v)
                                    applyGlassOpacity(v)
                                }}
                                style={{
                                    flex: 1, height: '36px', borderRadius: '10px', cursor: 'pointer',
                                    background: `rgba(255,255,255,${v})`,
                                    border: Math.abs(glassOpacity - v) < 0.01
                                        ? '2.5px solid #5B5FFF'
                                        : '1.5px solid rgba(91,95,255,0.2)',
                                    backdropFilter: 'blur(8px)',
                                    transition: 'border 0.15s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                <span style={{ fontSize: '10px', fontWeight: 700, color: '#5B5FFF', opacity: 0.8 }}>
                                    {Math.round(v * 100)}%
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Slider */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--c-text-3,#9CA3AF)', fontWeight: 600 }}>Trong suốt 💎</span>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#5B5FFF' }}>{Math.round(glassOpacity * 100)}%</span>
                            <span style={{ fontSize: '12px', color: 'var(--c-text-3,#9CA3AF)', fontWeight: 600 }}>Đục 🪨</span>
                        </div>
                        <input
                            type="range"
                            min="0.05"
                            max="0.85"
                            step="0.01"
                            value={glassOpacity}
                            onChange={(e) => {
                                const v = parseFloat(e.target.value)
                                setGlassOpacity(v)
                                saveSetting('glassOpacity', v)
                                applyGlassOpacity(v)
                            }}
                            style={{
                                width: '100%', height: '4px', borderRadius: '2px',
                                appearance: 'none', WebkitAppearance: 'none',
                                background: `linear-gradient(to right, #5B5FFF ${glassOpacity * 100 / 0.85}%, rgba(91,95,255,0.15) ${glassOpacity * 100 / 0.85}%)`,
                                outline: 'none', cursor: 'pointer',
                            }}
                        />

                        <style>{`
                            input[type=range]::-webkit-slider-thumb {
                                -webkit-appearance: none;
                                width: 20px; height: 20px;
                                border-radius: 50%;
                                background: #5B5FFF;
                                box-shadow: 0 2px 8px rgba(91,95,255,0.4);
                                cursor: pointer;
                            }
                        `}</style>
                    </div>
                </div>
            )}

            {/* Hình nền */}
            <div style={{
                background: 'var(--c-surface, #fff)', margin: '14px 16px 0',
                borderRadius: '16px', overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                border: '1px solid var(--c-border, rgba(0,0,0,0.06))',
            }}>
                <div style={{ padding: '14px 16px 10px', fontSize: '12px', fontWeight: 700, color: 'var(--c-text-3, #9CA3AF)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    🖼️ Hình nền
                </div>

                {wallpaper && (
                    <div style={{ margin: '0 16px 10px', borderRadius: '12px', overflow: 'hidden', height: '100px', position: 'relative' }}>
                        <img src={wallpaper} alt="wallpaper" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>Hình nền hiện tại</span>
                        </div>
                    </div>
                )}

                <label style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 16px', cursor: 'pointer',
                    borderTop: '1px solid var(--c-border, rgba(0,0,0,0.05))',
                }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                        🖼️
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--c-text, #1A1A2E)' }}>{wallpaper ? 'Đổi hình nền' : 'Chọn hình nền'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--c-text-3, #9CA3AF)', marginTop: '1px' }}>JPG, PNG · Tối đa 5MB</div>
                    </div>
                    <span style={{ fontSize: '12px', color: accent, fontWeight: 700 }}>Chọn →</span>
                    <input type="file" accept="image/*" onChange={handleWallpaperUpload} style={{ display: 'none' }} />
                </label>

                {wallpaper && (
                    <button onClick={handleRemoveWallpaper} style={{
                        width: '100%', padding: '14px 16px', border: 'none',
                        background: 'none', display: 'flex', alignItems: 'center', gap: '12px',
                        cursor: 'pointer', borderTop: '1px solid var(--c-border, rgba(0,0,0,0.05))', fontFamily: 'inherit',
                    }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                            🗑️
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#EF4444' }}>Xóa hình nền</div>
                            <div style={{ fontSize: '12px', color: 'var(--c-text-3, #9CA3AF)', marginTop: '1px' }}>Trở về nền mặc định</div>
                        </div>
                    </button>
                )}
            </div>

            {/* Bảo mật */}
            <div style={{
                background: 'var(--c-surface, #fff)', margin: '14px 16px 0',
                borderRadius: '16px', overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                border: '1px solid var(--c-border, rgba(0,0,0,0.06))',
            }}>
                <div style={{ padding: '14px 16px 10px', fontSize: '12px', fontWeight: 700, color: 'var(--c-text-3, #9CA3AF)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    🔒 Bảo mật
                </div>

                {!hasPassword ? (
                    <button onClick={() => setShowSetPass(true)} style={{
                        width: '100%', padding: '14px 16px', border: 'none',
                        background: 'none', display: 'flex', alignItems: 'center', gap: '12px',
                        cursor: 'pointer', borderTop: '1px solid var(--c-border, rgba(0,0,0,0.05))', fontFamily: 'inherit',
                    }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <LockOutline style={{ fontSize: '18px', color: accent }} />
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--c-text, #1A1A2E)' }}>Đặt mật khẩu</div>
                            <div style={{ fontSize: '12px', color: 'var(--c-text-3, #9CA3AF)', marginTop: '1px' }}>Bảo vệ ứng dụng bằng PIN</div>
                        </div>
                        <span style={{ fontSize: '12px', color: accent, fontWeight: 700 }}>Bật →</span>
                    </button>
                ) : (
                    <>
                        <button onClick={() => setShowChangePass(true)} style={{
                            width: '100%', padding: '14px 16px', border: 'none',
                            background: 'none', display: 'flex', alignItems: 'center', gap: '12px',
                            cursor: 'pointer', borderTop: '1px solid var(--c-border, rgba(0,0,0,0.05))', fontFamily: 'inherit',
                        }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LockOutline style={{ fontSize: '18px', color: '#10B981' }} />
                            </div>
                            <div style={{ flex: 1, textAlign: 'left' }}>
                                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--c-text, #1A1A2E)' }}>Đổi mật khẩu</div>
                                <div style={{ fontSize: '12px', color: 'var(--c-text-3, #9CA3AF)', marginTop: '1px' }}>Đang bật ✓</div>
                            </div>
                            <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 700 }}>Đổi →</span>
                        </button>
                        <button onClick={handleRemovePassword} style={{
                            width: '100%', padding: '14px 16px', border: 'none',
                            background: 'none', display: 'flex', alignItems: 'center', gap: '12px',
                            cursor: 'pointer', borderTop: '1px solid var(--c-border, rgba(0,0,0,0.05))', fontFamily: 'inherit',
                        }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '16px' }}>🔓</span>
                            </div>
                            <div style={{ flex: 1, textAlign: 'left' }}>
                                <div style={{ fontWeight: 700, fontSize: '14px', color: '#EF4444' }}>Bỏ mật khẩu</div>
                                <div style={{ fontSize: '12px', color: 'var(--c-text-3, #9CA3AF)', marginTop: '1px' }}>Tắt bảo vệ ứng dụng</div>
                            </div>
                        </button>
                    </>
                )}
            </div>

            {/* Popup đặt mật khẩu */}
            <Popup visible={showSetPass} onMaskClick={() => { setShowSetPass(false); form.resetFields() }} position="bottom"
                bodyStyle={{ borderRadius: '20px 20px 0 0', padding: '0 0 40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 12px' }}>
                    <Button fill="none" color="danger" onClick={() => { setShowSetPass(false); form.resetFields() }} style={{ padding: 0, fontWeight: 600 }}>Hủy</Button>
                    <span style={{ fontWeight: 700, fontSize: '16px', color: '#1A1A2E' }}>Đặt mật khẩu</span>
                    <Button fill="none" color="primary" onClick={() => form.submit()} style={{ padding: 0, fontWeight: 700 }}>Lưu</Button>
                </div>
                <div style={{ height: '0.5px', background: 'rgba(0,0,0,0.08)' }} />
                <Form form={form} onFinish={handleSetPassword} layout="vertical" style={{ '--border-inner': '0.5px solid rgba(0,0,0,0.07)' }}>
                    <Form.Item name="newPass" label="Mật khẩu mới" rules={[{ required: true, message: 'Nhập mật khẩu' }]}>
                        <Input type="password" placeholder="Nhập mật khẩu..." />
                    </Form.Item>
                    <Form.Item name="confirmPass" label="Xác nhận" rules={[{ required: true, message: 'Xác nhận mật khẩu' }]}>
                        <Input type="password" placeholder="Nhập lại mật khẩu..." />
                    </Form.Item>
                </Form>
            </Popup>

            {/* Popup đổi mật khẩu */}
            <Popup visible={showChangePass} onMaskClick={() => { setShowChangePass(false); changeForm.resetFields() }} position="bottom"
                bodyStyle={{ borderRadius: '20px 20px 0 0', padding: '0 0 40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 12px' }}>
                    <Button fill="none" color="danger" onClick={() => { setShowChangePass(false); changeForm.resetFields() }} style={{ padding: 0, fontWeight: 600 }}>Hủy</Button>
                    <span style={{ fontWeight: 700, fontSize: '16px', color: '#1A1A2E' }}>Đổi mật khẩu</span>
                    <Button fill="none" color="primary" onClick={() => changeForm.submit()} style={{ padding: 0, fontWeight: 700 }}>Lưu</Button>
                </div>
                <div style={{ height: '0.5px', background: 'rgba(0,0,0,0.08)' }} />
                <Form form={changeForm} onFinish={handleChangePassword} layout="vertical" style={{ '--border-inner': '0.5px solid rgba(0,0,0,0.07)' }}>
                    <Form.Item name="oldPass" label="Mật khẩu cũ" rules={[{ required: true }]}>
                        <Input type="password" placeholder="Mật khẩu hiện tại..." />
                    </Form.Item>
                    <Form.Item name="newPass" label="Mật khẩu mới" rules={[{ required: true }]}>
                        <Input type="password" placeholder="Mật khẩu mới..." />
                    </Form.Item>
                    <Form.Item name="confirmPass" label="Xác nhận" rules={[{ required: true }]}>
                        <Input type="password" placeholder="Nhập lại mật khẩu mới..." />
                    </Form.Item>
                </Form>
            </Popup>
        </div>
    )
}
