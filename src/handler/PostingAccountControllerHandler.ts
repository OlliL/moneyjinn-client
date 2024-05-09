import {
  PostingAccountControllerApi,
  type CreatePostingAccountRequest,
  type UpdatePostingAccountRequest,
} from "@/api";
import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import {
  mapPostingAccountToTransport,
  mapPostingAccountTransportToModel,
} from "./mapper/PostingAccountTransportMapper";

class PostingAccountControllerHandler extends AbstractControllerHandler {
  private api: PostingAccountControllerApi;

  public constructor() {
    super();

    this.api = super.createApi(PostingAccountControllerApi);
  }

  private static CONTROLLER = "postingaccount";

  async fetchAllPostingAccount(): Promise<Array<PostingAccount>> {
    const response = await this.api.showPostingAccountList();

    const showPostingAccountListResponse = response.data;

    const postingAccountArray = new Array<PostingAccount>();
    const transports =
      await showPostingAccountListResponse.postingAccountTransports;
    transports?.forEach((value) => {
      postingAccountArray.push(mapPostingAccountTransportToModel(value));
    });

    return postingAccountArray;
  }

  async createPostingAccount(mpa: PostingAccount): Promise<PostingAccount> {
    const request = {} as CreatePostingAccountRequest;
    request.postingAccountTransport = mapPostingAccountToTransport(mpa);

    const response = await this.api.createPostingAccount(request);

    const createPostingAccountResponse = response.data;

    const createdMpa: PostingAccount = {
      id: createPostingAccountResponse.postingAccountId,
      name: mpa.name,
    };

    return createdMpa;
  }

  async updatePostingAccount(mcp: PostingAccount) {
    const request = {} as UpdatePostingAccountRequest;
    request.postingAccountTransport = mapPostingAccountToTransport(mcp);

    await this.api.updatePostingAccount(request);
  }

  async deletePostingAccount(id: number) {
    await this.api.deletePostingAccountById(id);
  }
}

export default new PostingAccountControllerHandler();
