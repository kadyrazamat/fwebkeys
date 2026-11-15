import React, { useState } from 'react';
import { CUR, fmt, todayStr, monthOf } from '../store';

export default function Dashboard({ data, setData, month, setMonth, cats }) {
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('add');
  const [limCat, setLimCat] = useState(cats[0]);
  const [limAmt, setLimAmt] = useState('');

  const monthExp = data.expenses.filter(e => monthOf(e.date) === month);
  const spent = monthExp.reduce((s, e) => s + e.amount, 0);
  const remaining = data.budget - spent;

  const isCurrent = month === todayStr().slice(0, 7);
  const [y, m] = month.split('-').map(Number);
  const dim = new Date(y, m, 0).getDate();
  const day = isCurrent ? new Date().getDate() : dim;
  const forecast = isCurrent ? (spent / day) * dim : spent;

  const byCat = {};
  monthExp.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + e.amount; });

  let score = null;
  if (data.budget > 0) {
    const ratio = forecast / data.budget;
    const pace = ratio <= 0.8 ? 100 : ratio >= 1.3 ? 0 : 100 - ((ratio - 0.8) / 0.5) * 100;
    const limited = Object.keys(data.limits);
    const ok = limited.length ? limited.filter(c => (byCat[c] || 0) <= data.limits[c]).length / limited.length * 100 : 100;
    score = Math.round(pace * 0.7 + ok * 0.3);
  }
  const scoreText = score === null ? 'Бағалау үшін бюджет орнатыңыз' :
    score >= 70 ? 'Тамаша! Бюджет бақылауда' : score >= 40 ? 'Абай болыңыз, шығын жылдам өсіп жатыр' : 'Қауіпті: бюджеттен асу мүмкін';

  const submitBudget = (e) => {
    e.preventDefault();
    const a = parseFloat(amount);
    if (!a || a < 0) return;
    setData(d => ({ ...d, budget: mode === 'add' ? d.budget + a : a }));
    setAmount('');
  };

  const submitLimit = (e) => {
    e.preventDefault();
    const a = parseFloat(limAmt);
    if (!a || a <= 0) return;
    setData(d => ({ ...d, limits: { ...d.limits, [limCat]: a } }));
    setLimAmt('');
  };

  const removeLimit = (c) => setData(d => { const l = { ...d.limits }; delete l[c]; return { ...d, limits: l }; });

  return (
    <>
      <div style={{ background: '#fff', padding: 22, borderRadius: 15, boxShadow: '0 4px 15px rgba(0,0,0,.05)', marginBottom: 18 }}>
        <h2>Айлық бюджет: {fmt(data.budget)} {CUR}</h2>
        <div style={{ display: 'flex', gap: 10, margin: '12px 0' }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '12px 8px', borderRadius: 10, background: '#ffe9e9', color: '#d63031' }}>
            <small style={{ color: '#8a949a' }}>Жұмсалды</small>
            <strong style={{ fontSize: 18, display: 'block', marginTop: 4 }}>{fmt(spent)} {CUR}</strong>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '12px 8px', borderRadius: 10, background: '#e3fcef', color: '#27ae60' }}>
            <small style={{ color: '#8a949a' }}>Қалды</small>
            <strong style={{ fontSize: 18, display: 'block', marginTop: 4 }}>{fmt(remaining)} {CUR}</strong>
          </div>
        </div>
        <form onSubmit={submitBudget}>
          <input type="number" placeholder="Сома" value={amount} onChange={e => setAmount(e.target.value)} required style={{ width: '100%', padding: 12, margin: '6px 0', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <select value={mode} onChange={e => setMode(e.target.value)} style={{ width: '100%', padding: 12, margin: '6px 0', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }}>
            <option value="add">Бюджетке қосу (+)</option>
            <option value="update">Жаңа бюджет орнату</option>
          </select>
          <button type="submit" style={{ width: '100%', padding: 12, background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', marginTop: 6 }}>Бюджетті жаңарту</button>
        </form>
      </div>

      <div style={{ background: '#fff', padding: 22, borderRadius: 15, boxShadow: '0 4px 15px rgba(0,0,0,.05)', marginBottom: 18 }}>
        <h3 style={{ margin: '0 0 12px' }}>🧠 Ақылды болжам</h3>
        <div style={{ marginBottom: 10 }}>
          <strong>Қаржылық денсаулық</strong>
          <div style={{ color: '#8a949a', fontSize: 14 }}>{scoreText}</div>
        </div>
        <div style={{ textAlign: 'center', padding: '12px 8px', borderRadius: 10, background: '#eaf4fd', color: '#2574a9', marginBottom: 10 }}>
          <small>Ай соңындағы болжам</small>
          <strong style={{ fontSize: 18, display: 'block', marginTop: 4 }}>{fmt(forecast)} {CUR}</strong>
        </div>
        {data.savedByWaiting > 0 && (
          <div style={{ padding: '10px 14px', borderRadius: 10, background: '#e3fcef', color: '#1e8449', fontSize: 14 }}>
            ⏳ «24 сағат ережесі» арқасында үнемделді: <strong>{fmt(data.savedByWaiting)} {CUR}</strong>
          </div>
        )}
      </div>

      <div style={{ background: '#fff', padding: 22, borderRadius: 15, boxShadow: '0 4px 15px rgba(0,0,0,.05)', marginBottom: 18 }}>
        <h3 style={{ margin: '0 0 12px' }}>Айлық есеп</h3>
        <input type="month" value={month} onChange={e => e.target.value && setMonth(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', marginBottom: 10, boxSizing: 'border-box' }} />
        {monthExp.length === 0 ? (
          <p style={{ color: '#8a949a', margin: 0 }}>Бұл айда шығын жоқ</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {monthExp.map(x => (
              <li key={x.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span>{x.category} ({x.date})</span>
                <strong>- {fmt(x.amount)} {CUR}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ background: '#fff', padding: 22, borderRadius: 15, boxShadow: '0 4px 15px rgba(0,0,0,.05)' }}>
        <h3 style={{ margin: '0 0 12px' }}>Категория лимиттері</h3>
        <form onSubmit={submitLimit} style={{ display: 'flex', gap: 10 }}>
          <select value={limCat} onChange={e => setLimCat(e.target.value)} style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }}>
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
          <input type="number" placeholder="Лимит" value={limAmt} onChange={e => setLimAmt(e.target.value)} style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <button type="submit" style={{ flex: '0 0 80px', background: '#3498db', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Қою</button>
        </form>
        <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0' }}>
          {Object.keys(data.limits).length === 0 && <li style={{ color: '#8a949a' }}>Лимит қойылмаған</li>}
          {Object.keys(data.limits).map(c => {
            const lim = data.limits[c], used = byCat[c] || 0, p = Math.min(100, used / lim * 100);
            return (
              <li key={c} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{c}: {fmt(used)} / {fmt(lim)} {CUR}</span>
                  <button onClick={() => removeLimit(c)} style={{ background: 'transparent', border: '1px solid #e6ebee', color: '#8a949a', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}>✕</button>
                </div>
                <div style={{ height: 8, background: '#edf1f2', borderRadius: 6, overflow: 'hidden', marginTop: 6 }}>
                  <div style={{ height: '100%', width: p + '%', background: used > lim ? '#e74c3c' : '#2ecc71' }} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}