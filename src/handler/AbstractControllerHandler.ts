import { throwError } from "@/tools/views/ThrowError";
import type { AxiosResponse } from "axios";

abstract class AbstractControllerHandler {
  protected handleResponseError(response: AxiosResponse) {
    if (response.status === 204) {
      return;
    }

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    const errorResponse = response.data;
    if (errorResponse.code) {
      throwError(errorResponse.code);
    }
  }
}

export default AbstractControllerHandler;
