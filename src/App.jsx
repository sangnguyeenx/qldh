import { useState } from 'react'
import { NavBar, TabBar } from 'antd-mobile'
import { AppOutline, UnorderedListOutline, PayCircleOutline } from 'antd-mobile-icons'
import { useStore } from './store/useStore'
import Dashboard from './pages/Dashboard'
import Classes from './pages/Classes'
import ClassDetail from './pages/ClassDetail'
import PaymentRounds from './pages/PaymentRounds'
import RoundDetail from './pages/RoundDetail'

const TABS = [
  { key: 'dashboard', title: 'Tổng quan', icon: <AppOutline /> },
  { key: 'classes', title: 'Lớp học', icon: <UnorderedListOutline /> },
  { key: 'payment-rounds', title: 'Đợt thu', icon: <PayCircleOutline /> },
]

const PAGE_TITLE = {
  dashboard: 'Tổng Quan',
  classes: 'Lớp Học',
  'class-detail': 'Chi Tiết Lớp',
  'payment-rounds': 'Đợt Thu',
  'round-detail': 'Chi Tiết Đợt Thu',
}

export default function App() {
  const store = useStore()
  const [page, setPage] = useState('dashboard')
  const [pageParams, setPageParams] = useState({})
  const [history, setHistory] = useState([])

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
      default: return <Dashboard {...props} />
    }
  }

  const activeTab = page === 'class-detail' ? 'classes'
    : page === 'round-detail' ? 'payment-rounds'
      : page

  const canGoBack = history.length > 0

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
