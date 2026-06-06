import type { User } from "@/model/user/User";
import { createDeleteModalStore } from "@/stores/DeleteModalStoreFactory";

export const useDeleteUserModalStore =
  createDeleteModalStore<User>("deleteUserModal");

export default useDeleteUserModalStore;
