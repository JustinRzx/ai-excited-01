// ai-excited-01: Make the AI judge excited
// Image: baby golden dragon hatching from a golden egg on a floating island
// 1024x1024, 444,716 bytes

// Copies the bundled `entry.png` (next to this script) to the output directory as `entry.png`.
// Writes atomically: write to a temp file in the same output dir, fsync, then rename.
// After writing, verifies the bytes exactly match the source; on mismatch exits with code 5.

import * as fs from 'fs';
import fsPromises from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const OUT_ENV = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const SRC_URL = new URL('./entry.png', import.meta.url);
const SRC_PATH = fileURLToPath(SRC_URL);

function mkTempName(baseName){
  const rand = Math.floor(Math.random()*1e9).toString(36);
  return `${baseName}.tmp-${rand}`;
}

async function readAllBytes(path){
  return fsPromises.readFile(path);
}

async function atomicWrite(destDir, name, dataBuffer){
  await fsPromises.mkdir(destDir, { recursive: true });
  const tempName = mkTempName(name);
  const tempPath = destDir.endsWith('/') ? `${destDir}${tempName}` : `${destDir}/${tempName}`;
  // open, write, fsync, close using sync calls on descriptor for correctness
  const fd = fs.openSync(tempPath, 'w', 0o666);
  try{
    fs.writeFileSync(fd, dataBuffer);
    fs.fsyncSync(fd);
  } finally{
    try { fs.closeSync(fd); } catch(_){}
  }
  const finalPath = destDir.endsWith('/') ? `${destDir}${name}` : `${destDir}/${name}`;
  fs.renameSync(tempPath, finalPath);
  return finalPath;
}

async function main(){
  const srcBuf = await readAllBytes(SRC_PATH);
  const outName = 'entry.png';
  const writtenPath = await atomicWrite(OUT_ENV, outName, srcBuf);
  const writtenBuf = await readAllBytes(writtenPath);

  if (srcBuf.length !== writtenBuf.length) {
    console.error('Mismatch: length differs', srcBuf.length, writtenBuf.length);
    process.exit(5);
  }
  for (let i=0;i<srcBuf.length;i++){
    if (srcBuf[i] !== writtenBuf[i]){
      console.error('Mismatch: byte difference at', i);
      process.exit(5);
    }
  }
  console.log('Wrote', writtenPath, 'bytes=', srcBuf.length);
}

main().catch(err=>{ console.error(err); process.exit(1); });
