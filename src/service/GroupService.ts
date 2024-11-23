import {
  GroupControllerApi,
  type CreateGroupRequest,
  type UpdateGroupRequest,
} from "@/api";
import AbstractService from "@/service/AbstractService";
import type { Group } from "@/model/group/Group";
import {
  mapGroupToTransport,
  mapGroupTransportToModel,
} from "./mapper/GroupTransportMapper";

class GroupService extends AbstractService {
  private readonly api: GroupControllerApi;

  public constructor() {
    super();

    this.api = super.createApi(GroupControllerApi);
  }

  async fetchAllGroup(): Promise<Array<Group>> {
    const response = await this.api.showGroupList();

    const showGroupListResponse = response.data;

    const GroupArray = new Array<Group>();
    const transports = showGroupListResponse.groupTransports;
    transports?.forEach((value) => {
      GroupArray.push(mapGroupTransportToModel(value));
    });

    return GroupArray;
  }

  async createGroup(mpm: Group): Promise<Group> {
    const request = {} as CreateGroupRequest;
    request.groupTransport = mapGroupToTransport(mpm);

    const response = await this.api.createGroup(request);

    const createGroupResponse = response.data;

    const createMpm: Group = mpm;
    createMpm.id = createGroupResponse.groupId;

    return createMpm;
  }
  async updateGroup(mpm: Group) {
    const request = {} as UpdateGroupRequest;
    request.groupTransport = mapGroupToTransport(mpm);

    await this.api.updateGroup(request);
  }

  async deleteGroup(id: number) {
    await this.api.deleteGroupById(id);
  }
}

export default new GroupService();
