import { createI18n } from "vue-i18n";
import de from "../locales/de.json";
import en from "../locales/en.json";

export class I18nHolder {
  // @ts-ignore
  private i18n;

  public constructor() {
    this.i18n = createI18n({
      legacy: false,
      locale: navigator.language,
      fallbackLocale: "en",
      messages: { de, en },
    });
  }

  public t() {
    return this.i18n.global.t;
  }

  public getI18n() {
    return this.i18n;
  }
}
export default new I18nHolder();
