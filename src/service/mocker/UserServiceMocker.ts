import { BackendError } from "@/model/BackendError";
import type { AccessRelation } from "@/model/user/AccessRelation";
import type { User } from "@/model/user/User";
import UserService from "@/service/UserService";
import { vi } from "vitest";

export default class UserServiceMocker {
  static mockCreateUserResolved(user: User): void {
    UserService.createUser = vi.fn().mockResolvedValue(user);
  }

  static mockUpdateUserResolved(): void {
    UserService.updateUser = vi.fn().mockResolvedValue(undefined);
  }

  static mockGetAllAccessRelationsResolved(
    accessRelations: AccessRelation[],
  ): void {
    UserService.getAllAccessRelations = vi
      .fn()
      .mockResolvedValue(accessRelations);
  }

  static mockCreateUserRejected(error: BackendError): void {
    UserService.createUser = vi.fn().mockRejectedValue(error);
  }
}
