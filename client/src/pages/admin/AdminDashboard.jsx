import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Building2, Users, BookOpen, GraduationCap, 
  TrendingUp, FileText, UserPlus, Plus,
  Clock, CheckCircle, AlertCircle, GitBranch, Layers
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity] = useState([
    { name: 'Rahul Sharma', type: 'Faculty', typeBg: 'bg-blue-100 text-blue-700', action: 'Profile Updated', time: '10 mins ago', status: 'Success', statusColor: 'text-green-600' },
    { name: 'Priya Patel', type: 'Student', typeBg: 'bg-purple-100 text-purple-700', action: 'New Enrollment', time: '1 hour ago', status: 'Success', statusColor: 'text-green-600' },
    { name: 'Computer Science', type: 'Dept', typeBg: 'bg-orange-100 text-orange-700', action: 'Curriculum Update', time: '2 hours ago', status: 'Pending', statusColor: 'text-yellow-600' },
    { name: 'Arjun Reddy', type: 'Student', typeBg: 'bg-purple-100 text-purple-700', action: 'Fee Payment', time: '3 hours ago', status: 'Success', statusColor: 'text-green-600' },
    { name: 'Dr. Sneha Gupta', type: 'Faculty', typeBg: 'bg-blue-100 text-blue-700', action: 'Attendance Marked', time: '4 hours ago', status: 'Success', statusColor: 'text-green-600' },
  ]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/admin');
        setStats(res.data.data);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Departments', 
      value: stats?.totalDepartments || 0, 
      icon: Building2, 
      iconBg: 'bg-blue-100', 
      iconColor: 'text-blue-600',
      change: '+0%',
      changeText: 'vs last month'
    },
    { 
      title: 'Total Faculty', 
      value: stats?.totalFaculty || 0, 
      icon: Users, 
      iconBg: 'bg-green-100', 
      iconColor: 'text-green-600',
      change: '+4.2%',
      changeText: 'vs last month'
    },
    { 
      title: 'Total Courses', 
      value: stats?.totalCourses || 0, 
      icon: BookOpen, 
      iconBg: 'bg-purple-100', 
      iconColor: 'text-purple-600',
      change: '+1.5%',
      changeText: 'vs last month'
    },
    { 
      title: 'Total Students', 
      value: stats?.totalStudents || 0, 
      icon: GraduationCap, 
      iconBg: 'bg-orange-100', 
      iconColor: 'text-orange-600',
      change: '+8.1%',
      changeText: 'vs last month'
    },
  ];

  const quickActions = [
    { label: 'Branches', icon: GitBranch, onClick: () => navigate('/admin/branches') },
    { label: 'Fields', icon: Layers, onClick: () => navigate('/admin/fields') },
    { label: 'Add Faculty', icon: UserPlus, onClick: () => navigate('/admin/faculty') },
    { label: 'Add Student', icon: GraduationCap, onClick: () => navigate('/admin/students') },
    { label: 'Add Course', icon: BookOpen, onClick: () => navigate('/admin/courses') },
    { label: 'Departments', icon: Building2, onClick: () => navigate('/admin/departments') },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-800 via-primary-700 to-accent-400 rounded-xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-4 right-8 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-2 right-32 w-16 h-16 bg-white/5 rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {getGreeting()}, {user?.name || 'Admin'} 👋
            </h1>
            <p className="text-white/80 text-sm md:text-base">
              You have 4 pending faculty approvals and 12 student requests to review today. Have a great day ahead!
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button 
              onClick={() => navigate('/admin/faculty')}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors"
            >
              View Reports
            </button>
            <button 
              onClick={() => navigate('/admin/faculty')}
              className="bg-white text-primary-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Add Faculty
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value.toLocaleString()}</p>
              </div>
              <div className={`${card.iconBg} p-3 rounded-xl`}>
                <card.icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">{card.change}</span>
              <span className="text-gray-400 ml-2">{card.changeText}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.typeBg}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-600">{item.action}</td>
                    <td className="px-6 py-3.5 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                        {item.time}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center">
                        {item.status === 'Success' ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${item.statusColor}`}>{item.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 grid grid-cols-3 gap-3">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
              >
                <div className="bg-gray-100 group-hover:bg-primary-100 p-3 rounded-lg mb-2 transition-colors">
                  <action.icon className="h-5 w-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-primary-700">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Fee Collection Summary */}
          <div className="px-6 pb-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <p className="text-sm text-green-700 font-medium mb-1">Fee Collection</p>
              <p className="text-2xl font-bold text-green-800">
                ₹{stats?.fees?.totalCollected ? (stats.fees.totalCollected / 1000).toFixed(0) + 'K' : '0'}
              </p>
              <p className="text-xs text-green-600 mt-1">Total collected this semester</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
