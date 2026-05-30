import { BackendError } from "@/model/BackendError";
import type { Group } from "@/model/group/Group";
import GroupService from "@/service/GroupService";
import { vi } from "vitest";

export default class GroupServiceMocker {
  static mockFetchAllGroup(groups: Group[]): void {
    GroupService.fetchAllGroup = vi.fn().mockResolvedValue(groups);
  }

  static mockCreateGroupResolved(group: Group): void {
    GroupService.createGroup = vi.fn().mockResolvedValue(group);
  }

  static mockUpdateGroupResolved(): void {
    GroupService.updateGroup = vi.fn().mockResolvedValue(undefined);
  }

  static mockCreateGroupRejected(error: BackendError): void {
    GroupService.createGroup = vi.fn().mockRejectedValue(error);
  }
}
