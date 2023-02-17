import type { MoneyflowSearchParamsTransport } from "@/api";
import type { MoneyflowSearchParams } from "@/model/moneyflow/MoneyflowSearchParams";
import { getISOStringDate } from "@/tools/views/FormatDate";

export function mapMoneyflowSearchParamsToTransport(
  model: MoneyflowSearchParams
): MoneyflowSearchParamsTransport {
  const transport: MoneyflowSearchParamsTransport = {
    startDate: getISOStringDate(model.startDate),
    endDate: getISOStringDate(model.endDate),
    searchString: model.searchString,
    featureEqual: model.featureEqual ? 1 : 0,
    featureRegexp: model.featureRegexp ? 1 : 0,
    featureCaseSensitive: model.featureCaseSensitive ? 1 : 0,
    featureOnlyMinusAmounts: model.featureOnlyMinusAmounts ? 1 : 0,
    contractpartnerId: model.contractpartnerId,
    postingAccountId: model.postingAccountId,
  };
  return transport;
}
