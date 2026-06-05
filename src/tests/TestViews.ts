import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen, waitFor } from "@testing-library/vue";
import { expect } from "vitest";
import { defineComponent, h, ref } from "vue";

async function waitForInputHasValue(item: HTMLInputElement, value: string) {
  await waitFor(() => {
    expect(item.value).toBe(value);
  });
}

export abstract class AbstractView {
  protected createUser() {
    return userEvent.setup();
  }

  constructor(protected readonly testId?: string) {}

  protected async clickElement(element: HTMLElement): Promise<void> {
    const user = this.createUser();
    await user.click(element);
  }

  protected async clickByTestId(methodName: string): Promise<void> {
    const testId = this.getRequiredTestId(methodName);
    const element = await this.findByTestId<HTMLElement>(testId);
    await this.clickElement(element);
  }

  protected getRequiredTestId(methodName: string): string {
    if (!this.testId) {
      throw new Error(`${methodName} requires a bound testId.`);
    }
    return this.testId;
  }

  protected getByTestId<T extends HTMLElement>(testId: string): T {
    return screen.getByTestId<T>(testId);
  }

  protected async findByTestId<T extends HTMLElement>(
    testId: string,
  ): Promise<T> {
    return screen.findByTestId<T>(testId);
  }

  protected queryByTestId<T extends HTMLElement>(testId: string): T | null {
    return screen.queryByTestId<T>(testId);
  }

  protected queryAllByTestId<T extends HTMLElement>(testId: string): T[] {
    return screen.queryAllByTestId<T>(testId);
  }

  async assertToBeVisible(): Promise<void> {
    const testId = this.getRequiredTestId("assertToBeVisible");
    const element = await this.findByTestId<HTMLElement>(testId);
    await waitFor(() => {
      expect(element).toBeInTheDocument();
    });
  }

  async assertNotToBeVisible(): Promise<void> {
    const testId = this.getRequiredTestId("assertNotToBeVisible");
    await waitFor(() => {
      const element = this.queryByTestId<HTMLElement>(testId);
      if (!element) {
        return;
      }
      expect(element).not.toBeVisible();
    });
  }

  async assertNotToBeInDocument(timeoutMs?: number): Promise<void> {
    const testId = this.getRequiredTestId("assertNotToBeInDocument");
    await waitFor(
      () => {
        const element = this.queryByTestId<HTMLElement>(testId);
        expect(element).toBeNull();
      },
      timeoutMs ? { timeout: timeoutMs } : undefined,
    );
  }

  async assertHasClass(className: string): Promise<void> {
    const testId = this.getRequiredTestId("assertHasClass");
    const element = await this.findByTestId<HTMLElement>(testId);
    await waitFor(() => {
      expect(element.classList.contains(className)).toBeTruthy();
    });
  }

  async assertNotHasClass(className: string): Promise<void> {
    const testId = this.getRequiredTestId("assertNotHasClass");
    const element = await this.findByTestId<HTMLElement>(testId);
    await waitFor(() => {
      expect(element.classList.contains(className)).toBeFalsy();
    });
  }

  async assertTextEquals(text: string): Promise<void> {
    const testId = this.getRequiredTestId("assertTextEquals");
    const element = await this.findByTestId<HTMLElement>(testId);
    await waitFor(() => {
      expect(element.textContent).toBe(text);
    });
  }

  async assertEmpty(): Promise<void> {
    const testId = this.getRequiredTestId("assertEmpty");
    const element = await this.findByTestId<HTMLElement>(testId);
    await waitFor(() => {
      expect(element).toBeEmptyDOMElement();
    });
  }
}

export const DeclarativeModalStub = defineComponent({
  props: {
    open: Boolean,
    idSuffix: String, // Accept idSuffix prop
  },
  emits: ["update:open"],
  template:
    '<div v-if="open" :data-testid="\'app-modal-\' + idSuffix"><slot name="body" /><slot name="footer" /></div>',
});


