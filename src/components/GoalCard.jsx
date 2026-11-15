import React, { useState } from 'react';
import { CUR, fmt } from '../store';

export default function GoalCard({ goal, onDeposit, onDelete }) {
  const [add, setAdd] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const p = Math.min(100, (goal.saved / goal.target) * 100);
  
  let hint = null;
  if (goal.deadline && goal.saved < goal.target) {
    const days = Math.ceil((new Date(goal.deadline + 'T23:59:59') - new Date()) / 86400000);
    hint = days > 0
      ? `Мерзімге жету үшін күніне ${fmt((goal.target - goal.saved) / days)} ${CUR} жинаңыз (${days} күн)`
      : 'Мерзім өтіп кетті';
  }

  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{goal.saved >= goal.target ? '🎉 ' : '🎯 '}{goal.name}</strong>
        <button onClick={onDelete} style={{ background: 'transparent', border: '1px solid #e6ebee', color: '#8a949a', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}>✕</button>
      </div>
      <div style={{ color: '#8a949a', fontSize: 14, margin: '4px 0' }}>{fmt(goal.saved)} / {fmt(goal.target)} {CUR} ({Math.round(p)}%)</div>
      <div style={{ height: 8, background: '#edf1f2', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: p + '%', background: '#2ecc71', transition: 'width .3s' }} />
      </div>
      {hint && <small style={{ color: '#8a949a', display: 'block', marginTop: 4 }}>{hint}</small>}
      
      <form onSubmit={e => { e.preventDefault(); const a = parseFloat(add); if (a > 0) { onDeposit(a); setAdd(''); } }} style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <input type="number" placeholder="Қосу сомасы" value={add} onChange={e => setAdd(e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ddd', boxSizing: 'border-box' }} />
        <button type="submit" style={{ padding: '8px 14px', background: '#3498db', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Салу</button>
      </form>

      <div style={{ marginTop: 8 }}>
        <button onClick={() => setShowHistory(!showHistory)} style={{ background: 'transparent', border: 'none', color: '#3498db', fontSize: 13, cursor: 'pointer', padding: 0, fontWeight: 600 }}>
          {showHistory ? '▲ Тарихты жасыру' : '▼ Қашан, қай уақытта салынғанын көру'}
        </button>

        {showHistory && (
          <div style={{ background: '#f8f9fa', padding: 10, borderRadius: 8, marginTop: 6, fontSize: 13, color: '#2d3436' }}>
            {(!goal.history || goal.history.length === 0) ? (
              <div style={{ color: '#8a949a' }}>Әзірге ақша салынмаған</div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {goal.history.map((h, idx) => (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: idx < goal.history.length - 1 ? '1px solid #eee' : 'none' }}>
                    <span>📅 {h.date}</span>
                    <strong style={{ color: '#27ae60' }}>+{fmt(h.amount)} {CUR}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}