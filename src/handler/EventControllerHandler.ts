import { EventControllerApi } from "@/api";
import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { Events } from "@/model/event/Events";

class EventControllerHandler extends AbstractControllerHandler {
  private api: EventControllerApi;

  public constructor() {
    super();

    this.api = super.createApi(EventControllerApi);
  }

  async showEventList(): Promise<Events> {
    const response = await this.api.showEventList();

    const showEventListResponse = response.data;

    return showEventListResponse;
  }
}

export default new EventControllerHandler();
