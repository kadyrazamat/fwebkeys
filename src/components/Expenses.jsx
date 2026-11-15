import React, { useState } from 'react';
import { DEFAULT_CATS, CUR, fmt, todayStr, monthOf, uid } from '../store';

export default function Expenses({ data, setData, month, setMonth, cats }) {
  const [sel, setSel] = useState(DEFAULT_CATS[0]);
  const [custom, setCustom] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(todayStr());

  const add = (e) => {
    e.preventDefault();
    const a = parseFloat(amount);
    if (!a || a <= 0) return;
    const category = custom.trim() || sel;
    setData(d => ({ ...d, expenses: [{ id: uid(), category, amount: a, date, note: note.trim() }, ...d.expenses] }));
    setAmount(''); setCustom(''); setNote('');
  };

  const del = (id) => setData(d => ({ ...d, expenses: d.expenses.filter(x => x.id !== id) }));
  const clear = () => { if (confirm('Барлық шығындарды өшіруге сенімдісіз бе?')) setData(d => ({ ...d, expenses: [] })); };

  const list = data.expenses.filter(e => monthOf(e.date) === month).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <div style={{ background: '#fff', padding: 22, borderRadius: 15, boxShadow: '0 4px 15px rgba(0,0,0,.05)', marginBottom: 18 }}>
        <h3 style={{ margin: '0 0 12px' }}>Шығын қосу</h3>
        <form onSubmit={add}>
          <select value={sel} onChange={e => setSel(e.target.value)} style={{ width: '100%', padding: 12, margin: '6px 0', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }}>
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
          <input placeholder="Немесе өз категорияңызды жазыңыз" value={custom} onChange={e => setCustom(e.target.value)} style={{ width: '100%', padding: 12, margin: '6px 0', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <input type="number" placeholder="Қанша жұмсадыңыз?" value={amount} onChange={e => setAmount(e.target.value)} required style={{ width: '100%', padding: 12, margin: '6px 0', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <input placeholder="Ескертпе (міндетті емес)" value={note} onChange={e => setNote(e.target.value)} style={{ width: '100%', padding: 12, margin: '6px 0', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={{ width: '100%', padding: 12, margin: '6px 0', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: 12, background: '#3498db', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', marginTop: 6 }}>Шығынды тіркеу</button>
        </form>
      </div>

      <div style={{ background: '#fff', padding: 22, borderRadius: 15, boxShadow: '0 4px 15px rgba(0,0,0,.05)' }}>
        <h3 style={{ margin: '0 0 12px' }}>Шығындар тарихы</h3>
        <input type="month" value={month} onChange={e => e.target.value && setMonth(e.target.value)} style={{ width: '100%', padding: 12, margin: '0 0 12px', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {list.length === 0 && <li style={{ color: '#8a949a', padding: '6px 0' }}>Шығын жоқ</li>}
          {list.map(x => (
            <li key={x.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <span>
                <strong>{x.category}</strong> <small style={{ color: '#8a949a' }}>({x.date})</small>
                {x.note && <><br /><small style={{ color: '#8a949a' }}>{x.note}</small></>}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <strong style={{ color: '#e74c3c' }}>- {fmt(x.amount)} {CUR}</strong>
                <button onClick={() => del(x.id)} style={{ background: 'transparent', border: '1px solid #e6ebee', color: '#8a949a', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}>✕</button>
              </div>
            </li>
          ))}
        </ul>
        {list.length > 0 && (
          <button onClick={clear} style={{ width: '100%', padding: 12, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', marginTop: 16 }}>Барлығын тазалау</button>
        )}
      </div>
    </>
  );
}