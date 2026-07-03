// 1. Define all packages with a publish flag
const packages = {
  // Root package: version gets bumped, but NOT published
  '.': { publish: false },
  // Published projects
  'projects/amc-docs': { publish: true },
  'projects/color-picker': { publish: true },
  'projects/datetime-picker': { publish: true },
  'projects/file-input': { publish: true },
};

// 2. Generate npm plugin entries dynamically
//    - npmPublish: true  → bumps version AND runs npm publish
//    - npmPublish: false → bumps version ONLY (skips publish)
const npmPlugins = Object.entries(packages).map(([pkgRoot, config]) => [
  '@semantic-release/npm',
  {
    npmPublish: config.publish,
    pkgRoot,
  },
]);

// 3. Generate the list of package.json files to commit
//    Handles the root path '.' specially
const gitAssets = Object.keys(packages).map((pkg) =>
  pkg === '.' ? 'package.json' : `${pkg}/package.json`
);

module.exports = {
  branches: [
    { name: 'main' },
    { name: 'dev', channel: 'next', prerelease: 'next' },
  ],

  plugins: [
    // --- Static plugins ---
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          { type: 'refactor', scope: '*', release: 'patch' },
          { type: 'chore', scope: 'update', release: 'patch' },
        ],
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'feat', section: 'Features' },
            { type: 'fix', section: 'Bug Fixes' },
            { type: 'chore', section: 'Chores', hidden: false },
            { type: 'refactor', section: 'Code Refactoring', hidden: false },
          ],
        },
      },
    ],

    // --- Dynamic npm plugins (bump versions for ALL, publish only some) ---
    ...npmPlugins,

    // --- Build step (runs AFTER versions are bumped) ---
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'pnpm install --frozen-lockfile && pnpm -r run build',
      },
    ],

    // --- Commit ALL bumped package.json files ---
    [
      '@semantic-release/git',
      {
        assets: gitAssets,
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],

    // --- GitHub release ---
    [
      '@semantic-release/github',
      {
        assets: ['dist/**/*'],
        successCommentCondition: false,
      },
    ],

    // --- Backmerge ---
    [
      '@cleyrop-org/semantic-release-backmerge',
      {
        backmergeBranches: [
          { from: 'main', to: 'dev' },
        ],
        message: 'chore(release): prepare for next release [skip ci]',
        clearWorkspace: true,
      },
    ],
  ],
};
