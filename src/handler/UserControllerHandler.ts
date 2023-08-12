import { clearAuthTokens, setAuthTokens } from "axios-jwt";
import { AxiosInstanceHolder } from "./AxiosInstanceHolder";
import {
  UserControllerApi,
  type ChangePasswordRequest,
  type CreateUserRequest,
  type LoginRequest,
  type UpdateUserRequest,
} from "@/api";

import {
  useUserSessionStore,
  type UserSession,
} from "@/stores/UserSessionStore";

import { mapGroupTransportToModel } from "./mapper/GroupTransportMapper";
import {
  mapUserToTransport,
  mapUserTransportToModel,
} from "./mapper/UserTransportMapper";
import {
  mapAccessRelationToTransport,
  mapAccessRelationTransportToModel,
} from "./mapper/AccessRelationTransportMapper";

import type { Group } from "@/model/group/Group";
import type { AccessRelation } from "@/model/user/AccessRelation";
import type { User } from "@/model/user/User";

import AbstractControllerHandler from "@/handler/AbstractControllerHandler";

class UserControllerHandler extends AbstractControllerHandler {
  private api: UserControllerApi;

  public constructor() {
    super();

    this.api = new UserControllerApi(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance()
    );
  }

  async login(username: string, password: string): Promise<void> {
    const loginRequest: LoginRequest = {
      userName: username,
      userPassword: password,
    };

    const userSessionStore = useUserSessionStore();
    userSessionStore.logout();
    await clearAuthTokens();

    const response = await this.api.login(loginRequest);
    const loginResponse = response.data;

    const userTransport = loginResponse.userTransport;

    const userSession: UserSession = {
      userId: userTransport.id,
      userName: userTransport.userName,
      userCanLogin: userTransport.userCanLogin === 1 ? true : false,
      userIsNew: userTransport.userIsNew === 1 ? true : false,
      userIsAdmin: userTransport.userIsAdmin === 1 ? true : false,
    };

    userSessionStore.setUserSession(userSession);

    await setAuthTokens({
      accessToken: loginResponse.token,
      refreshToken: loginResponse.refreshToken,
    });
  }

  async changePassword(oldPassword: string, password: string) {
    const request: ChangePasswordRequest = {
      password: password,
      oldPassword: oldPassword,
    };

    await this.api.changePassword(request);
  }

  async fetchAllUser(): Promise<Array<User>> {
    const response = await this.api.showUserList();
    const showUserListResponse = response.data;
    const groups: Array<Group> = showUserListResponse.groupTransports.map(
      (value) => {
        return mapGroupTransportToModel(value);
      }
    );
    const users: Array<User> = showUserListResponse.userTransports.map(
      (value_1) => {
        return mapUserTransportToModel(value_1);
      }
    );
    const accessRelations: Array<AccessRelation> =
      showUserListResponse.accessRelationTransports.map((value_2) => {
        return mapAccessRelationTransportToModel(value_2);
      });
    const groupsById = new Map<number, Group>();
    for (const group of groups) {
      groupsById.set(group.id, group);
    }
    const accessRelationsById = new Map<number, AccessRelation>();
    for (const accessRelation of accessRelations) {
      if (accessRelation.id)
        accessRelationsById.set(accessRelation.id, accessRelation);
    }
    for (const user of users) {
      const accessRelation_1 = accessRelationsById.get(user.id);
      if (accessRelation_1) {
        user.groupId = accessRelation_1.refId;
        const group_1 = groupsById.get(user.groupId);
        if (group_1) {
          user.groupName = group_1.name;
        }
      }
    }
    return users;
  }

  async getAllAccessRelations(userId: number): Promise<Array<AccessRelation>> {
    const response = await this.api.showEditUser(userId);
    const showEditUserResponse = response.data;
    const accessRelations: Array<AccessRelation> =
      showEditUserResponse.accessRelationTransports.map((value) => {
        return mapAccessRelationTransportToModel(value);
      });
    return accessRelations;
  }

  async createUser(mpm: User): Promise<User> {
    const request = {} as CreateUserRequest;
    request.userTransport = mapUserToTransport(mpm);

    if (mpm.groupId) {
      const mar: AccessRelation = {
        refId: mpm.groupId,
        validFrom: new Date(),
      };
      request.accessRelationTransport = mapAccessRelationToTransport(mar);
    }

    const response = await this.api.createUser(request);

    const createUserResponse = response.data;
    const createMpm: User = mpm;
    createMpm.id = createUserResponse.userId;

    return createMpm;
  }

  async updateUser(mpm: User, mar: AccessRelation) {
    const request = {} as UpdateUserRequest;
    request.userTransport = mapUserToTransport(mpm);
    request.accessRelationTransport = mapAccessRelationToTransport(mar);

    await this.api.updateUser(request);
  }

  async deleteUser(id: number) {
    await this.api.deleteUserById(id);
  }
}

export default new UserControllerHandler();
