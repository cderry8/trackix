'use client';

import { useAuth } from '@/features/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Shield,
  Smartphone,
  User,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = ['Account', 'Contact', 'Banks', 'Source'];

const BANKS = [
  { id: 'bk', name: 'Bank of Kigali', icon: Building2 },
  { id: 'bpr', name: 'BPR Bank', icon: Building2 },
  { id: 'im', name: 'I&M Bank', icon: Building2 },
  { id: 'equity', name: 'Equity Bank', icon: Building2 },
  { id: 'cogebanque', name: 'COGEBANQUE', icon: Building2 },
  { id: 'gt', name: 'GTBank', icon: Building2 },
  { id: 'access', name: 'Access Bank', icon: Building2 },
  { id: 'kcb', name: 'KCB Rwanda', icon: Building2 },
];

const SOURCES = [
  { id: 'social_media', label: 'Social Media', icon: Smartphone },
  { id: 'friend', label: 'Friend or Family', icon: Users },
  { id: 'google', label: 'Google Search', icon: Search },
  { id: 'advertisement', label: 'Advertisement', icon: MessageCircle },
  { id: 'other', label: 'Other', icon: Users },
];

export default function RegisterPage() {
  const { register, user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    bankAccounts: [] as string[],
    heardFrom: '',
  });

  // UI state
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace('/dashboard');
  }, [authLoading, user, router]);

  const validateStep = () => {
    setError('');
    if (step === 0) {
      if (!formData.name.trim()) return setError('Please enter your name');
      if (!formData.email.trim()) return setError('Please enter your email');
      if (!formData.password || formData.password.length < 8) return setError('Password must be at least 8 characters');
    }
    if (step === 1) {
      if (!formData.phoneNumber.trim()) return setError('Please enter your phone number');
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const toggleBank = (bankId: string) => {
    setFormData((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.includes(bankId)
        ? prev.bankAccounts.filter((id) => id !== bankId)
        : [...prev.bankAccounts, bankId],
    }));
  };

  const submit = async () => {
    setError('');
    if (!formData.heardFrom) {
      setError('Please select how you heard about us');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        bankAccounts: formData.bankAccounts,
        heardFrom: formData.heardFrom,
      });
      setCompleted(true);
      setTimeout(() => router.replace('/dashboard'), 1500);
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data
          ? String((err.response.data as { message?: string }).message)
          : 'Registration failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    if (checks.length) score++;
    if (checks.lowercase && checks.uppercase) score++;
    if (checks.number) score++;
    if (checks.special) score++;

    return { score, checks };
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  if (completed) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <motion.div
          className="glass-panel w-full max-w-md p-10 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20"
          >
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </motion.div>
          <h1 className="mt-6 text-2xl font-semibold">Welcome aboard!</h1>
          <p className="mt-2 text-ink-muted">Your account has been created successfully.</p>
          <p className="mt-4 text-sm text-ink-muted">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        className="glass-panel w-full max-w-lg p-6 sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href={step === 0 ? '/' : '#'}
            onClick={step > 0 ? (e) => { e.preventDefault(); prevStep(); } : undefined}
            className="flex items-center gap-1 text-xs text-ink-muted transition hover:text-ink"
          >
            <ArrowLeft className="h-3 w-3" />
            {step === 0 ? 'Back to home' : 'Previous step'}
          </Link>
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-ink-muted">
            Step {step + 1} of {STEPS.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
          <motion.div
            className="h-full rounded-full bg-accent-dim dark:bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step indicators */}
        <div className="mt-4 flex justify-between">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={cn(
                'flex flex-col items-center gap-1',
                i === step ? 'text-accent-dim dark:text-accent' : 'text-ink-muted'
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition',
                  i < step
                    ? 'bg-green-500/20 text-green-500'
                    : i === step
                      ? 'bg-accent-dim text-white dark:bg-accent dark:text-black'
                      : 'bg-ink/10 text-ink-muted dark:bg-white/10'
                )}
              >
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className="hidden text-[10px] uppercase tracking-wider sm:block">{s}</span>
            </div>
          ))}
        </div>

        {/* Error */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-500"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && (
              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold">Create your account</h1>
                  <p className="mt-1 text-sm text-ink-muted">Let&apos;s start with the basics</p>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium">Full Name</span>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                      <input
                        type="text"
                        className="w-full rounded-xl border border-ink/15 bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent dark:border-white/15"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium">Email Address</span>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                      <input
                        type="email"
                        className="w-full rounded-xl border border-ink/15 bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent dark:border-white/15"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium">Password</span>
                    <div className="relative mt-1">
                      <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full rounded-xl border border-ink/15 bg-transparent py-2.5 pl-10 pr-10 text-sm outline-none focus:border-accent dark:border-white/15"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition hover:text-ink"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 space-y-2"
                      >
                        {/* Strength bars */}
                        <div className="flex gap-1">
                          {[0, 1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={cn(
                                'h-1.5 flex-1 rounded-full transition-all duration-300',
                                i < passwordStrength.score
                                  ? strengthColors[passwordStrength.score - 1]
                                  : 'bg-ink/10 dark:bg-white/10'
                              )}
                            />
                          ))}
                        </div>

                        {/* Strength label */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-ink-muted">
                            Strength: <span className={cn(
                              passwordStrength.score >= 3 ? 'text-green-500' :
                              passwordStrength.score >= 2 ? 'text-blue-500' :
                              passwordStrength.score >= 1 ? 'text-yellow-500' : 'text-red-500'
                            )}>
                              {passwordStrength.score > 0 ? strengthLabels[passwordStrength.score - 1] : 'Very Weak'}
                            </span>
                          </span>
                        </div>

                        {/* Requirements checklist */}
                        <div className="space-y-1 pt-1">
                          {[
                            { key: 'length', label: 'At least 8 characters' },
                            { key: 'lowercase', label: 'One lowercase letter (a-z)' },
                            { key: 'uppercase', label: 'One uppercase letter (A-Z)' },
                            { key: 'number', label: 'One number (0-9)' },
                            { key: 'special', label: 'One special character (!@#$...)' },
                          ].map((req) => {
                            const met = passwordStrength.checks[req.key as keyof typeof passwordStrength.checks];
                            return (
                              <div key={req.key} className="flex items-center gap-2 text-xs">
                                <div className={cn(
                                  'flex h-4 w-4 items-center justify-center rounded-full transition',
                                  met ? 'bg-green-500/20 text-green-500' : 'bg-ink/10 text-ink-muted'
                                )}>
                                  {met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                </div>
                                <span className={cn('transition', met ? 'text-ink' : 'text-ink-muted')}>
                                  {req.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </label>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold">Contact Information</h1>
                  <p className="mt-1 text-sm text-ink-muted">How can we reach you?</p>
                </div>

                <label className="block">
                  <span className="text-sm font-medium">Phone Number</span>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                    <input
                      type="tel"
                      className="w-full rounded-xl border border-ink/15 bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent dark:border-white/15"
                      placeholder="+250 78X XXX XXX"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">
                    Used for account recovery and important notifications
                  </p>
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold">Connect Your Banks</h1>
                  <p className="mt-1 text-sm text-ink-muted">
                    Select banks you have accounts with (optional)
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {BANKS.map((bank) => {
                    const selected = formData.bankAccounts.includes(bank.id);
                    return (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => toggleBank(bank.id)}
                        className={cn(
                          'flex items-center gap-3 rounded-xl border p-3 transition',
                          selected
                            ? 'border-accent-dim bg-accent-dim/10 dark:border-accent dark:bg-accent/10'
                            : 'border-ink/10 hover:border-ink/20 dark:border-white/10 dark:hover:border-white/20'
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-lg',
                            selected
                              ? 'bg-accent-dim text-white dark:bg-accent dark:text-black'
                              : 'bg-ink/5 dark:bg-white/5'
                          )}
                        >
                          <bank.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">{bank.name}</div>
                        </div>
                        {selected && <CheckCircle2 className="h-5 w-5 text-accent-dim dark:text-accent" />}
                      </button>
                    );
                  })}
                </div>

                <p className="text-center text-xs text-ink-muted">
                  These are simulated connections for demo purposes
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold">How did you hear about us?</h1>
                  <p className="mt-1 text-sm text-ink-muted">Help us understand our reach</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {SOURCES.map((source) => {
                    const selected = formData.heardFrom === source.id;
                    return (
                      <button
                        key={source.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, heardFrom: source.id })}
                        className={cn(
                          'flex items-center gap-3 rounded-xl border p-4 transition',
                          selected
                            ? 'border-accent-dim bg-accent-dim/10 dark:border-accent dark:bg-accent/10'
                            : 'border-ink/10 hover:border-ink/20 dark:border-white/10 dark:hover:border-white/20'
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-lg',
                            selected
                              ? 'bg-accent-dim text-white dark:bg-accent dark:text-black'
                              : 'bg-ink/5 dark:bg-white/5'
                          )}
                        >
                          <source.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">{source.label}</div>
                        </div>
                        {selected && <CheckCircle2 className="h-5 w-5 text-accent-dim dark:text-accent" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="mt-8 flex gap-3">
          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="ml-auto"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={submit}
              loading={isLoading}
              className="ml-auto"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Login link */}
        {step === 0 && (
          <p className="mt-6 text-center text-sm text-ink-muted">
            Already have an account?{' '}
            <Link href="/login" className="text-accent-dim underline-offset-4 hover:underline dark:text-accent">
              Sign in
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
