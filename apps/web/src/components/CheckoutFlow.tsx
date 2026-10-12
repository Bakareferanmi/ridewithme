'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { motionTokens } from '@rwm/tokens';
import {
  checkoutSchema,
  fieldErrors,
  findVehicle,
  formatNaira,
  modeLabel,
  orderAmount,
  termsSchema,
  vehicleName,
  type ListingMode,
  type Order,
  type PaymentMethod,
} from '@rwm/shared';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Icon } from './Icon';
import { AnimatedCheck } from './motion';
import { useSession, useToast } from './Providers';
import { EmptyState } from './StateViews';
import { VehiclePhoto } from './VehiclePhoto';

const steps = ['Details', 'Payment', 'Review'];
const methods: { id: PaymentMethod; title: string; body: string; icon: 'payment' | 'wallet' | 'download' }[] = [
  { id: 'card', title: 'Debit or credit card', body: 'Pay securely online', icon: 'payment' },
  { id: 'transfer', title: 'Bank transfer', body: 'Pay from any bank app', icon: 'download' },
  { id: 'wallet', title: 'RideWithMe wallet', body: 'Use your wallet balance', icon: 'wallet' },
];
const isMode = (v: string | null): v is ListingMode => v === 'buy' || v === 'rent' || v === 'lease' || v === 'auction';

