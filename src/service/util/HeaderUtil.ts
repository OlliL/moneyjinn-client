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

  public async addAuthorizationHeader(headers: Record<string, string>) {
    const accessToken = await getAccessToken();
    headers["Authorization"] = "Bearer " + accessToken;
  }

  private getCookie(name: string) {
    const match = new RegExp("(^|;\\s*)(" + name + ")=([^;]*)").exec(
      document.cookie,
    );
    return match ? decodeURIComponent(match[3] ?? "") : null;
  }

  public addXsrfHeader(headers: Record<string, string>) {
    const xsrfToken = this.getCookie("XSRF-TOKEN");
    if (xsrfToken) {
      headers["X-XSRF-TOKEN"] = xsrfToken;
    }
  }
}
