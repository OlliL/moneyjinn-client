import type { BackendError } from "@/model/BackendError";
import type { AvailableMonth } from "@/model/report/AvailableMonth";
import type { Report } from "@/model/report/Report";
import type { Trends } from "@/model/report/Trends";
import type { TrendsParameter } from "@/model/report/TrendsParameter";
import ReportService from "@/service/ReportService";
import { vi } from "vitest";

export default class ReportServiceMocker {
  static mockGetAvailableMonth(availableMonth: AvailableMonth): void {
    ReportService.getAvailableMonth = vi.fn().mockResolvedValue(availableMonth);
  }

  static mockListReports(report: Report): void {
    ReportService.listReports = vi.fn().mockResolvedValue(report);
  }

  static mockShowTrendsGraphResolved(result: Trends): void {
    ReportService.showTrendsGraph = vi.fn().mockResolvedValue(result);
  }
  static mockShowTrendsGraphRejected(error: BackendError): void {
    ReportService.showTrendsGraph = vi.fn().mockRejectedValue(error);
  }

  static mockShowTrendsFormResolved(result: TrendsParameter): void {
    ReportService.showTrendsForm = vi.fn().mockResolvedValue(result);
  }
  static mockShowTrendsFormRejected(error: BackendError): void {
    ReportService.showTrendsForm = vi.fn().mockRejectedValue(error);
  }
}
