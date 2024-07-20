import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import { render, screen, waitFor } from "@testing-library/vue";
import { expect, test, vi } from "vitest";
import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
import CreateMoneyflow from "@/views/moneyflow/CreateMoneyflow.vue";

test("component renders", async () => {
  const preDefMoneyflows: PreDefMoneyflow[] = [];

  const fetchAllPreDefMoneyflowSpy = vi
    .spyOn(PreDefMoneyflowService, "fetchAllPreDefMoneyflow")
    .mockReturnValue(Promise.resolve(preDefMoneyflows));

  render(CreateMoneyflow);

  expect(fetchAllPreDefMoneyflowSpy).toHaveBeenCalledOnce();

  expect(screen.queryByText("create moneyflow")).toBeTruthy();

  const subbookingLink = screen.getByText("subbooking");

  expect(screen.queryAllByTestId("splitEntryRowDeleteButton")).toHaveLength(0);
  subbookingLink.click();
  expect(
    await screen.findAllByTestId("splitEntryRowDeleteButton"),
  ).toHaveLength(2);

  const splitEntryRowAddButton = screen.getByTestId("splitEntryRowAddButton");
  splitEntryRowAddButton.click();

  await waitFor(() =>
    expect(screen.getAllByTestId("splitEntryRowDeleteButton")).toHaveLength(3),
  );
});
