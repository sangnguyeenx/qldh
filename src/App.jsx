import { useState, useEffect } from 'react'
import { NavBar, TabBar, Input, Button, Toast } from 'antd-mobile'
import { AppOutline, UnorderedListOutline, PayCircleOutline, SetOutline, LockOutline } from 'antd-mobile-icons'
import { useStore } from './store/useStore'
import Dashboard from './pages/Dashboard'
import Classes from './pages/Classes'
import ClassDetail from './pages/ClassDetail'
import PaymentRounds from './pages/PaymentRounds'
import RoundDetail from './pages/RoundDetail'
import Settings from './pages/Settings'
import { onAuthChange, signInWithGoogle } from './services/firebase'

const TABS = [
  { key: 'dashboard', title: 'Tổng quan', icon: <AppOutline /> },
  { key: 'classes', title: 'Lớp học', icon: <UnorderedListOutline /> },
  { key: 'payment-rounds', title: 'Đợt thu', icon: <PayCircleOutline /> },
  { key: 'settings', title: 'Cài đặt', icon: <SetOutline /> },
]

const PAGE_TITLE = {
  dashboard: 'Tổng Quan',
  classes: 'Lớp Học',
  'class-detail': 'Chi Tiết Lớp',
  'payment-rounds': 'Đợt Thu',
  'round-detail': 'Chi Tiết Đợt Thu',
  settings: 'Cài Đặt',
}

function loadSetting(key, fallback) {
  try { return JSON.parse(localStorage.getItem('setting_' + key)) ?? fallback }
  catch { return fallback }
}

