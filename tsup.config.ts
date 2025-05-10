import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // Library entry point
  format: ['cjs', 'esm'], // Output both CommonJS and ES modules
  dts: true, // Generate declaration files (.d.ts)
  splitting: false, // Keep code in one file per format (simpler for this size)
  sourcemap: true, // Generate sourcemaps
  clean: true, // Clean output directory before build
  // External specifies dependencies that should not be bundled,
  // ensuring they are treated as peer dependencies by the consumer's bundler.
  // Add any other dependencies here that are listed in peerDependencies.
  external: [
      'react',
      'react-dom',
      'next',
      'next-themes',
      'framer-motion',
      'lucide-react',
      'tailwindcss' // Although not imported directly, keep it external
   ],
  // Add banner to inject 'use client' directive for Next.js App Router compatibility
   banner: {
    js: "'use client';",
  },
  // If you have CSS files to bundle (WE ARE NOT DOING THIS for Tailwind components):
  // injectStyle: false, // Set true if bundling CSS
});