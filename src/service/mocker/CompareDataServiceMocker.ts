import type { CompareDataParameter } from "@/model/comparedata/CompareDataParameter";
import type { CompareDataResult } from "@/model/comparedata/CompareDataResult";
import CompareDataService from "@/service/CompareDataService";
import { vi } from "vitest";

export default class CompareDataServiceMocker {
  static mockShowCompareDataFormResolved(
    compareDataParameter: CompareDataParameter,
  ): void {
    CompareDataService.showCompareDataForm = vi
      .fn()
      .mockResolvedValue(compareDataParameter);
  }

  static mockCompareDataResolved(compareDataResult: CompareDataResult): void {
    CompareDataService.compareData = vi
      .fn()
      .mockResolvedValue(compareDataResult);
  }
}
