import { useUserSessionStore } from "@/stores/UserSessionStore";
import { waitFor } from "@testing-library/vue";
import { expect } from "vitest";

export async function assertHaveBeenCalled(func: any) {
  await waitFor(() => expect(func).toHaveBeenCalled());
}

export async function assertHaveBeenCalledOnce(func: any) {
  await waitFor(() => expect(func).toHaveBeenCalledOnce());
}

export async function assertHaveBeenCalledTimes(func: any, times: number) {
  await waitFor(() => expect(func).toHaveBeenCalledTimes(times));
}

export async function assertHaveBeenCalledWith(
  func: any,
  ...calledWith: any[]
) {
  await waitFor(() => expect(func).toHaveBeenCalledWith(...calledWith));
}

export async function assertNotHaveBeenCalled(func: any) {
  await waitFor(() => expect(func).not.toHaveBeenCalled());
}

export function setupUserStandard() {
  useUserSessionStore().setUserSession({
    userId: 1,
    userName: "standard-user",
    userIsAdmin: false,
    userCanLogin: true,
    userIsNew: false,
  });
}

export function setupUserNew() {
  useUserSessionStore().setUserSession({
    userId: 1,
    userName: "new-user",
    userIsAdmin: false,
    userCanLogin: true,
    userIsNew: true,
  });
}