export function CheckoutFlow() {
  const params = useSearchParams();
  const { session } = useSession();
  const toast = useToast();
  const vehicle = findVehicle(params.get('vehicle') ?? '');
  const modeParam = params.get('mode');
  const mode: ListingMode = isMode(modeParam) ? modeParam : 'buy';
  const days = Math.max(1, Number(params.get('days')) || 1);
  const term = Number(params.get('term')) || 36;

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState({ fullName: session?.user.name ?? '', phone: '', email: session?.user.email ?? '', address: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [accepted, setAccepted] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  if (!vehicle) {
    return (
      <div className="container page">
        <EmptyState icon="car" title="Nothing to check out" body="Pick a vehicle first." action={<Link href="/vehicles" className="btn btn-primary btn-sm">Browse vehicles</Link>} />
      </div>
    );
  }

  const amount = orderAmount(vehicle, mode, { days });
  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const submitDetails = () => {
    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    go(1);
  };

  const placeOrder = async () => {
    const terms = termsSchema.safeParse({ accepted });
    if (!terms.success) return setTermsError(terms.error.issues[0]?.message ?? 'Please accept the terms');
    setTermsError(null);
    setBusy(true);
    try {
      const created = await api.orders.create({ vehicleId: vehicle.id, mode, amount, method, customer: form });
      setOrder(created);
      setDir(1);
      setStep(3);
    } catch (err) {
      toast.push(err instanceof Error ? err.message : 'Could not place your order', 'error');
    } finally {
      setBusy(false);
    }
  };

  const field = (key: keyof typeof form, label: string, props: { type?: string; placeholder?: string; autoComplete?: string } = {}) => (
    <div className="field">
      <label htmlFor={key}>{label}</label>
      <input
        id={key}
        className="input"
        value={form[key]}
        aria-invalid={Boolean(errors[key])}
        onChange={(e) => {
          setForm({ ...form, [key]: e.target.value });
          if (errors[key]) setErrors({ ...errors, [key]: '' });
        }}
        {...props}
      />
      {errors[key] ? (
        <span className="error-text" role="alert">
          <Icon name="alert" size={14} /> {errors[key]}
        </span>
      ) : null}
    </div>
  );

  return (
    <div className="container page checkout">
      {step < 3 ? (
        <div className="stepper-bar" aria-label={`Step ${step + 1} of 3`}>
          <div className="stepper-track">
            <motion.div className="stepper-fill" animate={{ width: `${((step + 1) / 3) * 100}%` }} transition={{ duration: 0.5, ease: motionTokens.ease }} />
          </div>
          <ol>
            {steps.map((s, i) => (
              <li key={s} className={i <= step ? 'is-done' : ''}>
                <span className="dot">{i < step ? <Icon name="check" size={14} strokeWidth={3} /> : i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <div className="checkout-grid">
        <div className="card card-pad checkout-main">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: dir * 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -32 }}
              transition={{ duration: 0.25, ease: motionTokens.ease }}
              className="stack"
            >
              {step === 0 ? (
                <>
                  <h1 className="t-h3">Your details</h1>
                  {field('fullName', 'Full name', { autoComplete: 'name' })}
                  <div className="two">
                    {field('phone', 'Phone number', { placeholder: '0801 234 5678', autoComplete: 'tel' })}
                    {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
                  </div>
                  {field('address', mode === 'rent' || mode === 'lease' ? 'Pickup or delivery address' : 'Delivery address', { autoComplete: 'street-address' })}
                  <button className="btn btn-primary btn-lg" onClick={submitDetails}>
                    Continue to payment <Icon name="arrowRight" size={18} strokeWidth={2.2} />
                  </button>
                </>
              ) : null}

              {step === 1 ? (
                <>
                  <h1 className="t-h3">Payment method</h1>
                  <div className="methods" role="radiogroup" aria-label="Payment method">
                    {methods.map((m) => (
                      <button key={m.id} type="button" role="radio" aria-checked={method === m.id} className={`method ${method === m.id ? 'is-active' : ''}`} onClick={() => setMethod(m.id)}>
                        {method === m.id ? <motion.span layoutId="method-ring" className="method-ring" transition={motionTokens.spring} /> : null}
                        <Icon name={m.icon} size={22} />
                        <span>
                          <span className="t-label">{m.title}</span>
                          <span className="muted t-caption">{m.body}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="row-actions">
                    <button className="btn btn-secondary" onClick={() => go(0)}>Back</button>
                    <button className="btn btn-primary btn-lg" onClick={() => go(2)}>Review order <Icon name="arrowRight" size={18} strokeWidth={2.2} /></button>
                  </div>
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <h1 className="t-h3">Review and confirm</h1>
                  <dl className="review">
                    <div><dt>Name</dt><dd>{form.fullName}</dd></div>
                    <div><dt>Contact</dt><dd>{form.phone} · {form.email}</dd></div>
                    <div><dt>Address</dt><dd>{form.address}</dd></div>
                    <div><dt>Payment</dt><dd>{methods.find((m) => m.id === method)?.title}</dd></div>
                  </dl>
                  <label className="check">
                    <input type="checkbox" checked={accepted} onChange={(e) => { setAccepted(e.target.checked); setTermsError(null); }} />
                    <span className="box">{accepted ? <Icon name="check" size={14} strokeWidth={3} /> : null}</span>
                    I agree to the terms and the inspection policy
                  </label>
                  {termsError ? <span className="error-text" role="alert"><Icon name="alert" size={14} /> {termsError}</span> : null}
                  <div className="row-actions">
                    <button className="btn btn-secondary" onClick={() => go(1)}>Back</button>
                    <button className="btn btn-primary btn-lg" onClick={placeOrder} disabled={busy}>
                      {busy ? <span className="spinner" /> : <Icon name="lock" size={18} />} Pay {formatNaira(amount)}
                    </button>
                  </div>
                </>
              ) : null}

              {step === 3 && order ? (
                <div className="success">
                  <AnimatedCheck />
                  <h1 className="t-h2">Order placed</h1>
                  <p className="muted">
                    Reference <strong style={{ color: 'var(--color-text)' }}>{order.id}</strong>. We will confirm your payment and start the final inspection.
                  </p>
                  <div className="row-actions center">
                    <Link href="/account" className="btn btn-primary btn-lg"><Icon name="route" size={18} /> Track order</Link>
                    <Link href="/vehicles" className="btn btn-secondary btn-lg">Keep browsing</Link>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="card card-pad summary">
          <div className="summary-media"><VehiclePhoto photo={vehicle.photos[0]} alt={vehicleName(vehicle)} width={480} size={48} /></div>
          <h2 className="t-title">{vehicleName(vehicle)}</h2>
          <p className="muted t-label">{modeLabel(mode)}{mode === 'rent' ? ` · ${days} day${days > 1 ? 's' : ''}` : mode === 'lease' ? ` · ${term} months` : ''}</p>
          <div className="summary-lines">
            <div><span className="muted">{mode === 'lease' ? 'First month' : mode === 'auction' ? 'Winning bid' : 'Price'}</span><span>{formatNaira(amount)}</span></div>
            <div><span className="muted">Inspection</span><span className="badge badge-success">Included</span></div>
            <div className="total-line"><span>Total today</span><span className="t-h3">{formatNaira(amount)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
