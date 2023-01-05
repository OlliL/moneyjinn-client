import { useUserSessionStore } from "@/stores/UserSessionStore";

export class HeaderUtil {
  private static instance: HeaderUtil;
  private userSessionStore = useUserSessionStore();

  private constructor() {}

  public static getInstance(): HeaderUtil {
    if (!HeaderUtil.instance) {
      HeaderUtil.instance = new HeaderUtil();
    }
    return HeaderUtil.instance;
  }

  public addAuthorizationHeader(headers: Record<string, string>) {
    const token = this.userSessionStore.getAuthorizationToken;
    headers["Authorization"] = "Bearer " + token;
  }

  public addCsrfHeader(headers: Record<string, string>) {
    const csrfToken = this.userSessionStore.csrfToken;
    headers["X-CSRF-TOKEN"] = csrfToken;
  }

  public addContentTypeJson(headers: Record<string, string>) {
    headers["Content-Type"] = "application/json";
  }
}
