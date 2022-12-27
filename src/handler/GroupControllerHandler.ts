import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { Group } from "@/model/group/Group";
import type { GroupValidation } from "@/model/group/GroupValidation";
import type { ErrorResponse } from "@/model/rest/ErrorResponse";
import type { CreateGroupRequest } from "@/model/rest/group/CreateGroupRequest";
import type { CreateGroupResponse } from "@/model/rest/group/CreateGroupResponse";
import type { ShowGroupListResponse } from "@/model/rest/group/ShowGroupListResponse";
import type { UpdateGroupRequest } from "@/model/rest/group/UpdateGroupRequest";
import type { ValidationResponse } from "@/model/rest/ValidationResponse";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import type { ValidationResultItem } from "@/model/validation/ValidationResultItem";
import { throwError } from "@/tools/views/ThrowError";
import {
  mapGroupToTransport,
  mapGroupTransportToModel,
} from "./mapper/GroupTransportMapper";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";

class GroupControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "group";

  async fetchAllGroup(): Promise<Array<Group>> {
    const usecase = "showGroupList";
    const response = await super.get(
      GroupControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showGroupListResponse =
      (await response.json()) as ShowGroupListResponse;

    if (showGroupListResponse.error) {
      throwError(showGroupListResponse.error.code);
    }

    const GroupArray = new Array<Group>();
    const transport = await showGroupListResponse.showGroupListResponse
      .groupTransport;
    transport?.forEach((value) => {
      GroupArray.push(mapGroupTransportToModel(value));
    });

    return GroupArray;
  }

  async createGroup(mpm: Group): Promise<GroupValidation> {
    const usecase = "createGroup";
    const request = {
      createGroupRequest: {},
    } as CreateGroupRequest;
    const innerRequest = request.createGroupRequest;
    innerRequest.groupTransport = mapGroupToTransport(mpm);

    const response = await super.post(
      request,
      GroupControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const createGroupResponse = (await response.json()) as CreateGroupResponse;
    const innerResponse = createGroupResponse.createGroupResponse;
    const groupValidation = {} as GroupValidation;
    const validationResult: ValidationResult = {
      result: innerResponse.result,
      validationResultItems: innerResponse.validationItemTransport?.map(
        (vit) => {
          return mapValidationItemTransportToModel(vit);
        }
      ),
    };

    groupValidation.validationResult = validationResult;

    if (validationResult.result) {
      const createMpm: Group = mpm;
      createMpm.id = innerResponse.groupId;
      groupValidation.group = createMpm;
    }
    return groupValidation;
  }
  async updateGroup(mpm: Group): Promise<ValidationResult> {
    const usecase = "updateGroup";
    const request = {
      updateGroupRequest: {},
    } as UpdateGroupRequest;
    const innerRequest = request.updateGroupRequest;
    innerRequest.groupTransport = mapGroupToTransport(mpm);

    const response = await super.put(
      request,
      GroupControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const validationResponse = (await response.json()) as ValidationResponse;
    const innerResponse = validationResponse.validationResponse;
    const validationResult: ValidationResult = {
      result: innerResponse.result,
      validationResultItems: innerResponse.validationItemTransport?.map(
        (vit) => {
          return mapValidationItemTransportToModel(vit);
        }
      ),
    };

    return validationResult;
  }
  async deleteGroup(id: number): Promise<ValidationResult> {
    const usecase = "deleteGroupById/" + id;

    const response = await super.delete(
      GroupControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const validationResult = {} as ValidationResult;
    if (response.status === 204) {
      validationResult.result = true;
    } else {
      const errorResponse = (await response.json()) as ErrorResponse;
      const validationResultItem = {
        error: errorResponse.error.code,
      } as ValidationResultItem;
      validationResult.result = false;
      validationResult.validationResultItems = [validationResultItem];
    }
    return validationResult;
  }
}

export default new GroupControllerHandler();
