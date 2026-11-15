import React, { useState } from 'react';
import { store, uid, todayStr, hashPw } from '../store';

export default function UserForm({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const mail = email.trim().toLowerCase();
    const users = store.get('pk_users', []);
    if (pw.length < 6) return setError('Құпия сөз кемінде 6 таңба болуы керек');
    const hash = await hashPw(pw);
    if (mode === 'register') {
      if (!name.trim()) return setError('Атыңызды жазыңыз');
      if (users.some(u => u.email === mail)) return setError('Бұл email тіркелген');
      const user = { id: uid(), name: name.trim(), email: mail, hash, created: todayStr(), avatar: '' };
      store.set('pk_users', [...users, user]);
      onAuth(user);
    } else {
      const user = users.find(u => u.email === mail && u.hash === hash);
      if (!user) return setError('Email немесе құпия сөз қате');
      onAuth(user);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '8vh auto', padding: 16, fontFamily: 'Segoe UI, sans-serif', boxSizing: 'border-box' }}>
      <div style={{ background: '#fff', padding: 26, borderRadius: 15, boxShadow: '0 4px 15px rgba(0,0,0,.05)', textAlign: 'center' }}>
        
        {/* Логотип пен атауы қабаттаспау үшін оларды flex контейнерге алдық */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, color: '#2d3436' }}>
            <span>💰</span> PKeys Finance
          </div>
          <p style={{ color: '#8a949a', margin: '8px 0 0 0', fontSize: 14 }}>Қаржыңызды ақылды басқарыңыз</p>
        </div>

        <div style={{ display: 'flex', marginBottom: 16, background: '#eef2f3', borderRadius: 8, padding: 4 }}>
          <button type="button" style={{ flex: 1, padding: 10, background: mode === 'login' ? '#2ecc71' : 'transparent', color: mode === 'login' ? '#fff' : '#2d3436', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }} onClick={() => setMode('login')}>Кіру</button>
          <button type="button" style={{ flex: 1, padding: 10, background: mode === 'register' ? '#2ecc71' : 'transparent', color: mode === 'register' ? '#fff' : '#2d3436', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }} onClick={() => setMode('register')}>Тіркелу</button>
        </div>

        <form onSubmit={submit}>
          {mode === 'register' && <input placeholder="Аты-жөніңіз" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 12, margin: '6px 0', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 12, margin: '6px 0', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <div style={{ position: 'relative' }}>
            <input type={showPw ? 'text' : 'password'} placeholder="Құпия сөз (6+ таңба)" value={pw} onChange={e => setPw(e.target.value)} required style={{ width: '100%', padding: 12, margin: '6px 0', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />
            <span onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: 18, cursor: 'pointer', fontSize: 14, color: '#8a949a' }}>{showPw ? '🙈' : '👁️'}</span>
          </div>
          {error && <div style={{ color: '#e74c3c', fontSize: 14, margin: '6px 0', textAlign: 'left' }}>{error}</div>}
          <button type="submit" style={{ width: '100%', padding: 12, background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, marginTop: 10, cursor: 'pointer' }}>{mode === 'login' ? 'Кіру' : 'Аккаунт жасау'}</button>
        </form>
      </div>
    </div>
  );
}