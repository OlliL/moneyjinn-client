import type { Group } from "@/model/group/Group";
import GroupService from "@/service/GroupService";
import { vi } from "vitest";

export default class GroupServiceMocker {
  static mockFetchAllGroup(groups: Group[]): void {
    GroupService.fetchAllGroup = vi.fn().mockResolvedValue(groups);
  }
}

