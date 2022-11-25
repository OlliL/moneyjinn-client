import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import type { ShowCapitalsourceListResponse } from "@/model/rest/capitalsource/ShowCapitalsourceListResponse";
import { throwError } from "@/tools/views/ThrowError";
import { mapCapitalsourceTransportToModel } from "./mapper/CapitalsourceTransportMapper";

class CapitalsourceControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "capitalsource";

  async fetchAllCapitalsource(): Promise<Array<Capitalsource>> {
    const usecase = "showCapitalsourceList/all/currentlyValid/false";
    const response = await super.get(
      CapitalsourceControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showCapitalsourceListResponse =
      (await response.json()) as ShowCapitalsourceListResponse;

    if (showCapitalsourceListResponse.error) {
      throwError(showCapitalsourceListResponse.error.code);
    }

    const capitalsourceArray = new Array<Capitalsource>();
    const transport = await showCapitalsourceListResponse
      .showCapitalsourceListResponse.capitalsourceTransport;
    transport?.forEach((value) => {
      capitalsourceArray.push(mapCapitalsourceTransportToModel(value));
    });

    return capitalsourceArray;
  }
}

export default new CapitalsourceControllerHandler();
