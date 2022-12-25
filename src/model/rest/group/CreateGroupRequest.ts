import type { GroupTransport } from "../transport/GroupTransport";

export type CreateGroupRequest = {
  createGroupRequest: {
    groupTransport: GroupTransport;
  };
};
