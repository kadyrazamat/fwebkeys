import React, { useState } from 'react';
import { uid } from '../store';
import GoalCard from './GoalCard';

export default function Goals({ data, setData }) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');

  const add = (e) => {
    e.preventDefault();
    const t = parseFloat(target);
    if (!name.trim() || !t || t <= 0) return;
    setData(d => ({ ...d, goals: [...d.goals, { id: uid(), name: name.trim(), target: t, saved: 0, deadline, history: [] }] }));
    setName(''); setTarget(''); setDeadline('');
  };

  return (
    <>
      <div style={{ background: '#fff', padding: 22, borderRadius: 15, boxShadow: '0 4px 15px rgba(0,0,0,.05)', marginBottom: 18 }}>
        <h3>Жаңа мақсат</h3>
        <form onSubmit={add}>
          <input placeholder="Мақсат атауы (мыс. Ноутбук)" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: 12, margin: '6px 0', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <input type="number" placeholder="Қажетті сома" value={target} onChange={e => setTarget(e.target.value)} required style={{ width: '100%', padding: 12, margin: '6px 0', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={{ width: '100%', padding: 12, margin: '6px 0', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <small style={{ color: '#8a949a', display: 'block', margin: '4px 0 8px' }}>Мерзімді көрсетсеңіз, күніне қанша жинау керегін есептеймін</small>
          <button type="submit" style={{ width: '100%', padding: 12, background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Мақсат қосу</button>
        </form>
      </div>

      <div style={{ background: '#fff', padding: 22, borderRadius: 15, boxShadow: '0 4px 15px rgba(0,0,0,.05)' }}>
        <h3>Менің мақсаттарым</h3>
        {data.goals.length === 0 && <p style={{ color: '#8a949a' }}>Әзірге мақсат жоқ</p>}
        {data.goals.map(g => (
          <GoalCard key={g.id} goal={g}
            onDeposit={a => {
              const nowStr = new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
              setData(d => ({ 
                ...d, 
                goals: d.goals.map(x => x.id === g.id ? { 
                  ...x, 
                  saved: x.saved + a, 
                  history: [{ amount: a, date: nowStr }, ...(x.history || [])] 
                } : x) 
              }));
            }}
            onDelete={() => setData(d => ({ ...d, goals: d.goals.filter(x => x.id !== g.id) }))} />
        ))}
      </div>
    </>
  );
}