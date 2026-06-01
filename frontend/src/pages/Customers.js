import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getCustomers, createCustomer, deleteCustomer } from '../services/api';

const EMPTY_FORM = { full_name: '', email: '', phone: '' };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    getCustomers().then(r => setCustomers(r.data)).catch(() => toast.error('Failed to load customers')).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createCustomer(form);
      toast.success('Customer added!');
      setShowModal(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete customer "${name}"? This may affect existing orders.`)) return;
    try {
      await deleteCustomer(id);
      toast.success('Customer deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Delete failed');
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /> Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Customers</div>
          <div className="page-subtitle">{customers.length} registered customer(s)</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Customer</button>
      </div>

      <div className="card">
        {customers.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">👥</div><p>No customers yet. Add your first customer!</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Full Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{c.id}</td>
                    <td><strong>{c.full_name}</strong></td>
                    <td style={{ color: 'var(--accent)' }}>{c.email}</td>
                    <td>{c.phone}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-danger" style={{ padding: '6px 12px' }} onClick={() => handleDelete(c.id, c.full_name)}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">➕ Add Customer</div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="e.g. Rahul Sharma" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-input" required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="rahul@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input className="form-input" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Customer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
