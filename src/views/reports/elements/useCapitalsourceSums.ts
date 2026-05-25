import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsource";
import { computed, type Ref } from "vue";

export function useCapitalsourceSums(
  capitalsourceData: Ref<Array<ReportTurnoverCapitalsource>>,
) {
  const amountBeginOfMonthFixedSum = computed(() => {
    return capitalsourceData.value.reduce(
      (acc, cur) => acc + cur.amountBeginOfMonthFixed,
      0,
    );
  });
  const amountEndOfMonthCalculatedSum = computed(() => {
    return capitalsourceData.value.reduce(
      (acc, cur) => acc + cur.amountEndOfMonthCalculated,
      0,
    );
  });
  const amountEndOfMonthFixedSum = computed(() => {
    return capitalsourceData.value.reduce(
      (acc, cur) =>
        acc + (cur.amountEndOfMonthFixed ? cur.amountEndOfMonthFixed : 0),
      0,
    );
  });
  const amountCurrentSum = computed(() => {
    return capitalsourceData.value.reduce(
      (acc, cur) => acc + (cur.amountCurrent ? cur.amountCurrent : 0),
      0,
    );
  });
  const differenceFixedCalculatedSum = computed(() => {
    return capitalsourceData.value.reduce(
      (acc, cur) =>
        acc +
        ((cur.amountEndOfMonthFixed ? cur.amountEndOfMonthFixed : 0) -
          cur.amountEndOfMonthCalculated),
      0,
    );
  });

  return {
    amountBeginOfMonthFixedSum,
    amountEndOfMonthCalculatedSum,
    amountEndOfMonthFixedSum,
    amountCurrentSum,
    differenceFixedCalculatedSum,
  };
}
