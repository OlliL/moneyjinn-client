import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import type { PostingAccountValidation } from "@/model/postingaccount/PostingAccountValidation";
import type { CreatePostingAccountRequest } from "@/model/rest/postingaccount/CreatePostingAccountRequest";
import type { CreatePostingAccountResponse } from "@/model/rest/postingaccount/CreatePostingAccountResponse";
import type { ShowPostingAccountListResponse } from "@/model/rest/postingaccount/ShowPostingAccountListResponse";
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
    const usecase = "showPostingAccountList/all";
    const response = await super.get(
      PostingAccountControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showPostingAccountListResponse =
      (await response.json()) as ShowPostingAccountListResponse;

    if (showPostingAccountListResponse.error) {
      throwError(showPostingAccountListResponse.error.code);
    }

    const postingAccountArray = new Array<PostingAccount>();
    const transport = await showPostingAccountListResponse
      .showPostingAccountListResponse.postingAccountTransport;
    transport?.forEach((value) => {
      postingAccountArray.push(mapPostingAccountTransportToModel(value));
    });

    return postingAccountArray;
  }

  async createPostingAccount(
    mpa: PostingAccount
  ): Promise<PostingAccountValidation> {
    const usecase = "createPostingAccount";
    const request = {
      createPostingAccountRequest: {},
    } as CreatePostingAccountRequest;
    const innerRequest = request.createPostingAccountRequest;
    innerRequest.postingAccountTransport = mapPostingAccountToTransport(mpa);

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
    const innerResponse =
      createPostingAccountResponse.createPostingAccountResponse;
    const postingAccountValidation = {} as PostingAccountValidation;
    const validationResult: ValidationResult = {
      result: innerResponse.result,
      validationResultItems: innerResponse.validationItemTransport?.map(
        (vit) => {
          return mapValidationItemTransportToModel(vit);
        }
      ),
    };

    postingAccountValidation.validationResult = validationResult;

    if (validationResult.result) {
      const createdMpa: PostingAccount = {
        id: innerResponse.postingAccountId,
        name: mpa.name,
      };
      postingAccountValidation.mpa = createdMpa;
    }
    return postingAccountValidation;
  }
}

export default new PostingAccountControllerHandler();
