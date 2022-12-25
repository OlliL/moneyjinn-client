import type { CompareData } from "./CompareData";

export type CompareDataResult = {
  compareDatasMatching: Array<CompareData>;
  compareDatasWrongCapitalsource: Array<CompareData>;
  compareDatasNotInFile: Array<CompareData>;
  compareDatasNotInDatabase: Array<CompareData>;
};
