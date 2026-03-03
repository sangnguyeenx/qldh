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
      const root = document.getElementById('root')
      if (root) {
        root.style.backgroundImage = `url(${wallpaper})`
        root.style.backgroundSize = 'cover'
        root.style.backgroundPosition = 'center'
        root.style.backgroundAttachment = 'fixed'
      }
    }
    return saved
  })
  const [unlocked, setUnlocked] = useState(() => !loadSetting('password', null))

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
