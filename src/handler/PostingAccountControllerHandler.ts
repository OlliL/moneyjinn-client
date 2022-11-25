import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import type { ShowPostingAccountListResponse } from "@/model/rest/postingaccount/ShowPostingAccountListResponse";
import { throwError } from "@/tools/views/ThrowError";

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

    const postingAccountArray = (await showPostingAccountListResponse
      .showPostingAccountListResponse
      .postingAccountTransport) as Array<PostingAccount>;

    return postingAccountArray;
  }
}

export default new PostingAccountControllerHandler();
