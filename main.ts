// ai-excited-01: Make the AI judge excited
// Image: baby golden dragon hatching from a golden egg (1024x1024, 444,716 bytes)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC_NAME = 'entry.png';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourcePath = path.resolve(__dirname, SRC_NAME);
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const outFinal = path.join(outDir, SRC_NAME);
const tempName = `.${SRC_NAME}.tmp.${process.pid}.${Date.now()}`;
const outTemp = path.join(outDir, tempName);

function die(msg: string, code = 1): never {
  console.error(msg);
  process.exit(code);
}

try {
  fs.mkdirSync(outDir, { recursive: true });
  const srcBuf = fs.readFileSync(sourcePath);

  fs.writeFileSync(outTemp, srcBuf, { flag: 'w' });

  // Ensure data hit the disk for the temporary file.
  const fd = fs.openSync(outTemp, 'r');
  try {
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }

  // Atomic replace
  fs.renameSync(outTemp, outFinal);

  // Verify byte-for-byte equality
  const written = fs.readFileSync(outFinal);
  if (!Buffer.from(written).equals(Buffer.from(srcBuf))) {
    die('Verification failed: written file does not match source', 5);
  }

  console.log('dragon image written to', outFinal);
  process.exit(0);
} catch (err) {
  die('Error: ' + String(err), 2);
}
