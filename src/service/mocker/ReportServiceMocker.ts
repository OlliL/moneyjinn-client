import type { AvailableMonth } from "@/model/report/AvailableMonth";
import type { Report } from "@/model/report/Report";
import ReportService from "@/service/ReportService";
import { vi } from "vitest";

export default class ReportServiceMocker {
  static mockGetAvailableMonth(availableMonth: AvailableMonth): void {
    ReportService.getAvailableMonth = vi.fn().mockResolvedValue(availableMonth);
  }

  static mockListReports(report: Report): void {
    ReportService.listReports = vi.fn().mockResolvedValue(report);
  }
}
