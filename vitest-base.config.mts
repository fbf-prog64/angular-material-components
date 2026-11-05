import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // Keep nested workspaces from loading multiple Angular instances in library tests.
    dedupe: [
      '@angular/core',
      '@angular/common',
      '@angular/compiler',
      '@angular/platform-browser',
      '@angular/cdk',
      '@angular/material',
      '@angular/forms',
      'rxjs',
    ],
  },
});
