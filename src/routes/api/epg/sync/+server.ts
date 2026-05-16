// POST /api/epg/sync[?id=N]
// Manually triggers EPG sync from the admin panel.
// Spawns ../../scripts/sync-epg.cjs (or GITHUB_TOKEN-based workflow dispatch).

import { json } from '@sveltejs/kit';
import { execFile } from 'node:child_process';
import { resolve } from 'node:path';
import { cwd } from 'node:process';
import type { RequestHandler } from './$types';

const SYNC_SCRIPT = resolve(cwd(), '..', '..', 'scripts', 'sync-epg.cjs');
const OUT_DIR = resolve(cwd(), '..', '..', 'static', 'tvpl');

function runScript(id?: string): Promise<{ stdout: string; stderr: string; code: number }> {
  const args = ['--out=' + OUT_DIR];
  if (id) args.push('--id=' + id);

  return new Promise((resolve) => {
    const child = execFile('node', [SYNC_SCRIPT, ...args], {
      timeout: 300_000,
      maxBuffer: 1024 * 1024,
      env: { ...process.env },
    });

    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (d) => (stdout += d));
    child.stderr?.on('data', (d) => (stderr += d));

    child.on('close', (code) => {
      resolve({ stdout, stderr, code: code ?? 1 });
    });

    child.on('error', (err) => {
      resolve({ stdout, stderr: err.message, code: 1 });
    });
  });
}

export const POST: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id') || undefined;
  console.log(`[epg-sync] Triggered${id ? ` --id=${id}` : ' (all)'}`);

  try {
    const { stdout, stderr, code } = await runScript(id);
    if (code !== 0) {
      console.error(`[epg-sync] Failed (code ${code})\n${stderr}`);
      return json({ ok: false, error: stderr.trim() || `exit code ${code}`, output: stdout.trim() }, { status: 500 });
    }
    console.log('[epg-sync] OK');
    return json({ ok: true, output: stdout.trim() });
  } catch (err) {
    console.error('[epg-sync] Exception:', err);
    return json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
};
