import {
  PostingAccountControllerApi,
  type CreatePostingAccountRequest,
  type UpdatePostingAccountRequest,
} from "@/api";
import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import type { PostingAccountValidation } from "@/model/postingaccount/PostingAccountValidation";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { AxiosInstanceHolder } from "./AxiosInstanceHolder";
import {
  mapPostingAccountToTransport,
  mapPostingAccountTransportToModel,
} from "./mapper/PostingAccountTransportMapper";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";

class PostingAccountControllerHandler extends AbstractControllerHandler {
  private api: PostingAccountControllerApi;

  public constructor() {
    super();

    this.api = new PostingAccountControllerApi(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance()
    );
  }

  private static CONTROLLER = "postingaccount";

  async fetchAllPostingAccount(): Promise<Array<PostingAccount>> {
    const response = await this.api.showPostingAccountList();

    super.handleResponseError(response);

    const showPostingAccountListResponse = response.data;

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
    const request = {} as CreatePostingAccountRequest;
    request.postingAccountTransport = mapPostingAccountToTransport(mpa);

    const response = await this.api.createPostingAccount(request);

    super.handleResponseError(response);

    const createPostingAccountResponse = response.data;

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
    const request = {} as UpdatePostingAccountRequest;
    request.postingAccountTransport = mapPostingAccountToTransport(mcp);

    const response = await this.api.updatePostingAccount(request);

    super.handleResponseError(response);

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

  async deletePostingAccount(id: number) {
    const response = await this.api.deletePostingAccountById(id);
    return super.handleResponseError(response);
  }
}

export default new PostingAccountControllerHandler();