export function renderDeclarativeModal(component: any, props?: any) {
  render(
    defineComponent({
      setup() {
        return () => h(component, { ...props });
      },
    }),
    {
      global: {
        stubs: { ModalVue: DeclarativeModalStub },
      },
    },
  );
}

export function renderDeclarativeModalWithRef<T = any>(
  component: any,
  props?: any,
) {
  const modalRef = ref<T>();
  render(
    defineComponent({
      setup() {
        return () => h(component, { ...props, ref: modalRef });
      },
    }),
    {
      global: {
        stubs: { ModalVue: DeclarativeModalStub },
      },
    },
  );
  return modalRef;
}

export class CollectionView extends AbstractView {
  async assertCount(count: number): Promise<void> {
    const testId = this.getRequiredTestId("assertCount");
    await waitFor(() => {
      expect(this.queryAllByTestId(testId).length).toBe(count);
    });
  }

  async clickOption(index: number): Promise<void> {
    const testId = this.getRequiredTestId("clickOption");
    const options = screen.getAllByTestId(testId);
    await this.clickElement(options[index]);
  }
}

export class ButtonView extends AbstractView {
  async click(): Promise<void> {
    await this.clickByTestId("click");
  }
}

export class ModalView extends AbstractView {
  async assertOpen(): Promise<void> {
    await this.assertToBeVisible();
  }

  async assertClosed(): Promise<void> {
    await this.assertNotToBeVisible();
  }
}

export class CommandView extends AbstractView {
  async assertIsDisabled() {
    await this.assertHasClass("pointer-events-none");
  }

  async assertIsEnabled() {
    await this.assertNotHasClass("pointer-events-none");
  }
}

export class RowView extends AbstractView {}

export class MobilePopupMenu extends AbstractView {}

export class ValueView extends AbstractView {}

export class AlertView extends AbstractView {
  async assertMessageContains(text: string): Promise<void> {
    const testId = this.getRequiredTestId("assertTextContains");
    const element = await this.findByTestId<HTMLElement>(testId);
    await waitFor(() => {
      expect(element.textContent).toContain(text);
    });
  }
}

export class CollapseView extends AbstractView {
  async assertExpanded(): Promise<void> {
    await this.assertHasClass("show");
  }

  async assertCollapsed(): Promise<void> {
    await this.assertHasClass("collapse");
    await this.assertNotHasClass("show");
  }
}

export class SwitchView extends AbstractView {
  async click(): Promise<void> {
    await this.clickByTestId("click");
  }

  private async assertDataState(
    methodName: string,
    expectedState: string,
  ): Promise<void> {
    const testId = this.getRequiredTestId(methodName);
    const element = await this.findByTestId<HTMLElement>(testId);
    await waitFor(() => {
      expect(element.dataset.state).toBe(expectedState);
    });
  }

  async assertChecked(): Promise<void> {
    await this.assertDataState("assertChecked", "checked");
  }

  async assertUnchecked(): Promise<void> {
    await this.assertDataState("assertUnchecked", "unchecked");
  }
}

export class CheckboxView extends AbstractView {
  async click(): Promise<void> {
    await this.clickByTestId("click");
  }

  async assertChecked(): Promise<void> {
    const testId = this.getRequiredTestId("assertChecked");
    const checkbox = await this.findByTestId<HTMLInputElement>(testId);
    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  }

  async assertUnchecked(): Promise<void> {
    const testId = this.getRequiredTestId("assertUnchecked");
    const checkbox = await this.findByTestId<HTMLInputElement>(testId);
    await waitFor(() => {
      expect(checkbox).not.toBeChecked();
    });
  }
}

