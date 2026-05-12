#!/usr/bin/env node

const { spawnSync } = require('node:child_process');

const args = process.argv.slice(2).filter((arg) => arg !== '--runInBand');
const vitestBin = require.resolve('vitest/vitest.mjs');

const result = spawnSync(process.execPath, [vitestBin, 'run', ...args], {
  stdio: 'inherit',
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