function LockScreen({ onUnlock, theme }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const handleUnlock = () => {
    const saved = loadSetting('password', null)
    if (pin === saved) {
      onUnlock()
    } else {
      setError(true)
      setPin('')
      setTimeout(() => setError(false), 1500)
    }
  }

  const primary = theme?.primary || '#3B82F6'
  const gradient = theme?.gradient || 'linear-gradient(135deg,#3B82F6,#6366F1)'

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)',
      padding: '32px 24px',
    }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '50%',
        background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 8px 32px ${primary}55`, marginBottom: '20px',
      }}>
        <LockOutline style={{ fontSize: '32px', color: '#fff' }} />
      </div>
      <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>Nhập mật khẩu</div>
      <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '32px' }}>Để truy cập ứng dụng</div>

      <div style={{ width: '100%', maxWidth: '280px' }}>
        <input
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleUnlock()}
          placeholder="Mật khẩu..."
          autoFocus
          style={{
            width: '100%', padding: '14px 16px', borderRadius: '12px',
            border: error ? '2px solid #EF4444' : '2px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.07)', color: '#fff',
            fontSize: '16px', fontFamily: 'inherit', outline: 'none',
            textAlign: 'center', letterSpacing: '4px', boxSizing: 'border-box',
            transition: 'border 0.2s',
          }}
        />
        {error && <div style={{ color: '#EF4444', fontSize: '13px', textAlign: 'center', marginTop: '8px', fontWeight: 600 }}>Mật khẩu không đúng!</div>}

        <button
          onClick={handleUnlock}
          style={{
            marginTop: '16px', width: '100%', padding: '14px',
            borderRadius: '12px', border: 'none', cursor: 'pointer',
            background: gradient, color: '#fff',
            fontSize: '15px', fontWeight: 700, fontFamily: 'inherit',
            boxShadow: `0 4px 16px ${primary}44`,
          }}
        >
          Mở khóa
        </button>
      </div>
    </div>
  )
}

function LoginScreen() {
  const [loading, setLoading] = useState(false)
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '32px 24px',
    }}>
      {/* Logo */}
      <div style={{
        width: '80px', height: '80px', borderRadius: '24px',
        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '40px', marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.3)',
      }}>📚</div>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
          Quản Lý Học Phí
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0 }}>
          Đăng nhập để tiếp tục
        </p>
      </div>

      <div style={{
        width: '100%', maxWidth: '340px',
        background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)',
        borderRadius: '20px', padding: '28px 24px',
        border: '1px solid rgba(255,255,255,0.25)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', textAlign: 'center', margin: '0 0 20px', lineHeight: 1.6 }}>
          Dữ liệu được đồng bộ theo tài khoản Google của bạn
        </p>

        <button
          onClick={async () => {
            setLoading(true)
            try { await signInWithGoogle() }
            catch (e) {
              Toast.show({ icon: 'fail', content: 'Đăng nhập thất bại, thử lại!' })
            } finally { setLoading(false) }
          }}
          disabled={loading}
          style={{
            width: '100%', padding: '14px 20px', borderRadius: '14px',
            border: 'none', background: loading ? 'rgba(255,255,255,0.7)' : '#fff',
            cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            fontSize: '15px', fontWeight: 700, color: '#3C4043',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            transition: 'all 0.15s',
          }}
        >
          {loading ? (
            <span style={{ fontSize: '18px' }}>⏳</span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
          )}
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập với Google'}
        </button>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '28px', textAlign: 'center' }}>
        🔐 Dữ liệu bảo mật bởi Google Firebase
      </p>
    </div>
  )
}

export default function App() {
  const store = useStore()
  const [page, setPage] = useState('dashboard')
  const [pageParams, setPageParams] = useState({})
  const [history, setHistory] = useState([])
  const [theme, setTheme] = useState(() => {
    const saved = loadSetting('theme', 'default')
    if (saved && saved !== 'default') {
      document.documentElement.setAttribute('data-theme', saved)
    }
    // Apply glass opacity on init
    const glassOpacity = loadSetting('glassOpacity', 0.2)
    document.documentElement.style.setProperty('--glass-opacity', glassOpacity)

    // Apply wallpaper on init
    const wallpaper = localStorage.getItem('setting_wallpaper')
    if (wallpaper) {
      document.documentElement.style.setProperty('--body-bg-image', `url(${wallpaper})`)
      document.documentElement.style.setProperty('--body-bg-size', 'cover')
      document.documentElement.style.setProperty('--body-bg-pos', 'center')
      // Tạo fixed background div
      const bgEl = document.createElement('div')
      bgEl.id = 'wallpaper-fixed-bg'
      bgEl.style.cssText = [
        'position:fixed', 'top:0', 'left:0', 'right:0', 'bottom:0',
        'z-index:-1', `background-image:url(${wallpaper})`,
        'background-size:cover', 'background-position:center',
        'background-repeat:no-repeat', 'pointer-events:none',
      ].join(';')
      document.body.insertBefore(bgEl, document.body.firstChild)
    }
    return saved
  })
  const [unlocked, setUnlocked] = useState(() => !loadSetting('password', null))
  const [authUser, setAuthUser] = useState(undefined) // undefined = loading, null = not logged in

  useEffect(() => {
    const unsub = onAuthChange(user => setAuthUser(user))
    return unsub
  }, [])

  const handleThemeChange = (t) => setTheme(t?.key || 'default')

  const navigate = (p, params = {}) => {
    setHistory(h => [...h, { page, params: pageParams }])
    setPage(p); setPageParams(params)
    window.scrollTo(0, 0)
  }

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1]
      setPage(prev.page); setPageParams(prev.params)
      setHistory(h => h.slice(0, -1))
      window.scrollTo(0, 0)
    }
  }

  const navigateTab = (key) => {
    setPage(key); setPageParams({}); setHistory([])
    window.scrollTo(0, 0)
  }

  const renderPage = () => {
    const props = { store, navigate, params: pageParams }
    switch (page) {
      case 'dashboard': return <Dashboard {...props} />
      case 'classes': return <Classes {...props} />
      case 'class-detail': return <ClassDetail {...props} />
      case 'payment-rounds': return <PaymentRounds {...props} />
      case 'round-detail': return <RoundDetail {...props} />
      case 'settings': return <Settings onThemeChange={handleThemeChange} />
      default: return <Dashboard {...props} />
    }
  }

  const activeTab = page === 'class-detail' ? 'classes'
    : page === 'round-detail' ? 'payment-rounds'
      : page

  const canGoBack = history.length > 0

  // Auth gate
  if (authUser === undefined) {
    // Đang check trạng thái đăng nhập
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>📚</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 600 }}>Đang tải...</div>
        </div>
      </div>
    )
  }

  if (!authUser) {
    return <LoginScreen />
  }

  if (!unlocked) {
    return <LockScreen theme={null} onUnlock={() => setUnlocked(true)} />
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* ── NavBar ── */}
      <NavBar
        back={canGoBack ? '  Quay lại' : null}
        onBack={canGoBack ? goBack : undefined}
        style={{ '--height': '44px' }}
      >
        <span style={{ fontSize: '17px', fontWeight: 700 }}>
          {PAGE_TITLE[page] || 'Tổng Quan'}
        </span>
      </NavBar>

      {/* ── Content ── */}
      <div className="page-content" style={{ flex: 1, overflowY: 'auto' }}>
        {renderPage()}
      </div>

      {/* ── TabBar ── */}
      <TabBar activeKey={activeTab} onChange={navigateTab} style={{ '--height': '50px' }}>
        {TABS.map(t => (
          <TabBar.Item key={t.key} icon={t.icon} title={t.title} />
        ))}
      </TabBar>
    </div>
  )
}
