# Testing Conventions (Vitest + Vue Testing Library)

This document defines the testing principles for this repository.
It is intentionally explicit so it can serve both human contributors and future AI-assisted refactorings.

## Scope

These rules apply to all files under `src/tests/**`.

## AI Quick Rules

Use this section as a fast-start summary before applying detailed rules below.

- Preserve the page-object style used in `src/tests/**`.
- Prefer semantic shared views from `src/tests/TestViews.ts` over generic abstractions.
- Do not reintroduce `ElementView` or another generic fallback wrapper.
- Choose view classes by UI semantics, not by convenience:
  - button/action -> `ButtonView`
  - switch -> `SwitchView`
  - label-driven toggle/toggle-group -> `ToggleView`
  - modal/dialog -> `ModalView`
  - row/list item -> `RowView`
  - display value -> `ValueView`
  - alert/error -> `AlertView`
  - collapse region -> `CollapseView`
  - text-like input -> `InputView`
  - combobox -> `ComboboxView`
  - select/popover choice -> `SelectView`
  - repeated collection count -> `CollectionView`
  - intentionally text-driven assertion -> `TextView`
- Prefer `data-testid`-based semantic views over text lookup whenever practical.
- Keep semantic page-object member names such as `SaveButton`, `ValidNowToggle`, `ServerErrorItem`, `SplitEntriesCollapse`.
- Keep reusable interaction/assertion logic inside `src/tests/TestViews.ts`, not in test bodies.
- Use `userEvent` by default; use `fireEvent` only for technical edge cases.
- Keep test steps sequential (`await` one step after another); do not use `Promise.all(...)` for interaction/assertion flow.
- Use shared service assertion helpers from `src/tests/TestUtil.ts`.
- Use mocker classes under `src/service/mocker/**` instead of ad-hoc inline service mocks.
- When adding reusable abstractions, prefer a thin semantic wrapper over a generic wrapper.
- After changing tests or shared test helpers, run type-check and tests.

## Core Principles

1. **Page Object Pattern first**
   - Tests should interact with UI through local test view classes (page objects), not direct query calls.
   - Keep test intent readable: "what" over "how".

2. **Locality over over-abstraction**
   - Keep feature-specific page objects in the corresponding test file.
   - Extract shared primitives into `src/tests/TestViews.ts` only when reused.

3. **Semantic test views over generic element wrappers**
   - Model UI parts by role (`ButtonView`, `ModalView`, `RowView`, `SwitchView`, `AlertView`, ...), not by a generic catch-all element abstraction.
   - If a test primitive name does not communicate what kind of UI element it represents, it is probably too generic.

4. **Stable selectors over visible text**
   - Prefer `data-testid` driven access via `TestViews` classes.
   - Avoid brittle text-based selectors for controls (especially localized labels).

5. **Deterministic async flow**
   - Use sequential `await` calls in tests.
   - Do not use `Promise.all(...)` for user interaction/assertion steps.

6. **Minimal assertion API**
   - Do not pass custom assertion messages from tests.
   - Test helper methods should use concise default assertions.

7. **English-only test text**
   - Test names (`test(...)`, `describe(...)`) must be written in English.
   - Test comments should be written in English.
   - Prefer consistent wording like `mounts`, `loads data`, `shows error`, `resets form`.

## Required Test Structure

For each non-trivial test file:

- Define a local page object class, e.g. `CreateMoneyflowView`.
- Use static fields for stable elements.
- Use static factory methods for dynamic elements.

Example:

