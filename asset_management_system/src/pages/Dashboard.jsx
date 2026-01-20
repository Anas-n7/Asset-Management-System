import { useEffect, useState } from "react";
import api from "../api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await api.get("dashboard/");
      setStats(response.data);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  const overview = stats.overview || {};
  const categoryStats = stats.category_stats || [];
  const ticketStats = stats.ticket_status_stats || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your asset management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Assets" value={overview.total_assets} icon="📦" color="from-blue-500 to-blue-600" />
        <StatCard title="Available Assets" value={overview.available_assets} icon="✅" color="from-green-500 to-green-600" />
        <StatCard title="Total Tickets" value={overview.total_tickets} icon="🎫" color="from-orange-500 to-orange-600" />
        <StatCard title="Open Tickets" value={overview.open_tickets} icon="⚠️" color="from-red-500 to-red-600" />
        <StatCard title="Total Assignments" value={overview.total_assignments} icon="👥" color="from-purple-500 to-purple-600" />
        <StatCard title="Total Inventory" value={overview.total_inventory} icon="📊" color="from-indigo-500 to-indigo-600" />
        <StatCard title="Unavailable Assets" value={overview.unavailable_assets} icon="❌" color="from-gray-500 to-gray-600" />
        <StatCard title="Recent Assignments" value={overview.recent_assignments} icon="🆕" color="from-pink-500 to-pink-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart categoryStats={categoryStats} totalAssets={overview.total_assets} />
        <TicketChart ticketStats={ticketStats} totalTickets={overview.total_tickets} />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value || 0}</p>
        </div>
        <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-3xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function CategoryChart({ categoryStats, totalAssets }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Assets by Category</h2>
      <div className="space-y-3">
        {categoryStats.length > 0 ? (
          categoryStats.map((cat, idx) => {
            const percentage = totalAssets > 0 ? (cat.count / totalAssets) * 100 : 0;
            return (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{cat.category || 'Uncategorized'}</span>
                    <span className="text-sm text-gray-500">{cat.count} total</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {cat.available_count} available
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-sm">No category data available</p>
        )}
      </div>
    </div>
  );
}

function TicketChart({ ticketStats, totalTickets }) {
  const getStatusColor = (status) => {
    if (status === 'open') return 'bg-gradient-to-r from-red-500 to-orange-500';
    if (status === 'closed') return 'bg-gradient-to-r from-green-500 to-emerald-500';
    return 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Ticket Status</h2>
      <div className="space-y-3">
        {ticketStats.length > 0 ? (
          ticketStats.map((statusItem, idx) => {
            const percentage = totalTickets > 0 ? (statusItem.count / totalTickets) * 100 : 0;
            return (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">{statusItem.status}</span>
                    <span className="text-sm text-gray-500">{statusItem.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getStatusColor(statusItem.status)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-sm">No ticket data available</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
