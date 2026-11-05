'use client';

import { useState } from 'react';

interface DevinTask {
  id: string;
  repo: string;
  task: string;
  requestedBy: string | null;
  status: string;
  summary: string | null;
  prUrl: string | null;
  sessionUrl: string | null;
  createdAt: string;
  completedAt: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  queued: 'bg-yellow-500/15 text-yellow-300',
  completed: 'bg-green-500/15 text-green-300',
  failed: 'bg-red-500/15 text-red-300',
  dispatch_failed: 'bg-red-500/15 text-red-300',
};

export default function DevinTasks() {
  const [key, setKey] = useState('');
  const [tasks, setTasks] = useState<DevinTask[] | null>(null);
  const [repos, setRepos] = useState<string[]>([]);
  const [form, setForm] = useState({ repo: '', task: '', requested_by: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const load = async () => {
    const res = await fetch('/api/devin-task', { headers: { 'x-admin-key': key } });
    if (!res.ok) {
      setError(res.status === 401 ? 'Wrong admin key' : 'Unable to load tasks');
      return;
    }
    const data = await res.json();
    setError('');
    setTasks(data.tasks);
    setRepos(data.repos);
    setForm((f) => ({ ...f, repo: f.repo || data.repos[0] || '' }));
  };

  const submit = async () => {
    setSending(true);
    const res = await fetch('/api/devin-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
      body: JSON.stringify(form),
    });
    setSending(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Unable to send task');
    } else {
      setError('');
      setForm({ ...form, task: '' });
    }
    load();
  };

  if (!tasks) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm p-8 rounded-2xl bg-brand-800/60 border border-white/10">
          <h1 className="text-2xl font-bold mb-1">Devin Tasks</h1>
          <p className="text-sm text-gray-400 mb-6">Enter admin key to send tasks to Devin.</p>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder="Admin key"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white mb-3 outline-none focus:border-brand-accent"
          />
          {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
          <button onClick={load} className="w-full py-3 rounded-lg bg-brand-accent text-brand-900 font-bold">
            Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold">Devin Tasks</h1>
        <button onClick={load} className="px-4 py-2 rounded-lg bg-white/10 text-sm">Refresh</button>
      </div>

      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 mb-10">
        <h2 className="font-bold mb-4">New Task</h2>
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <select
              value={form.repo}
              onChange={(e) => setForm({ ...form, repo: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
            >
              {repos.map((r) => (
                <option key={r} value={r} className="bg-brand-800">{r}</option>
              ))}
            </select>
            <input
              value={form.requested_by}
              onChange={(e) => setForm({ ...form, requested_by: e.target.value })}
              placeholder="Requested by (optional)"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
            />
          </div>
          <textarea
            value={form.task}
            onChange={(e) => setForm({ ...form, task: e.target.value })}
            placeholder="Describe the task for Devin"
            rows={4}
            maxLength={4000}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            onClick={submit}
            disabled={sending || !form.task.trim()}
            className="px-6 py-2.5 rounded-lg bg-brand-accent text-brand-900 font-bold disabled:opacity-50"
          >
            {sending ? 'Sending…' : 'Send to Devin'}
          </button>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 overflow-x-auto">
        <h2 className="font-bold mb-4">Recent Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500">No tasks yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs uppercase text-left">
                <th className="pb-2 pr-4">Task</th>
                <th className="pb-2 pr-4">Repo</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} className="border-t border-white/5 align-top">
                  <td className="py-3 pr-4 max-w-xs">
                    <p className="whitespace-pre-wrap break-words">{t.task}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(t.createdAt).toLocaleString()}
                      {t.requestedBy ? ` · ${t.requestedBy}` : ''}
                    </p>
                  </td>
                  <td className="py-3 pr-4 text-gray-400">{t.repo}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 rounded-md text-xs ${STATUS_STYLES[t.status] ?? 'bg-white/10'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 max-w-sm">
                    {t.summary && <p className="text-gray-300 whitespace-pre-wrap break-words mb-1">{t.summary}</p>}
                    <div className="flex gap-3 text-xs">
                      {t.prUrl && <a href={t.prUrl} target="_blank" rel="noreferrer" className="text-brand-accent">PR</a>}
                      {t.sessionUrl && <a href={t.sessionUrl} target="_blank" rel="noreferrer" className="text-brand-accent">Devin session</a>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
