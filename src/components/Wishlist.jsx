import React, { useState, useEffect } from 'react';
import { CUR, fmt, todayStr, uid } from '../store';

const DAY = 24 * 3600 * 1000;

export default function Wishlist({ data, setData }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  const add = (e) => {
    e.preventDefault();
    const p = parseFloat(price);
    if (!name.trim() || !p || p <= 0) return;
    setData(d => ({ ...d, wishlist: [...d.wishlist, { id: uid(), name: name.trim(), price: p, addedAt: Date.now() }] }));
    setName(''); setPrice('');
  };

  const buy = (w) => setData(d => ({
    ...d,
    expenses: [{ id: uid(), category: 'Сатып алу', amount: w.price, date: todayStr(), note: w.name }, ...d.expenses],
    wishlist: d.wishlist.filter(x => x.id !== w.id)
  }));

  const skip = (w) => setData(d => ({
    ...d, savedByWaiting: d.savedByWaiting + w.price, wishlist: d.wishlist.filter(x => x.id !== w.id)
  }));

  const clearWishlist = () => {
    if (confirm('Күту тізімі мен үнемделген соманы тазалауға сенімдісіз бе?')) {
      setData(d => ({ ...d, wishlist: [], savedByWaiting: 0 }));
    }
  };

  const left = (w) => {
    const ms = Math.max(0, w.addedAt + DAY - now);
    return `${Math.floor(ms / 3600000)} сағ ${Math.floor((ms % 3600000) / 60000)} мин`;
  };

  return (
    <>
      <div style={{ background: '#fff', padding: 22, borderRadius: 15, boxShadow: '0 4px 15px rgba(0,0,0,.05)', marginBottom: 18 }}>
        <h3>⏳ 24 сағат ережесі</h3>
        <p style={{ color: '#8a949a', fontSize: 14 }}>Импульсивті сатып алудан сақтайды: затты тізімге қосыңыз, 24 сағаттан кейін әлі керек болса ғана алыңыз.</p>
        <form onSubmit={add}>
          <input placeholder="Не алғыңыз келеді?" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: 12, margin: '6px 0', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <input type="number" placeholder="Бағасы" value={price} onChange={e => setPrice(e.target.value)} required style={{ width: '100%', padding: 12, margin: '6px 0', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: 12, background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', marginTop: 6 }}>Күту тізіміне қосу</button>
        </form>
      </div>

      <div style={{ background: '#fff', padding: 22, borderRadius: 15, boxShadow: '0 4px 15px rgba(0,0,0,.05)' }}>
        <h3>Күту тізімі</h3>
        {data.wishlist.length === 0 && <p style={{ color: '#8a949a' }}>Тізім бос</p>}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {data.wishlist.map(w => {
            const ready = now - w.addedAt >= DAY;
            return (
              <li key={w.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                <strong>{w.name}</strong> — {fmt(w.price)} {CUR}
                <div style={{ color: '#8a949a', fontSize: 13, margin: '4px 0' }}>{ready ? '✅ 24 сағат өтті. Әлі керек пе?' : `Күту: ${left(w)}`}</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button disabled={!ready} onClick={() => buy(w)} style={{ flex: 1, padding: 8, background: ready ? '#2ecc71' : '#cfd6d9', color: '#fff', border: 'none', borderRadius: 6, cursor: ready ? 'pointer' : 'not-allowed' }}>Сатып алдым</button>
                  <button onClick={() => skip(w)} style={{ flex: 1, padding: 8, background: 'transparent', border: '1px solid #ddd', color: '#8a949a', borderRadius: 6, cursor: 'pointer' }}>Керек емес, үнемдедім</button>
                </div>
              </li>
            );
          })}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <span>Барлығы үнемделді: <strong>{fmt(data.savedByWaiting)} {CUR}</strong></span>
        </div>
        {(data.wishlist.length > 0 || data.savedByWaiting > 0) && (
          <button onClick={clearWishlist} style={{ width: '100%', padding: 12, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', marginTop: 14 }}>Барлығын тазалау</button>
        )}
      </div>
    </>
  );
}