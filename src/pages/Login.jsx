import { useState } from 'react';
import { AlertCircle, ArrowRight, Eye, EyeOff, Gamepad2, Info, Lock, Mail, Play, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { DEMO_ACCOUNT, useAuth } from '../context/AuthContext.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(email, password) {
  const errors = {};
  if (!email.trim()) errors.email = 'Enter your email address.';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email, like name@example.com.';
  if (!password) errors.password = 'Enter your password.';
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
  return errors;
}

export default function Login() {
  const { signIn, exploreDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const found = validate(email, password);
    setErrors(found);
    if (Object.keys(found).length) return;
    setLoading(true);
    const res = await signIn(email, password);
    setLoading(false);
    if (!res.ok) setFormError(res.error);
    // Password state is cleared either way; it is never persisted.
    setPassword('');
  };

  const fillDemo = () => {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    setErrors({});
    setFormError('');
  };

  return (
    <main className="login">
      <div className="login__glow login__glow--a" aria-hidden="true" />
      <div className="login__glow login__glow--b" aria-hidden="true" />

      <div className="login__card">
        <div className="login__hero" aria-hidden="true">
          <Gamepad2 className="login__pad" />
        </div>
        <Logo size="lg" tagline />

        <div className="login__panel">
          <h1 className="login__title">Welcome <span>Back</span></h1>
          <p className="login__sub">Sign in to continue to PlayZone</p>

          <form onSubmit={onSubmit} noValidate>
            <div className={`field${errors.email ? ' has-error' : ''}`}>
              <label htmlFor="email">Email address</label>
              <div className="field__box">
                <Mail aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-err' : undefined}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="field__error" id="email-err"><AlertCircle aria-hidden="true" /> {errors.email}</p>}
            </div>

            <div className={`field${errors.password ? ' has-error' : ''}`}>
              <label htmlFor="password">Password</label>
              <div className="field__box">
                <Lock aria-hidden="true" />
                <input
                  id="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-err' : undefined}
                  placeholder="Your password"
                />
                <button type="button" className="field__toggle" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
                  {show ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && <p className="field__error" id="password-err"><AlertCircle aria-hidden="true" /> {errors.password}</p>}
            </div>

            <div className="login__row">
              <label className="check">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span>Remember me</span>
              </label>
              <button type="button" className="link-btn" onClick={() => setFormError('Password reset is not available in this demo.')}>
                Forgot password?
              </button>
            </div>

            {formError && <p className="form-error" role="alert"><AlertCircle aria-hidden="true" /> {formError}</p>}

            <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={loading}>
              {loading ? (<><Loader2 className="spin" aria-hidden="true" /> Signing in...</>) : (<><ArrowRight aria-hidden="true" /> Sign In</>)}
            </button>
          </form>

          <div className="divider"><span>OR</span></div>

          <button type="button" className="btn btn--outline btn--block btn--demo" onClick={exploreDemo}>
            <Play aria-hidden="true" />
            <span><strong>Explore Demo</strong><small>Try without login</small></span>
          </button>

          <div className="demo-note" role="note">
            <Info aria-hidden="true" />
            <p>
              Simulated sign-in for demonstration. Demo account: <code>{DEMO_ACCOUNT.email}</code> / <code>{DEMO_ACCOUNT.password}</code>{' '}
              <button type="button" className="link-btn" onClick={fillDemo}>Fill in for me</button>
            </p>
          </div>
        </div>

        <ul className="trust">
          <li><ShieldCheck aria-hidden="true" /><span>100% Safe<br />Demo Only</span></li>
          <li><Zap aria-hidden="true" /><span>Popular<br />Games</span></li>
          <li><Gamepad2 aria-hidden="true" /><span>No Real<br />Money Involved</span></li>
        </ul>
      </div>
    </main>
  );
}
