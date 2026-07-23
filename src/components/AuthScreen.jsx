import { useState } from 'react';

export default function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    if (mode === 'signup' && !form.name) return;
    onLogin({ ...form, mode });
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(circle at 30% 20%, #2a1a45 0, transparent 40%), radial-gradient(circle at 70% 80%, #2a1f10 0, transparent 35%), var(--pale)',
      padding: '1rem'
    }}>
      <div className="modal" style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔮</div>
        <h2 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>AstroEvalution</h2>
        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          {mode === 'login' ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label>Full Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" required />
            </div>
          )}
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" required />
          </div>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" required />
          </div>

          <button className="btn btn-primary btn-glow" type="submit" style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: '#888' }}>
          {mode === 'login' ? (
            <>Don't have an account?{' '}<span style={{ color: 'var(--purple)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setMode('signup')}>Sign up</span></>
          ) : (
            <>Already have an account?{' '}<span style={{ color: 'var(--purple)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setMode('login')}>Sign in</span></>
          )}
        </div>

        <hr className="section-divider" />
        <p style={{ fontSize: '0.72rem', color: '#666' }}>
          Demo: use any email/password to continue
        </p>
      </div>
    </div>
  );
}
