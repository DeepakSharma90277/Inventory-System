import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getOrders, createOrder, deleteOrder, getCustomers, getProducts } from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [saving, setSaving] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }]);

  const load = () => {
    Promise.all([getOrders(), getCustomers(), getProducts()])
      .then(([o, c, p]) => { setOrders(o.data); setCustomers(c.data); setProducts(p.data); })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const addItem = () => setItems([...items, { product_id: '', quantity: 1 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    setItems(updated);
  };

  const calcTotal = () => {
    return items.reduce((sum, item) => {
      const prod = products.find(p => p.id === parseInt(item.product_id));
      return sum + (prod ? prod.price * (parseInt(item.quantity) || 0) : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) return toast.error('Please select a customer');
    if (items.some(i => !i.product_id || !i.quantity)) return toast.error('Fill all item fields');
    setSaving(true);
    try {
      await createOrder({
        customer_id: parseInt(customerId),
        items: items.map(i => ({ product_id: parseInt(i.product_id), quantity: parseInt(i.quantity) }))
      });
      toast.success('Order placed!');
      setShowModal(false);
      setCustomerId('');
      setItems([{ product_id: '', quantity: 1 }]);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Order failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this order? Stock will be restored.')) return;
    try {
      await deleteOrder(id);
      toast.success('Order cancelled, stock restored');
      load();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /> Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Orders</div>
          <div className="page-subtitle">{orders.length} order(s) total</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Order</button>
      </div>

      <div className="card">
        {orders.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📋</div><p>No orders yet. Create your first order!</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>#{o.id}</td>
                    <td><strong>{o.customer?.full_name || `Customer #${o.customer_id}`}</strong></td>
                    <td>{o.items?.length || 0} item(s)</td>
                    <td style={{ color: 'var(--green)', fontWeight: 600 }}>₹{o.total_amount.toFixed(2)}</td>
                    <td><span className="badge badge-blue">{o.status}</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost" style={{ padding: '6px 12px' }} onClick={() => setShowDetail(o)}>👁️ View</button>
                        <button className="btn btn-danger" style={{ padding: '6px 12px' }} onClick={() => handleDelete(o.id)}>🗑️ Cancel</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">📋 Create New Order</div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Customer *</label>
                <select className="form-select" value={customerId} onChange={e => setCustomerId(e.target.value)} required>
                  <option value="">Select a customer...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
                </select>
              </div>

              <div className="form-label" style={{ marginBottom: 10 }}>ORDER ITEMS *</div>
              {items.map((item, i) => (
                <div className="order-item-row" key={i}>
                  <select className="form-select" value={item.product_id} onChange={e => updateItem(i, 'product_id', e.target.value)} required>
                    <option value="">Select product...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} — ₹{p.price} (Stock: {p.quantity})</option>)}
                  </select>
                  <input className="form-input" type="number" min="1" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} style={{ width: 80 }} required />
                  {items.length > 1 && <button type="button" className="btn btn-danger" style={{ padding: '6px 10px' }} onClick={() => removeItem(i)}>✕</button>}
                </div>
              ))}
              <button type="button" className="add-item-btn" onClick={addItem}>+ Add Another Item</button>

              <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Total</span>
                <span style={{ fontWeight: 700, color: 'var(--green)' }}>₹{calcTotal().toFixed(2)}</span>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Placing...' : 'Place Order'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showDetail && (
        <div className="modal-overlay" onClick={() => setShowDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Order #{showDetail.id} Details</div>
            <div style={{ marginBottom: 16 }}>
              <p><strong>Customer:</strong> {showDetail.customer?.full_name}</p>
              <p><strong>Email:</strong> {showDetail.customer?.email}</p>
              <p><strong>Status:</strong> <span className="badge badge-blue">{showDetail.status}</span></p>
              <p><strong>Date:</strong> {new Date(showDetail.created_at).toLocaleString()}</p>
            </div>
            <div className="form-label" style={{ marginBottom: 10 }}>ITEMS ORDERED</div>
            <table style={{ width: '100%', marginBottom: 16 }}>
              <thead>
                <tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr>
              </thead>
              <tbody>
                {showDetail.items?.map(item => (
                  <tr key={item.id}>
                    <td>{item.product?.name || `Product #${item.product_id}`}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.unit_price.toFixed(2)}</td>
                    <td>₹{(item.quantity * item.unit_price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: 'right', fontWeight: 700, color: 'var(--green)', fontSize: 18 }}>
              Total: ₹{showDetail.total_amount.toFixed(2)}
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
