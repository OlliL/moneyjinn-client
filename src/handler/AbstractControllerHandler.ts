import { AxiosInstanceHolder } from "./AxiosInstanceHolder";

abstract class AbstractControllerHandler {
  protected RETURN: string = "return=";
  protected RET_MINIMAL: string = this.RETURN + "minimal";
  protected RET_REPRESENTATION: string = this.RETURN + "representation";

  protected createApi<T>(clazz: new (...data: any) => T): T {
    return new clazz(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance(),
    );
  }
}

export default AbstractControllerHandler;
