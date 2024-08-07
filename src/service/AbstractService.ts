import type { BaseAPI } from "@/api/base";
import { AxiosSingleton } from "../config/AxiosSingleton";

abstract class AbstractService {
  protected RETURN: string = "return=";
  protected RET_MINIMAL: string = this.RETURN + "minimal";
  protected RET_REPRESENTATION: string = this.RETURN + "representation";

  protected createApi<T extends BaseAPI>(clazz: new (...data: any) => T): T {
    return new clazz(
      undefined,
      "",
      AxiosSingleton.getInstance().getAxiosInstance(),
    );
  }
}

export default AbstractService;
