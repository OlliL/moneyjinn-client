import type { Configuration } from "@/api";
import type { BaseAPI } from "@/api/base";
import type { AxiosInstance } from "axios";
import { AxiosSingleton } from "../config/AxiosSingleton";

type ApiConstructor<T> = new (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance,
) => T;

abstract class AbstractService {
  protected RETURN: string = "return=";
  protected RET_MINIMAL: string = this.RETURN + "minimal";
  protected RET_REPRESENTATION: string = this.RETURN + "representation";

  protected createApi<T extends BaseAPI>(clazz: ApiConstructor<T>): T {
    return new clazz(
      undefined,
      "",
      AxiosSingleton.getInstance().getAxiosInstance(),
    );
  }
}

export default AbstractService;
