import { fireEvent, waitFor } from "@testing-library/vue";
import { expect } from "vitest";

export async function waitForInputHasValue(
  item: HTMLInputElement,
  value: string,
  message?: string,
) {
  await waitFor(() => {
    expect(item.value, message).toBe(value);
  });
}

export async function setInputValueAndWait(
  item: HTMLInputElement,
  value: string,
  message?: string,
) {
  fireEvent.update(item, value);
  await waitForInputHasValue(item, value, message);
}
