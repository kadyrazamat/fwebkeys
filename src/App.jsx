import React, { useState } from 'react';
import { store } from './store';
import UserForm from './components/UserForm';
import Cabinet from './pages/Cabinet';

export default function App() {
  const [user, setUser] = useState(() => {
    const id = store.get('pk_session', null);
    return store.get('pk_users', []).find(u => u.id === id) || null;
  });

  const login = (u) => { store.set('pk_session', u.id); setUser(u); };
  const logout = () => { store.del('pk_session'); setUser(null); };
  const remove = () => {
    store.set('pk_users', store.get('pk_users', []).filter(u => u.id !== user.id));
    store.del('pk_data_' + user.id);
    logout();
  };

  if (!user) return <UserForm onAuth={login} />;
  return <Cabinet key={user.id} user={user} setUser={setUser} onLogout={logout} onDelete={remove} />;
}