export class InputView extends AbstractView {
  private async waitUntilInputValueEquals(
    input: HTMLInputElement,
    value: string,
  ): Promise<void> {
    await waitFor(() => {
      const actualValue = input.value;
      if (actualValue === value) {
        return;
      }

      const actualNumber = Number(actualValue);
      const expectedNumber = Number(value);
      const canCompareNumerically =
        Number.isFinite(actualNumber) && Number.isFinite(expectedNumber);

      if (canCompareNumerically) {
        expect(actualNumber).toBe(expectedNumber);
        return;
      }

      expect(actualValue).toBe(value);
    });
  }

  async assertValue(value: string): Promise<void> {
    const testId = this.getRequiredTestId("assertValue");
    const input = this.getByTestId<HTMLInputElement>(testId);
    await waitForInputHasValue(input, value);
  }

  async setValueWithoutChecking(value: string): Promise<void> {
    const testId = this.getRequiredTestId("setValue");
    const input = await this.findByTestId<HTMLInputElement>(testId);
    const user = this.createUser();

    await user.clear(input);
    if (value.length > 0) await user.type(input, value);
  }

  async setValue(value: string): Promise<void> {
    const testId = this.getRequiredTestId("setValue");
    const input = await this.findByTestId<HTMLInputElement>(testId);
    const user = this.createUser();

    await user.clear(input);
    try {
      if (value.length > 0) await user.type(input, value);
      await this.waitUntilInputValueEquals(input, value);
    } catch {
      // Some masked/datepicker inputs don't handle simulated typing reliably.
      await fireEvent.update(input, value);
      await this.waitUntilInputValueEquals(input, value);
    }
  }

  async assertFocused(): Promise<void> {
    const testId = this.getRequiredTestId("assertFocused");
    const input = await this.findByTestId<HTMLInputElement>(testId);
    await waitFor(() => {
      expect(document.activeElement).toBe(input);
    });
  }

  async pressEnter(): Promise<void> {
    const testId = this.getRequiredTestId("pressEnter");
    const input = await this.findByTestId<HTMLInputElement>(testId);
    const user = this.createUser();
    await user.click(input);
    await user.keyboard("{Enter}");
  }
}

export class TextView {
  constructor(private readonly text: string | RegExp) {}

  async assertInDocument(): Promise<void> {
    await screen.findByText(this.text);
  }
}

export class ToggleView extends AbstractView {
  constructor(private readonly label: string) {
    super();
  }

  private queryCheckboxField(): HTMLInputElement | null {
    return screen.queryByLabelText<HTMLInputElement>(this.label);
  }

  private async findToggleButton(): Promise<HTMLElement> {
    return screen.findByRole("button", {
      name: this.label,
    });
  }

  async assertChecked(): Promise<void> {
    const checkboxField = this.queryCheckboxField();
    if (checkboxField) {
      expect(checkboxField.checked).toBeTruthy();
      return;
    }

    const toggleButton = await this.findToggleButton();
    await waitFor(() => {
      expect(toggleButton.dataset.state).toBe("on");
    });
  }

  async assertUnchecked(): Promise<void> {
    const checkboxField = this.queryCheckboxField();
    if (checkboxField) {
      expect(checkboxField.checked).toBeFalsy();
      return;
    }

    const toggleButton = await this.findToggleButton();
    await waitFor(() => {
      expect(toggleButton.dataset.state).not.toBe("on");
    });
  }

  async click(): Promise<void> {
    await this.clickElement(await this.findToggleButton());
  }
}

export class ComboboxView extends AbstractView {
  constructor(private readonly itemBaseTestId: string) {
    super(itemBaseTestId);
  }

