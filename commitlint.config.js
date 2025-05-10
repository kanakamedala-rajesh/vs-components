const pkg = require("./package.json");

// Check if the user has configured the package to use conventional commits.
const isConventional =
  pkg.config && pkg.config["cz-emoji"] && pkg.config["cz-emoji"].conventional === true;

// Regex for default and conventional commits.
const RE_DEFAULT_COMMIT =
  /^(?::.*:|(?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]))(?:\s\(.*\))?\s.*$/;

// Updated RE_CONVENTIONAL_COMMIT:
// 1. Changed (?<type>\w+) to (?<type>[\w-]+) to allow hyphens in the type.
const RE_CONVENTIONAL_COMMIT =
  /^(?<type>[\w-]+)(?:\((?<scope>[\w-]+)\))?:\s+(?<emoji>(?::.*:|(?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])))\s+(?<subject>.+)$/;

module.exports = {
  rules: {
    "cz-emoji": [2, "always"],
    // You can add other standard conventional commit rules here if needed,
    // for example, from @commitlint/config-conventional
    // 'type-enum': [2, 'always', ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'log-add', /* other cz-emoji types */]],
    // 'subject-empty': [2, 'never'],
  },
  plugins: [
    {
      rules: {
        "cz-emoji": ({ raw }) => {
          // Get only the header line from the raw commit message
          const header = raw.split("\n")[0];

          const activeRegex = isConventional ? RE_CONVENTIONAL_COMMIT : RE_DEFAULT_COMMIT;

          // Test the regex against the header only
          const isValid = activeRegex.test(header);

          const message = isConventional
            ? `Commit message header should be in the format: type(scope?): emoji subject (e.g., feat(api): ✨ Add new feature or ci: 🚀 Deploy). Received: "${header}"`
            : `Your commit message header should be: emoji (scope?) subject (This mode is currently not active based on package.json config). Received: "${header}"`;

          return [isValid, message];
        },
      },
    },
  ],
};
