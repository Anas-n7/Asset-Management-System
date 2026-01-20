import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'

function Layout({ setIsAuthenticated }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setIsAuthenticated(false)
    navigate('/login')
  }

  const menuItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/assets', icon: '📦', label: 'Assets' },
    { path: '/inventory', icon: '📊', label: 'Inventory' },
    { path: '/assignments', icon: '👥', label: 'Assignments' },
    { path: '/tickets', icon: '🎫', label: 'Tickets' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl border-r border-indigo-100">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-indigo-100">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AssetHub
            </h1>
            <p className="text-sm text-gray-500 mt-1">Management System</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              const activeClass = isActive
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'
                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeClass}`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-indigo-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <span className="text-xl">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="ml-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
