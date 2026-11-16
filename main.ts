// ai-excited-01: Make the AI judge excited
// Image: baby golden dragon hatching from a golden egg (dragon hatching)
// 1024x1024, 444,716 bytes, curated image by Justin (do not modify the source image)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

function fail(msg, code = 1) {
  console.error(msg);
  process.exit(code);
}

function sha256Hex(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function resolveSourcePath() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, 'entry.png');
}

function atomicWrite(destDir, filename, data) {
  const destPath = path.join(destDir, filename);
  const tmpName = `${filename}.tmp-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const tmpPath = path.join(destDir, tmpName);

  fs.mkdirSync(destDir, { recursive: true });

  const fd = fs.openSync(tmpPath, 'w');
  try {
    fs.writeSync(fd, data, 0, data.length, 0);
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }

  fs.renameSync(tmpPath, destPath);
}

(function main() {
  try {
    const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
    const srcPath = resolveSourcePath();

    if (!fs.existsSync(srcPath)) {
      fail(`Source image not found at ${srcPath}`);
    }

    const srcBuf = fs.readFileSync(srcPath);
    atomicWrite(outDir, 'entry.png', srcBuf);

    const writtenPath = path.join(outDir, 'entry.png');
    const writtenBuf = fs.readFileSync(writtenPath);

    if (!writtenBuf.equals(srcBuf)) {
      console.error('ERROR: written file does not match source image');
      process.exit(5);
    }

    const sha = sha256Hex(writtenBuf);
    console.log(`WROTE ${writtenPath} (sha256 ${sha})`);
    process.exit(0);
  } catch (err) {
    console.error('Unhandled error:', err && err.stack ? err.stack : String(err));
    process.exit(2);
  }
})();
