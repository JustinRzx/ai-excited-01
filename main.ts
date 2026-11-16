/*
 ai-excited-01: Make the AI judge excited
 Image: baby golden dragon hatching from a golden egg on a floating island
 1024x1024, 444,716 bytes
 This program copies the curated `entry.png` (bundled beside this script)
 to the runtime output directory atomically, then verifies the copy bytes.
 Exits with code 5 on any mismatch.
*/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main(): Promise<void> {
  console.log('ai-excited-01: starting copy at', new Date().toISOString());

  const src = path.join(__dirname, 'entry.png');
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
  const dest = path.join(outDir, 'entry.png');

  // Ensure output directory exists
  await fs.promises.mkdir(outDir, { recursive: true });

  // Read the source bytes (the curated image bundled with the repo)
  const srcBuf = await fs.promises.readFile(src);

  // Write atomically to a temp file in the same directory, fsync, then rename
  const tmp = dest + '.tmp-' + crypto.randomBytes(8).toString('hex');

  // Use synchronous fd operations to ensure fsync is available and straightforward
  const fd = fs.openSync(tmp, 'w');
  try {
    fs.writeSync(fd, srcBuf, 0, srcBuf.length, null as unknown as number | null);
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }

  fs.renameSync(tmp, dest);

  // Verify the written file bytes exactly match the source
  const got = await fs.promises.readFile(dest);
  if (!srcBuf.equals(got)) {
    console.error('ERROR: byte mismatch after copy');
    process.exit(5);
  }

  console.log('Wrote', dest, '(', srcBuf.length, 'bytes )');
}

main().catch((err) => {
  console.error('UNCAUGHT ERROR:', err && (err.stack || err));
  process.exit(2);
});
