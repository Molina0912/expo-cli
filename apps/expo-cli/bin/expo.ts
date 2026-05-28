#!/usr/bin/env bun
import { main } from '@expo/cli';

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
