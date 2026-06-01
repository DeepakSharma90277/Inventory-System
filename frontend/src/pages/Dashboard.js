import React, { useEffect, useState } from 'react';
import { getDashboard } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /> Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Overview of your inventory & orders</div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-icon">🛍️</span>
          <div>
            <div className="stat-label">Total Products</div>
            <div className="stat-value">{stats?.total_products ?? 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div>
            <div className="stat-label">Total Customers</div>
            <div className="stat-value">{stats?.total_customers ?? 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📋</span>
          <div>
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{stats?.total_orders ?? 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⚠️</span>
          <div>
            <div className="stat-label">Low Stock Items</div>
            <div className="stat-value" style={{ color: stats?.low_stock_products?.length > 0 ? 'var(--yellow)' : 'inherit' }}>
              {stats?.low_stock_products?.length ?? 0}
            </div>
          </div>
        </div>
      </div>

      {stats?.low_stock_products?.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: 16, color: 'var(--yellow)' }}>⚠️ Low Stock Products (≤5 units)</h3>
          <div className="low-stock-list">
            {stats.low_stock_products.map(p => (
              <div key={p.id} className="low-stock-item">
                <span><strong>{p.name}</strong> <span style={{ color: 'var(--text-secondary)' }}>#{p.sku}</span></span>
                <span className="badge badge-yellow">{p.quantity} left</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats?.low_stock_products?.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--green)' }}>
          ✅ All products are sufficiently stocked!
        </div>
      )}
    </div>
  );
}
