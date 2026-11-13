import { describe, it, expect } from 'vitest';
import { FYM_PALETTE, FYM_COUNTRIES } from './core/constants/app.constants';

describe('Global Configuration & Constants', () => {
  it('should have valid palette values', () => {
    expect(FYM_PALETTE.ROSE_PRIMARY).toBe('#D9536F');
    expect(FYM_PALETTE.CANVAS).toBe('#FFF8F9');
  });

  it('should include Central America countries', () => {
    const ni = FYM_COUNTRIES.find(c => c.code === 'NI');
    expect(ni).toBeDefined();
    expect(ni?.dialCode).toBe('+505');
  });
});
