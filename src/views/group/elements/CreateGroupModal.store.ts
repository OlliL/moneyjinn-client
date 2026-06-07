import type { Group } from "@/model/group/Group";
import GroupService from "@/service/GroupService";
import { createCreateModalStore } from "@/stores/CreateModalStoreFactory";

export const useCreateGroupModalStore = createCreateModalStore<Group>(
  "createGroupModal",
  {
    titleCreate: "Group.title.create",
    titleUpdate: "Group.title.update",
    createFn: (e) => GroupService.createGroup(e),
    updateFn: (e) => GroupService.updateGroup(e),
    getEmptyEntity: () => ({}) as Group,
  },
);
