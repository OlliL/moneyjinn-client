import {
  GroupControllerApi,
  type CreateGroupRequest,
  type UpdateGroupRequest,
} from "@/api";
import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { Group } from "@/model/group/Group";
import type { GroupValidation } from "@/model/group/GroupValidation";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { AxiosInstanceHolder } from "./AxiosInstanceHolder";
import {
  mapGroupToTransport,
  mapGroupTransportToModel,
} from "./mapper/GroupTransportMapper";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";

class GroupControllerHandler extends AbstractControllerHandler {
  private api: GroupControllerApi;

  public constructor() {
    super();

    this.api = new GroupControllerApi(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance()
    );
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

  async createGroup(mpm: Group): Promise<GroupValidation> {
    const request = {} as CreateGroupRequest;
    request.groupTransport = mapGroupToTransport(mpm);

    const response = await this.api.createGroup(request);

    const createGroupResponse = response.data;

    const groupValidation = {} as GroupValidation;
    const validationResult: ValidationResult = {
      result: createGroupResponse.result,
      validationResultItems: createGroupResponse.validationItemTransports?.map(
        (vit) => {
          return mapValidationItemTransportToModel(vit);
        }
      ),
    };

    groupValidation.validationResult = validationResult;

    if (validationResult.result && createGroupResponse.groupId) {
      const createMpm: Group = mpm;
      createMpm.id = createGroupResponse.groupId;
      groupValidation.group = createMpm;
    }

    return groupValidation;
  }
  async updateGroup(mpm: Group): Promise<ValidationResult> {
    const request = {} as UpdateGroupRequest;
    request.groupTransport = mapGroupToTransport(mpm);

    const response = await this.api.updateGroup(request);

    const validationResponse = response.data;

    const validationResult: ValidationResult = {
      result: validationResponse.result,
      validationResultItems: validationResponse.validationItemTransports?.map(
        (vit) => {
          return mapValidationItemTransportToModel(vit);
        }
      ),
    };

    return validationResult;
  }
  async deleteGroup(id: number) {
    await this.api.deleteGroupById(id);
  }
}

export default new GroupControllerHandler();
