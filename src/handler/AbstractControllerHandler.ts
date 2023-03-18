abstract class AbstractControllerHandler {
  protected RETURN: string = "return=";
  protected RET_MINIMAL: string = this.RETURN + "minimal";
  protected RET_REPRESENTATION: string = this.RETURN + "representation";
}

export default AbstractControllerHandler;