  async selectItem(
    valueInput: string,
    valueHidden: string | number,
  ): Promise<void> {
    const inputItem = await this.findByTestId<HTMLInputElement>(
      this.itemBaseTestId,
    );
    const idItem = await this.findByTestId<HTMLInputElement>(
      `${this.itemBaseTestId}-id`,
    );
    await this.clickElement(inputItem);

    let optionItems = this.queryAllByTestId<HTMLAnchorElement>(
      `${this.itemBaseTestId}-option`,
    );

    if (optionItems.length === 0) {
      await waitFor(() => {
        optionItems = this.queryAllByTestId<HTMLAnchorElement>(
          `${this.itemBaseTestId}-option`,
        );
        expect(optionItems.length).toBeGreaterThan(0);
      }).catch(() => {
        throw new Error(
          `Combobox '${this.itemBaseTestId}' has no selectable options. Expected at least one '${this.itemBaseTestId}-option' entry to choose '${valueInput}'.`,
        );
      });
    }

    expect(optionItems.length).toBeGreaterThan(0);

    let found = false;
    for (const optionItem of optionItems) {
      if (optionItem.text === valueInput) {
        await this.clickElement(optionItem);
        found = true;
        break;
      }
    }

    const availableOptions = optionItems
      .map((entry) => entry.textContent?.trim() || "")
      .filter((entry) => entry.length > 0)
      .join(", ");
    expect(
      found,
      `Combobox '${this.itemBaseTestId}' cannot select '${valueInput}'. Available options: [${availableOptions}].`,
    ).toBeTruthy();

    await waitForInputHasValue(idItem, String(valueHidden));
  }

  async clear(): Promise<void> {
    const clearItem = this.getByTestId<HTMLElement>(
      `${this.itemBaseTestId}-clear`,
    );
    const idItem = this.getByTestId<HTMLInputElement>(
      `${this.itemBaseTestId}-id`,
    );
    await this.clickElement(clearItem);
    await waitFor(() => {
      expect(["0", ""]).toContain(idItem.value);
    });
  }
}

export class SelectView extends AbstractView {
  private readonly optionTestIdPrefix: string;

  constructor(testId: string) {
    super(testId);
    this.optionTestIdPrefix = `${testId}item-`;
  }

  private async waitForText(
    testId: string,
    expectedText: string,
  ): Promise<void> {
    const element = this.getByTestId<HTMLElement>(testId);
    await waitFor(() => {
      expect(element.textContent).toContain(expectedText);
    });
  }

  async waitForSelectedText(expectedText: string): Promise<void> {
    const testId = this.getRequiredTestId("waitForSelectedText");
    await this.waitForText(testId, expectedText);
  }

  async selectOption(value: string, labelText: string): Promise<void> {
    await this.open();

    let option: HTMLElement;
    if (value === "0") {
      option = await screen.findByRole("option", {
        name: new RegExp(labelText),
      });
    } else {
      option = await this.findByTestId<HTMLElement>(
        `${this.optionTestIdPrefix}${value}`,
      );
    }

    await this.clickElement(option);
    await this.waitForSelectedText(labelText);
  }

  async open(): Promise<void> {
    await this.clickByTestId("open");
  }

  async assertOptionMissingByValue(value: string): Promise<void> {
    await waitFor(() => {
      expect(
        this.queryByTestId<HTMLElement>(`${this.optionTestIdPrefix}${value}`),
      ).toBeNull();
    });
  }
}

export class FileUploadView extends AbstractView {
  async selectFile(file: File): Promise<void> {
    const testId = this.getRequiredTestId("selectFile");
    const element = await this.findByTestId<HTMLElement>(testId);
    Object.defineProperty(element, "files", { value: [file] });
    // Trigger change event
    await fireEvent.change(element);
  }
}

export class RadioView extends AbstractView {
  async assertChecked(): Promise<void> {
    const testId = this.getRequiredTestId("assertChecked");
    const radio = await this.findByTestId<HTMLElement>(testId);
    await waitFor(() => {
      // For custom radio: check aria-checked attribute
      expect(radio.getAttribute("aria-checked")).toBe("true");
    });
  }

  async assertUnchecked(): Promise<void> {
    const testId = this.getRequiredTestId("assertUnchecked");
    const radio = await this.findByTestId<HTMLElement>(testId);
    await waitFor(() => {
      expect(radio.getAttribute("aria-checked")).toBe("false");
    });
  }
}
