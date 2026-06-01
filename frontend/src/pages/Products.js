import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';

const EMPTY_FORM = { name: '', sku: '', price: '', quantity: '' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    getProducts().then(r => setProducts(r.data)).catch(() => toast.error('Failed to load products')).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, sku: p.sku, price: p.price, quantity: p.quantity }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) };
    try {
      if (editing) {
        await updateProduct(editing.id, payload);
        toast.success('Product updated!');
      } else {
        await createProduct(payload);
        toast.success('Product added!');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
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
          <div className="page-title">Products</div>
          <div className="page-subtitle">{products.length} product(s) in inventory</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      <div className="card">
        {products.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🛍️</div><p>No products yet. Add your first product!</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Name</th><th>SKU</th><th>Price</th><th>Qty in Stock</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{p.sku}</td>
                    <td>₹{p.price.toFixed(2)}</td>
                    <td>{p.quantity}</td>
                    <td>
                      {p.quantity === 0
                        ? <span className="badge badge-red">Out of Stock</span>
                        : p.quantity <= 5
                        ? <span className="badge badge-yellow">Low Stock</span>
                        : <span className="badge badge-green">In Stock</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost" style={{ padding: '6px 12px' }} onClick={() => openEdit(p)}>✏️ Edit</button>
                        <button className="btn btn-danger" style={{ padding: '6px 12px' }} onClick={() => handleDelete(p.id, p.name)}>🗑️ Delete</button>
                      </div>
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
            <div className="modal-title">{editing ? '✏️ Edit Product' : '➕ Add Product'}</div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Laptop Pro 15" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">SKU / Code *</label>
                  <input className="form-input" required value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="e.g. LAP-001" />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input className="form-input" required type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity in Stock *</label>
                <input className="form-input" required type="number" min="0" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="0" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
