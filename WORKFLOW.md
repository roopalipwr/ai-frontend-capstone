# FE-04 AI-Assisted Workflow Comparison

## Feature

For FE-04, I built a small settings-form feature in my HTML, CSS, and JavaScript frontend project. The feature includes profile settings, password validation, notifications, theme preferences, and reusable validation functions.

## Round 1 — Vague Workflow

The first version was created on the `fe04-round1-vague` branch using a deliberately vague AI request. The prompt provided minimal context and asked the AI to create a settings form with validation. The goal was to see what the AI would produce without detailed specifications or a verification plan.

The resulting implementation provided the basic settings functionality, but the validation and implementation details were less explicitly controlled. The branch was committed separately so that it could be compared with the precise version without mixing the two workflows.

## Round 2 — Precise Workflow

The second version was created independently on `fe04-round2-spec`. The AI was instructed to first explore the existing project, create a plan, implement only the required changes, consider accessibility and edge cases, and then verify the implementation with tests.

The precise workflow produced more explicit validation behavior. The validation module now handles trimmed names, required email values, email format validation, password length and complexity, and password confirmation. The implementation also includes theme-related behavior in `script.js`.

## Verification and AI Review

A major difference was verification. Instead of accepting the generated code as finished, I created `validation.test.js` using Node's built-in test runner. The test suite covers empty, invalid, boundary, and valid inputs for the validation functions. Running `node --test validation.test.js` produced **11 passing tests and 0 failures**.

During review, I also caught an AI-generated documentation typo such as `atleast` instead of `at least`. This showed why generated comments and documentation also need human review rather than being accepted automatically.

The Round 2 version was also reviewed through the browser UI and Git diff. The form contains labeled sections and controls, and the validation behavior was checked against the implementation.

## Conclusion

The vague workflow was quicker to start because it required very little planning, but it placed more responsibility on manual review to determine whether the result actually met the requirements.

The precise workflow required more effort before implementation, but it provided clearer requirements, explicit edge cases, automated verification, and a more structured review process.

The main lesson from FE-04 is that AI should be treated as an implementation assistant, not as a replacement for engineering judgment. A workflow that follows **specification → explore → plan → code → test → review → compare → final verification** produces a more predictable and verifiable result.
