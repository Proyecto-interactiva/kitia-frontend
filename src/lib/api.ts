import type { LogEntry, RagQuery, RagResult } from './types';
async function http<T>(url: string, init?: RequestInit): Promise<T> {
    const r = await fetch(url, init);
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return r.json() as Promise<T>;
}
export const getLogs = () => http<LogEntry[]>('/api/logs');
export const createLog = (d: LogEntry) =>
    http<LogEntry>('/api/logs', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(d) });
export const updateLog = (id: string, d: Partial<LogEntry>) =>
    http<LogEntry>(`/api/logs/${id}`, { method:'PUT', headers:{'content-type':'application/json'}, body:JSON.stringify(d) });
export const deleteLog = (id: string) =>
    http<{ ok: boolean }>(`/api/logs/${id}`, { method:'DELETE' });
export const ragSearch = (p: RagQuery) =>
    http<RagResult[]>('/api/rag/search', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(p) });
export const getAudit = () => http<any[]>('/api/audit');
