import React, { useState } from 'react';
import { store, CUR, fmt } from '../store';

export default function Profile({ user, setUser, data, onLogout, onDelete }) {
  const [name, setName] = useState(user.name);
  const [saved, setSaved] = useState(false);

  const save = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const updatedUser = { ...user, name: name.trim() };
    const users = store.get('pk_users', []).map(u => u.id === user.id ? updatedUser : u);
    store.set('pk_users', users);
    setUser(updatedUser);
    setSaved(true); setTimeout(() => setSaved(false), 1500);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedUser = { ...user, avatar: reader.result };
      const users = store.get('pk_users', []).map(u => u.id === user.id ? updatedUser : u);
      store.set('pk_users', users);
      setUser(updatedUser);
    };
    reader.readAsDataURL(file);
  };

  const total = data.expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <>
      <div style={{ background: '#fff', padding: 22, borderRadius: 15, boxShadow: '0 4px 15px rgba(0,0,0,.05)', marginBottom: 18 }}>
        <h3>Жеке кабинет</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 14 }}>
          <div style={{ position: 'relative', width: 60, height: 60, borderRadius: '50%', background: '#2ecc71', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, overflow: 'hidden' }}>
            {user.avatar ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name[0].toUpperCase()}
          </div>
          <div>
            <strong>{user.name}</strong><br /><small style={{ color: '#8a949a' }}>{user.email}</small><br />
            <label style={{ color: '#3498db', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
              Суретті өзгерту <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
        </div>
        <small style={{ color: '#8a949a' }}>Тіркелген күні: {user.created || 'Белгісіз'}</small>
        
        <div style={{ display: 'flex', gap: 10, margin: '14px 0' }}>
          <div style={{ flex: 1, textAlign: 'center', padding: 10, borderRadius: 8, background: '#eaf4fd', color: '#2574a9' }}>
            <small>Шығын саны</small><strong style={{ display: 'block', marginTop: 4 }}>{data.expenses.length}</strong>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: 10, borderRadius: 8, background: '#eaf4fd', color: '#2574a9' }}>
            <small>Барлық шығын</small><strong style={{ display: 'block', marginTop: 4 }}>{fmt(total)} {CUR}</strong>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: 10, borderRadius: 8, background: '#eaf4fd', color: '#2574a9' }}>
            <small>Мақсаттар</small><strong style={{ display: 'block', marginTop: 4 }}>{data.goals.length}</strong>
          </div>
        </div>

        <form onSubmit={save}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Аты-жөніңіз" style={{ width: '100%', padding: 12, margin: '6px 0', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: 12, background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
            {saved ? 'Сақталды ✓' : 'Атын сақтау'}
          </button>
        </form>
      </div>

      <div style={{ background: '#fff', padding: 22, borderRadius: 15, boxShadow: '0 4px 15px rgba(0,0,0,.05)' }}>
        <h3>Деректер мен аккаунт</h3>
        <button onClick={() => {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'pkeys-finance.json'; a.click();
        }} style={{ width: '100%', padding: 12, background: '#3498db', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>Деректерді жүктеу (JSON)</button>
        <button onClick={onLogout} style={{ width: '100%', padding: 12, background: '#f4f7f6', border: '1px solid #e6ebee', color: '#2d3436', borderRadius: 8, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>Шығу</button>
        <button onClick={() => { if (confirm('Аккаунт пен барлық деректер өшіріледі. Сенімдісіз бе?')) onDelete(); }} style={{ width: '100%', padding: 12, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Аккаунтты өшіру</button>
      </div>
    </>
  );
}