// Flat config, because ESLint 9 does not read .eslintrc.json.
//
// This repository had `eslint: ^9` and a two-line .eslintrc.json extending next/core-web-vitals
// and next/typescript. ESLint 9 ignores that file and exits with "couldn't find an
// eslint.config.js", so `npm run lint` had been failing rather than linting — and nothing
// noticed, because the CI job ran typecheck, test and build and never lint.
//
// eslint-config-next 16 exports flat config arrays directly, so no @eslint/eslintrc compat shim:
// running the old config through FlatCompat crashes with "Converting circular structure to JSON"
// on the react plugin.
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";
import a11y from "eslint-plugin-jsx-a11y";

// Next's preset sets almost every rule to "warn", including jsx-a11y/alt-text, so `eslint .`
// exited 0 on an image with no alt attribute. A gate that cannot fail is not a gate, so the
// accessibility rules are promoted to errors here. The plugin is already registered by the
// preset — re-registering it under `plugins` fails with "Cannot redefine plugin".
const a11yErrors = Object.fromEntries(
  Object.keys(a11y.flatConfigs.recommended.rules).map((rule) => [rule, "error"]),
);

const config = [
  {
    // Build output. Without this, linting the repository root walks into .next-build/standalone
    // and reports on minified vendor chunks.
    ignores: [".next/**", ".next-build/**", "node_modules/**", "public/**", "coverage/**"],
  },
  ...coreWebVitals,
  ...typescript,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      ...a11yErrors,

      // Deprecated upstream in favour of label-has-associated-control, and it shows: it demands
      // nesting *and* an id on every label, so it reported 25 failures in forms that are already
      // correct — `<label><span>Email</span><input /></label>` in checkout, and
      // `<label htmlFor="newsletter-email">` beside `<input id="newsletter-email">` in the
      // footer. The replacement accepts either form and reports none of them.
      "jsx-a11y/label-has-for": "off",
      "jsx-a11y/label-has-associated-control": "error",

      // Off for the same reason: it does not follow htmlFor to a sibling input or see a wrapping
      // label, so it duplicated all 20 of those false positives. label-has-associated-control
      // covers the real case, from the label's side, where the association is visible.
      "jsx-a11y/control-has-associated-label": "off",

      // Click and key handlers only. The default list includes focus, which flagged the one
      // place a container legitimately listens without becoming interactive: <form onFocus> in
      // contact-form.tsx, used once to record that someone started filling it in. A focus
      // listener on a wrapper adds no keyboard obligation — there is nothing to operate.
      "jsx-a11y/no-noninteractive-element-interactions": [
        "error",
        { handlers: ["onClick", "onMouseDown", "onMouseUp", "onKeyPress", "onKeyDown", "onKeyUp"] },
      ],
    },
  },
];

export default config;