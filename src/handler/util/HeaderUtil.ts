import { getAccessToken } from "axios-jwt";

export class HeaderUtil {
  private static instance: HeaderUtil;

  private constructor() {}

  public static getInstance(): HeaderUtil {
    if (!HeaderUtil.instance) {
      HeaderUtil.instance = new HeaderUtil();
    }
    return HeaderUtil.instance;
  }

  public addAuthorizationHeader(headers: Record<string, string>) {
    const accessToken = getAccessToken();
    headers["Authorization"] = "Bearer " + accessToken;
  }

  private getCookie(name: string) {
    const match = document.cookie.match(
      new RegExp("(^|;\\s*)(" + name + ")=([^;]*)")
    );
    return match ? decodeURIComponent(match[3]) : null;
  }

  public addXsrfHeader(headers: Record<string, string>) {
    const xsrfToken = this.getCookie("XSRF-TOKEN");
    if (xsrfToken) {
      headers["X-XSRF-TOKEN"] = xsrfToken;
    }
  }
}
