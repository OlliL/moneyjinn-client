import type { Group } from "@/model/group/Group";
import { createDeleteModalStore } from "@/stores/DeleteModalStoreFactory";

export const useDeleteGroupModalStore =
  createDeleteModalStore<Group>("deleteGroupModal");

export default useDeleteGroupModalStore;
