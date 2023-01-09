import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import type { PostingAccountValidation } from "@/model/postingaccount/PostingAccountValidation";
import type { CreatePostingAccountRequest } from "@/model/rest/postingaccount/CreatePostingAccountRequest";
import type { CreatePostingAccountResponse } from "@/model/rest/postingaccount/CreatePostingAccountResponse";
import type { ShowPostingAccountListResponse } from "@/model/rest/postingaccount/ShowPostingAccountListResponse";
import type { UpdatePostingAccountRequest } from "@/model/rest/postingaccount/UpdatePostingAccountRequest";
import type { ValidationResponse } from "@/model/rest/ValidationResponse";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { throwError } from "@/tools/views/ThrowError";
import {
  mapPostingAccountToTransport,
  mapPostingAccountTransportToModel,
} from "./mapper/PostingAccountTransportMapper";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";

class PostingAccountControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "postingaccount";

  async fetchAllPostingAccount(): Promise<Array<PostingAccount>> {
    const usecase = "showPostingAccountList";
    const response = await super.get(
      PostingAccountControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showPostingAccountListResponse =
      (await response.json()) as ShowPostingAccountListResponse;

    if (showPostingAccountListResponse.code) {
      throwError(showPostingAccountListResponse.code);
    }

    const postingAccountArray = new Array<PostingAccount>();
    const transports =
      await showPostingAccountListResponse.postingAccountTransports;
    transports?.forEach((value) => {
      postingAccountArray.push(mapPostingAccountTransportToModel(value));
    });

    return postingAccountArray;
  }

  async createPostingAccount(
    mpa: PostingAccount
  ): Promise<PostingAccountValidation> {
    const usecase = "createPostingAccount";
    const request = {} as CreatePostingAccountRequest;
    request.postingAccountTransport = mapPostingAccountToTransport(mpa);

    const response = await super.post(
      request,
      PostingAccountControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const createPostingAccountResponse =
      (await response.json()) as CreatePostingAccountResponse;
    const postingAccountValidation = {} as PostingAccountValidation;
    const validationResult: ValidationResult = {
      result: createPostingAccountResponse.result,
      validationResultItems:
        createPostingAccountResponse.validationItemTransports?.map((vit) => {
          return mapValidationItemTransportToModel(vit);
        }),
    };

    postingAccountValidation.validationResult = validationResult;

    if (validationResult.result) {
      const createdMpa: PostingAccount = {
        id: createPostingAccountResponse.postingAccountId,
        name: mpa.name,
      };
      postingAccountValidation.mpa = createdMpa;
    }
    return postingAccountValidation;
  }

  async updatePostingAccount(mcp: PostingAccount): Promise<ValidationResult> {
    const usecase = "updatePostingAccount";
    const request = {} as UpdatePostingAccountRequest;
    request.postingAccountTransport = mapPostingAccountToTransport(mcp);

    const response = await super.put(
      request,
      PostingAccountControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const validationResponse = (await response.json()) as ValidationResponse;
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

  async deletePostingAccount(postingAccountId: number) {
    const usecase = "deletePostingAccountById/" + postingAccountId;

    const response = await super.delete(
      PostingAccountControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }
}

export default new PostingAccountControllerHandler();
