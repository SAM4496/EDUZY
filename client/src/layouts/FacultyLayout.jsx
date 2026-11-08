import { useState, useContext } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardCheck, 
  FileText, 
  Users, 
  User,
  LogOut,
  Bell,
  Search,
  Menu,
  GraduationCap
} from 'lucide-react';

const FacultyLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', path: '/faculty/courses', icon: BookOpen },
    { name: 'Attendance', path: '/faculty/attendance', icon: ClipboardCheck },
    { name: 'Assignments', path: '/faculty/assignments', icon: FileText },
    { name: 'Students', path: '/faculty/students', icon: Users },
    { name: 'Profile & Settings', path: '/faculty/profile', icon: User },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center space-x-2 text-primary-600">
            <GraduationCap className="h-8 w-8" />
            <span className="text-2xl font-bold">Eduzy</span>
          </div>
        </div>
        
        <div className="px-4 py-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Faculty Portal</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-white">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center flex-1">
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 p-2 mr-2"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="max-w-md w-full relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm transition-colors"
                placeholder="Search..."
                type="search"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Fall 2024 • Sem 5
            </span>
            <button className="text-gray-400 hover:text-gray-500 relative p-1">
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              <Bell className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-3 ml-4 border-l border-gray-200 pl-4">
              <div className="flex flex-col text-right hidden sm:block">
                <span className="text-sm font-medium text-gray-900">{user?.name || 'Faculty'}</span>
                <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-accent-500 text-white flex items-center justify-center font-bold text-lg">
                {user?.name?.charAt(0) || 'F'}
              </div>
            </div>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FacultyLayout;