```ts
class ExampleView {
  static readonly SaveButton = new ButtonView("exampleSaveButton");
  static readonly NameInput = new InputView("name");

  static rowDeleteButton(rowId: number): ButtonView {
    return new ButtonView(`rowDelete#${rowId}`);
  }
}
```

## List-View Test File Structure

For list views, create one dedicated test file per Vue view component.

- Preferred naming: `<ViewName>.test.ts` for `<ViewName>.vue`
- Keep list-view tests in `src/tests/views/list/`
- Do not aggregate multiple list views in a single `ListViews.test.ts`

### Preferred

```txt
src/views/group/ListGroups.vue -> src/tests/views/list/ListGroups.test.ts
src/views/user/ListUsers.vue -> src/tests/views/list/ListUsers.test.ts
```

### Avoid

```txt
src/tests/views/list/ListViews.test.ts   // contains tests for many list views
```

## Use of `TestViews.ts`

`src/tests/TestViews.ts` contains shared, reusable primitives such as:

- `ButtonView`
- `InputView`
- `CollectionView`
- `ModalView`
- `RowView`
- `ValueView`
- `AlertView`
- `CollapseView`
- `SwitchView`
- `ToggleView`
- `ComboboxView`
- `SelectView`
- `TextView`

### Important

- `ElementView` has been removed intentionally.
- Do **not** reintroduce a generic fallback view such as `ElementView`, `BaseElementView`, or `ContainerView` unless there is a truly shared semantic role behind it.
- When in doubt, prefer adding a thin semantic class over reintroducing a generic one.

### Rule

If a behavior is reused across multiple test files, add it to `TestViews.ts`.
If behavior is domain-specific to a single file, keep it local in that file's page object.

## Semantic TestView Selection Guide

Use the most specific shared view that matches the underlying product control.

### Control / Action Views

- `ButtonView`
  - Use for button-like controls triggered via `data-testid`.
  - Typical examples: save, reset, create, edit, delete, previous/next month, row actions.

- `SwitchView`
  - Use for true switch controls bound by `data-testid`.
  - Expected state model: `data-state="checked"` / `data-state="unchecked"`.
  - Typical example: `div-filter-valid-now` from `DivFilter.vue`.

- `ToggleView`
  - Use for label-driven toggle controls and toggle groups.
  - This abstraction may resolve to either a checkbox-like field or a button-like toggle found by accessible label.
  - Expected button-state model: `data-state="on"` / not `on`.
  - Typical examples: `public`, `private`, `once`, `favorite`, `keep`, `renew` in `EditMoneyflowBase.vue`.

### Structural / Container Views

- `ModalView`
  - Use for dialog/modal containers such as `app-modal`.
  - Prefer semantic methods like `assertOpen()` over generic visibility wording when testing dialog behavior.

- `RowView`
  - Use for list/table rows such as `group-row-*`, `user-row-*`, `report-moneyflow-row-*`.

- `CollapseView`
  - Use for collapsible / expandable content regions.
  - Prefer `assertExpanded()` / `assertCollapsed()` over raw CSS-class assertions in tests.

### Value / Feedback Views

- `ValueView`
  - Use for read-only rendered values such as amount/date/boolean spans.

- `AlertView`
  - Use for error or alert items, especially destructive/server error output.
  - Prefer semantic helpers like `assertMessageContains(...)`.

- `TextView`
  - Use only for plain text lookup that is intentionally text-based and not tied to a dedicated `data-testid` page object element.
  - Typical examples: validation messages or standalone label text assertions.

### Form / Selection Views

- `InputView`
  - Use for text-like inputs bound by `data-testid`.

- `ComboboxView`
  - Use for autocomplete/combobox widgets with visible text input plus hidden id field.

- `SelectView`
  - Use for select/popover style choice widgets addressed via a trigger test id and option ids.

- `CollectionView`
  - Use for repeated elements where count is the relevant assertion.

### Selection Rules

1. Choose the view that matches the **product control semantics**, not just the methods you need.
2. Do not use `ButtonView` for a switch just because you only need `.click()`.
3. Do not use `TextView` when a stable `data-testid`-based semantic view exists.
4. If a reusable semantic role appears repeatedly and no shared view exists yet, add one to `TestViews.ts`.
5. If only one test file needs a domain-specific helper, keep it local in that file's page object class.

## Query and Interaction Rules

Inside test bodies, prefer page object calls only.

### Preferred

```ts
await ExampleView.NameInput.setValue("Alice");
await ExampleView.SaveButton.click();
await ExampleView.NameInput.assertValue("Alice");
```

### Avoid

```ts
const input = screen.getByTestId("name");
fireEvent.update(input, "Alice");
```

### Additional Rule

- Tests should call semantic page-object members such as `SaveButton`, `ValidNowToggle`, `ServerErrorItem`, `SplitEntriesCollapse`.
- Avoid generic names like `Element1`, `MainNode`, `Container`, `ThingToClick` in page-object classes.

## Event API Rules (`userEvent` vs `fireEvent`)

Use `userEvent` as the default interaction API in reusable test views.

### Required

- Prefer `userEvent` for user-like interactions (`click`, `type`, `clear`, keyboard navigation).
- Keep event calls inside `TestViews.ts` helper methods, not in test bodies.

### Allowed Exceptions

- Use `fireEvent` only when `userEvent` cannot express the interaction reliably.
- Typical example: updating hidden technical inputs (e.g. hidden ID fields in combobox fallbacks).

### Rationale

- `userEvent` models real interaction flow and reduces unrealistic test behavior.
- Controlled `fireEvent` exceptions preserve stability for technical edge cases.

## Async Rules

### Required

```ts
await action1();
await action2();
```

### Avoid

```ts
await Promise.all([action1(), action2()]);
```

Rationale: sequential awaits make timing and failure localization easier and reduce flaky interactions.

## Mocking Rules

Use dedicated mocker classes under:

- `src/service/mocker/**`

Do not assign service mocks inline repeatedly in tests when a reusable mocker method exists.

### `vi.mock` Declaration Style

Prefer the minimal declaration form when no explicit module factory is needed:

```ts
vi.mock("@/service/PreDefMoneyflowService");
vi.mock("@/service/PostingAccountService");
```

Rationale: this keeps test setup concise while method behavior is still controlled through dedicated mocker classes.

Use an explicit factory (`() => ({ default: ... })`) only when you need custom module shape or special behavior at declaration time.

### Mock Lifecycle (Required)

Use isolated default mocks per test via `beforeEach`, not global `beforeAll` state.

### Required Pattern

```ts
const applyDefaultMocks = () => {
  PostingAccountServiceMocker.mockFetchAllPostingAccount(defaultPostingAccounts);
  ContractpartnerServiceMocker.mockFetchAllContractpartner(defaultContractpartners);
  CapitalsourceServiceMocker.mockFetchAllCapitalsource(defaultCapitalsources);
  PreDefMoneyflowServiceMocker.mockFetchAllPreDefMoneyflow(defaultPreDefMoneyflows);
  CrudEtfServiceMocker.mockFetchAllEtf([]);
};

beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  applyDefaultMocks();
  MoneyflowServiceMocker.mockCreateMoneyflowResolved();
});
```

### Override Strategy

- Override only what a specific test needs.
- Do not manually restore mocks at the end of tests.
- Let `beforeEach` reapply the canonical default state.

### Avoid

```ts
beforeAll(() => {
  // global mutable mock state for all tests
});

test("special case", async () => {
  // override mock
  // ...
  // manual restore at test end
});
```

### Preferred

```ts
MoneyflowServiceMocker.mockCreateMoneyflowResolved();
PostingAccountServiceMocker.mockFetchAllPostingAccount([postingAccount1]);
```

### Avoid

```ts
MoneyflowService.createMoneyflow = vi.fn().mockResolvedValue(undefined);
```

## Service Call Assertion Rules (`TestUtil`)

Service call assertions must use shared helpers from `src/tests/TestUtil.ts`.

Available helpers:

- `assertHaveBeenCalled(...)`
- `assertHaveBeenCalledOnce(...)`
- `assertHaveBeenCalledTimes(...)`
- `assertHaveBeenCalledWith(...)`
- `assertNotHaveBeenCalled(...)`

### Required

```ts
await assertHaveBeenCalledOnce(Service.fetchAll);
await assertHaveBeenCalledWith(Service.fetchById, 42);
```

### Avoid

```ts
await waitFor(() => {
  expect(Service.fetchAll).toHaveBeenCalledOnce();
});
```

Rationale: centralized helpers keep async assertion style consistent and reduce repetitive boilerplate.

## Product Code Testability Rules

When tests require stable hooks, add explicit `data-testid` attributes in product code.

- Prefer dedicated IDs for actionable controls (`save`, `reset`, toggles, row buttons).
- Avoid relying on translated text labels for control lookup.
- Keep test IDs semantic and stable across UI restyling.

### Preferred Mapping from Product Code to TestView

- button-like action with `data-testid` -> `ButtonView`
- switch with `data-testid` -> `SwitchView`
- label-driven toggle / toggle-group / checkbox-like labeled control -> `ToggleView`
- dialog/modal container -> `ModalView`
- table/list row -> `RowView`
- alert/error output -> `AlertView`
- rendered display value -> `ValueView`
- collapsible content region -> `CollapseView`
- text-like input with `data-testid` -> `InputView`
- combobox with visible input and hidden id field -> `ComboboxView`
- select/popover trigger with option ids -> `SelectView`
- repeated collection where count matters -> `CollectionView`
- intentionally text-driven assertion without stable element binding -> `TextView`

## Message Handling in Helpers

Custom per-assertion message arguments are intentionally not used.

- No `message?: string` parameters in test helper/page object methods.
- Keep helper API small and consistent.

## Review Checklist for New/Changed Tests

Before merging test changes, verify:

- [ ] Test file uses local page object class.
- [ ] Shared page-object fields use the most specific semantic `*View` class available.
- [ ] No generic fallback abstraction like `ElementView` is introduced.
- [ ] No direct `screen.*`/`fireEvent.*`/`userEvent.*` calls in test body when an existing view helper covers it.
- [ ] `userEvent` is the default interaction API in `TestViews`; `fireEvent` is only used for technical exceptions.
- [ ] `SwitchView` is used for switch controls; `ToggleView` is used for label-driven toggles / toggle groups.
- [ ] Service call assertions use `src/tests/TestUtil.ts` helpers (no inline `waitFor(() => expect(...toHaveBeenCalled...))`).
- [ ] No `Promise.all(...)` in test steps.
- [ ] No custom assertion message arguments.
- [ ] List views use one dedicated test file per `List...vue` (`ListXxx.test.ts`, no `ListViews.test.ts`).
- [ ] Test names and test comments are English-only.
- [ ] Reused mocking logic goes through `src/service/mocker/**`.
- [ ] `npm run -s type-check` passes.
- [ ] `npm run -s test:ci` passes.

## AI Context for Future Interactions

Use this section as hard context when AI tools modify tests.

1. Preserve and extend the established page-object style.
2. Do not reintroduce direct low-level queries in test bodies unless there is no existing abstraction and adding one is unreasonable.
3. If adding a new reusable interaction/assertion pattern, implement it in `src/tests/TestViews.ts`.
4. If adding service mocks, prefer or create mocker classes in `src/service/mocker/**`.
5. Keep helper APIs message-free and sequential-await based.
6. Prefer explicit `data-testid` additions in product code over fragile text selectors.
7. After edits, run both type-check and tests.
8. `ElementView` is intentionally removed. Do not reintroduce a generic view abstraction unless explicitly requested and justified by repeated semantics.
9. Choose shared views by UI semantics:
   - action button -> `ButtonView`
   - switch -> `SwitchView`
   - label-driven toggle/toggle-group -> `ToggleView`
   - modal/dialog -> `ModalView`
   - row/list item -> `RowView`
   - display value -> `ValueView`
   - alert/error item -> `AlertView`
   - collapse region -> `CollapseView`
   - text-like input -> `InputView`
   - combobox with visible text plus hidden id -> `ComboboxView`
   - select/popover choice widget -> `SelectView`
   - repeated collection count -> `CollectionView`
   - intentionally text-driven assertion -> `TextView`
10. Prefer semantic page-object property names (`SaveButton`, `ValidNowToggle`, `ServerErrorItem`, `SplitEntriesCollapse`) over generic names.
11. Prefer `data-testid`-based semantic views over `TextView`; use `TextView` only when the assertion is intentionally text-driven.
12. Keep shared view classes thin if needed; a thin semantic wrapper is preferable to a generic wrapper.
13. When refactoring tests, preserve the semantic distinction between `SwitchView` (`checked` / `unchecked`) and `ToggleView` (`on` / off, label-driven, possibly checkbox fallback).
14. If a control is repeatedly mis-modeled in tests, fix the view type instead of working around the mismatch in assertions.

## Non-Goals

- This document does not prescribe business assertions.
- This document does not replace feature-specific test design.
- This document does not require over-engineering tiny one-off tests; use judgment while honoring the core principles.

