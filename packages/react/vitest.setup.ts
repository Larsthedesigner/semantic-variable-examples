import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// vitest.config.ts doesn't enable `globals`, so RTL's own auto-cleanup (which
// relies on a global `afterEach`) never registers — do it explicitly instead.
afterEach(cleanup);
