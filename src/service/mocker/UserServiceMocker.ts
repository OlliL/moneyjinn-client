import type { User } from "@/model/user/User";
import UserService from "@/service/UserService";
import { vi } from "vitest";

export default class UserServiceMocker {
  static mockFetchAllUser(users: User[]): void {
    UserService.fetchAllUser = vi.fn().mockResolvedValue(users);
  }

  static mockGetAllAccessRelations(accessRelations: unknown[]): void {
    UserService.getAllAccessRelations = vi
      .fn()
      .mockResolvedValue(accessRelations as never);
  }
}
