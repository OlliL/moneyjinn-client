import { EventControllerApi } from "@/api";
import AbstractService from "@/service/AbstractService";
import type { Events } from "@/model/event/Events";

class EventService extends AbstractService {
  private readonly api: EventControllerApi;

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

export default new EventService();
