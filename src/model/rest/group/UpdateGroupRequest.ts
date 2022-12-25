import type { GroupTransport } from "../transport/GroupTransport";

export type UpdateGroupRequest = {
  updateGroupRequest: {
    groupTransport: GroupTransport;
  };
};
