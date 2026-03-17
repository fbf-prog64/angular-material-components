# Deployment notes

This document describes deployment notes for testing and showcase production.

## Local deployment

To start a development server, execute the following commands:

```bash
# Install all the dependencies
pnpm i

# Build all Angular Components for testing
pnpm -r build-dev

# Build the main showcase project
pnpm build-dev amc-docs

# Start the server
pnpm start
```

If you want to test with production builds, use the following commands:

```bash
# Install all the dependencies
pnpm i

# Build all Angular Components
pnpm -r build

# Build the main showcase project
pnpm build amc-docs

# Start the server
pnpm start
```

## GitHub Pages

This project is configured to be deployed in GitHub Pages.

### Site URL

The site is available at `https://fbf-prog64.github.io/angular-material-components/`.

### Methods to deploy

The deployment can be done in two different ways:

#### Method 1: Automatic, with GitHub Actions (Recommended)

The project includes a GitHub Actions workflow that is automatically run when:

- Making a push to the `dev` or `main` branches.
- A Pull Request is made to `dev` or `main`.
- The workflow is manually executed from the "Actions" tab in GitHub.

This method _must be used when changing anything from Angular_.

#### Method 2: Manual deployment

To manually deploy changes to the site, follow these steps:

1. Ensure you have both NodeJS and pnpm installed.
2. Clone the repository.
3. Checkout the `gh-pages` branch.
4. Perform the desired changes.
5. Commit and push the changes directly to `origin/gh-pages`.

This method must be used _when changing anything static (such as common dependencies or the home page)_.

### Important notes

- The `base-href` is configured as `/angular-material-components/`.
- The site files (including transpiled components) are stored in the `gh-pages` branch.

## Troubleshooting

If you have problems with publishing, please check the following:

1. Check the workflow logs to determine if something failed ("Actions" tab).
2. Double-check that the build completes without errors and runs locally.
