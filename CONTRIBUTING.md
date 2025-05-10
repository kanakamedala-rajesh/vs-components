# Contributing to VS Components

First off, thank you for considering contributing to VS Components! It's people like you that make open source great. We welcome any type of contribution, not just code. You can help with:

- **Reporting a bug**
- **Discussing the current state of the code**
- **Submitting a fix**
- **Proposing new features**
- **Becoming a maintainer**

## We Use GitHub Flow

We use [GitHub Flow](https://guides.github.com/introduction/flow/index.html), so all code changes happen through Pull Requests.

1.  **Fork the repo** and create your branch from `main`.
2.  If you've added code that should be tested, **add tests**.
3.  If you've changed APIs, **update the documentation**.
4.  Ensure the **test suite passes** (`npm run test`).
5.  Make sure your code **lints** (`npm run lint`).
6.  Issue that pull request!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](LICENSE) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub's [issues](https://github.com/kanakamedala-rajesh/vs-components/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/kanakamedala-rajesh/vs-components/issues/new); it's that easy!

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

People _love_ thorough bug reports. I'm not even kidding.

## Suggesting Enhancements

If you have an idea for a new feature or an improvement to an existing one:

1.  Open an issue and describe your enhancement.
2.  Explain why this enhancement would be useful to VS Components users.
3.  Discuss the potential implementation approach.
4.  If you're willing to implement it, let us know!

## Development Setup

Ready to contribute code? Here's how to set up `vs-components` for local development.

1.  **Fork** the `vs-components` repository on GitHub.
2.  **Clone** your fork locally:
    ```bash
    git clone https://github.com/your_username/vs-components.git
    cd vs-components
    ```
3.  **Install dependencies**:
    We use `npm`.
    ```bash
    npm install
    ```
4.  **Run Storybook** for component development:
    ```bash
    npm run storybook
    ```
    This will open Storybook in your browser, where you can see and interact with the components.
5.  **Run tests**:
    ```bash
    npm run test
    ```
    Or for watch mode:
    ```bash
    npm run test:watch
    ```
6.  **Linting**:
    To check for linting errors:
    ```bash
    npm run lint
    ```
    To automatically fix some linting errors:
    ```bash
    npm run lint:fix
    ```

## Coding Standards

- **TypeScript**: All new code should be written in TypeScript.
- **Style**: Follow the existing code style. We use ESLint and Prettier (via ESLint integration) to enforce code style. Please ensure your code passes linting checks before submitting a pull request.
- **Accessibility (A11y)**: We strive to make our components accessible. Please consider accessibility in your contributions. Test with keyboard navigation and screen readers if applicable.
- **Component Design**:
  - Components should be composable and reusable.
  - Props should be clearly defined with TypeScript interfaces.
  - Aim for a minimal and intuitive API.
  - Use CSS Modules for styling to ensure encapsulation.

## Pull Request Process

1.  Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2.  Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
3.  Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4.  You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This helps in automating changelog generation and versioning.
A typical commit message might look like:
`feat(Button): add new 'ghost' variant`
`fix(Input): correct placeholder text color in dark mode`
`docs(README): update installation instructions`

Common types include: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `perf`.

Thank you again for your interest in contributing!
