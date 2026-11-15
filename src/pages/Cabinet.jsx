import React, { useState, useEffect, useMemo } from 'react';
import { store, DEFAULT_CATS, todayStr } from '../store';
import Dashboard from '../components/Dashboard';
import Expenses from '../components/Expenses';
import Goals from '../components/Goals';
import Wishlist from '../components/Wishlist';
import Profile from '../components/Profile';

export default function Cabinet({ user, setUser, onLogout, onDelete }) {
  const key = 'pk_data_' + user.id;
  const [data, setData] = useState(() => ({ budget: 0, expenses: [], goals: [], wishlist: [], limits: {}, savedByWaiting: 0, ...store.get(key, {}) }));
  const [tab, setTab] = useState('home');
  const [month, setMonth] = useState(todayStr().slice(0, 7));

  useEffect(() => { store.set(key, data); }, [data]);

  const cats = useMemo(() => {
    const set = new Set(DEFAULT_CATS);
    data.expenses.forEach(e => set.add(e.category));
    return Array.from(set);
  }, [data.expenses]);

  return (
    <div style={{ width: '100%', maxWidth: 560, margin: 'auto', padding: 16, fontFamily: 'Segoe UI, sans-serif', boxSizing: 'border-box' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, color: '#fff' }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>💰 PKeys Finance</div>
        
        <div onClick={() => setTab('me')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} title="Профильге өту">
          <span>{user.name}</span>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#2ecc71', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, overflow: 'hidden' }}>
            {user.avatar ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name[0].toUpperCase()}
          </div>
        </div>
      </header>

      <nav style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto' }}>
        <button onClick={() => setTab('home')} style={{ flex: 1, padding: '10px 10px', background: tab === 'home' ? '#2ecc71' : '#fff', color: tab === 'home' ? '#fff' : '#2d3436', border: '1px solid #ddd', borderRadius: 8, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Басты бет</button>
        <button onClick={() => setTab('exp')} style={{ flex: 1, padding: '10px 10px', background: tab === 'exp' ? '#2ecc71' : '#fff', color: tab === 'exp' ? '#fff' : '#2d3436', border: '1px solid #ddd', borderRadius: 8, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Шығындар</button>
        <button onClick={() => setTab('goals')} style={{ flex: 1, padding: '10px 10px', background: tab === 'goals' ? '#2ecc71' : '#fff', color: tab === 'goals' ? '#fff' : '#2d3436', border: '1px solid #ddd', borderRadius: 8, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Мақсаттар</button>
        <button onClick={() => setTab('wait')} style={{ flex: 1, padding: '10px 10px', background: tab === 'wait' ? '#2ecc71' : '#fff', color: tab === 'wait' ? '#fff' : '#2d3436', border: '1px solid #ddd', borderRadius: 8, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>24 сағат</button>
        <button onClick={() => setTab('me')} style={{ flex: 1, padding: '10px 10px', background: tab === 'me' ? '#2ecc71' : '#fff', color: tab === 'me' ? '#fff' : '#2d3436', border: '1px solid #ddd', borderRadius: 8, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Профиль</button>
      </nav>

      {tab === 'home' && <Dashboard data={data} setData={setData} month={month} setMonth={setMonth} cats={cats} />}
      {tab === 'exp' && <Expenses data={data} setData={setData} month={month} setMonth={setMonth} cats={cats} />}
      {tab === 'goals' && <Goals data={data} setData={setData} />}
      {tab === 'wait' && <Wishlist data={data} setData={setData} />}
      {tab === 'me' && <Profile user={user} setUser={setUser} data={data} onLogout={onLogout} onDelete={onDelete} />}
    </div>
  );
}