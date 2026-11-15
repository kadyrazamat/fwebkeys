export const DEFAULT_CATS = ['Тамақ', 'Көлік', 'Ойын-сауық', 'Тұрмыс'];
export const CUR = '₸';

export const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};

export const fmt = n => Math.round(n || 0).toLocaleString('ru-RU');
export const pad = n => String(n).padStart(2, '0');
export const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
export const monthOf = s => s.slice(0, 7);
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export async function hashPw(pw) {
  const s = 'pkeys:' + pw;
  try {
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {}
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return 'f' + h;
}