import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { Events } from "@/model/event/Events";
import type { ShowEventListResponse } from "@/model/rest/event/ShowEventListResponse";
import { throwError } from "@/tools/views/ThrowError";

class EventControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "event";

  async showEventList(): Promise<Events> {
    const usecase = "showEventList";

    const response = await super.get(
      EventControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showEventListResponse =
      (await response.json()) as ShowEventListResponse;

    if (showEventListResponse.error) {
      throwError(showEventListResponse.error.code);
    }

    const innerResponse = showEventListResponse.showEventListResponse;

    return innerResponse;
  }
}

export default new EventControllerHandler();