<template>
  <ModalVue title="Buchungskonto hinzuf&uuml;gen" ref="modalComponent">
    <template #body
      ><form
        @submit.prevent="createPostingAccount"
        :id="'createPostingAccountForm' + idSuffix"
      >
        <div class="container-fluid">
          <div v-if="serverError">
            <div
              class="alert alert-danger"
              v-for="(error, index) in serverError"
              :key="index"
            >
              {{ error }}
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12">
              <div class="form-floating">
                <input
                  v-model="mpa.name"
                  :id="'comment' + idSuffix"
                  type="text"
                  @input="validateName"
                  :class="'form-control ' + nameErrorData.inputClass"
                />
                <label
                  :for="'comment' + idSuffix"
                  :style="'color: ' + nameErrorData.fieldColor"
                  >{{ nameErrorData.fieldLabel }}</label
                >
              </div>
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary" @click="resetForm">
        r&uuml;cksetzen
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :form="'createPostingAccountForm' + idSuffix"
      >
        Speichern
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import PostingAccountControllerHandler from "@/handler/PostingAccountControllerHandler";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { validateInputField } from "@/tools/views/ValidateInputField";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";
import { getError } from "@/tools/views/ThrowError";
import { mapActions } from "pinia";
import { usePostingAccountStore } from "@/stores/PostingAccountStore";
import type { ValidationResult } from "@/model/validation/ValidationResult";

type CreatePostingAccountModalData = {
  mpa: PostingAccount;
  origMpa: PostingAccount | undefined;
  serverError: Array<String>;
  nameIsValid: boolean | null;
  nameErrorMessage: string;
};
export default defineComponent({
  name: "CreatePostingAccountModal",
  data(): CreatePostingAccountModalData {
    return {
      mpa: {} as PostingAccount,
      origMpa: undefined,
      serverError: {} as Array<String>,
      nameIsValid: null,
      nameErrorMessage: "",
    };
  },
  props: {
    idSuffix: {
      type: String,
      default: "",
    },
  },
  computed: {
    formIsValid(): boolean {
      const isValid = this.nameIsValid;
      if (isValid) {
        return true;
      }
      return false;
    },
    nameErrorData(): ErrorData {
      return generateErrorData(
        this.nameIsValid,
        "Buchungskonto",
        this.nameErrorMessage
      );
    },
  },
  methods: {
    async _show(mpa?: PostingAccount) {
      this.origMpa = mpa ? mpa : undefined;
      this.resetForm();
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    ...mapActions(usePostingAccountStore, ["addPostingAccountToStore"]),
    ...mapActions(usePostingAccountStore, ["updatePostingAccountInStore"]),
    resetForm() {
      if (this.origMpa) {
        this.mpa = { id: this.origMpa.id, name: this.origMpa.name };
      } else {
        this.mpa = {} as PostingAccount;
      }
      this.nameIsValid = null;
      this.nameErrorMessage = "";
      this.serverError = {} as Array<String>;
    },
    validateName() {
      [this.nameIsValid, this.nameErrorMessage] = validateInputField(
        this.mpa.name,
        "Buchungskonto angeben!"
      );
    },
    handleServerError(validationResult: ValidationResult): boolean {
      if (!validationResult.result) {
        this.serverError = new Array<string>();
        for (let resultItem of validationResult.validationResultItems) {
          this.serverError.push(getError(resultItem.error));
        }
      }
      return !validationResult.result;
    },
    async createPostingAccount() {
      this.validateName();
      if (this.formIsValid) {
        if (this.mpa.id > 0) {
          //update
          const validationResult =
            await PostingAccountControllerHandler.updatePostingAccount(
              this.mpa
            );
          if (!this.handleServerError(validationResult)) {
            (this.$refs.modalComponent as typeof ModalVue)._hide();
            this.updatePostingAccountInStore(this.mpa);
            this.$emit("postingAccountUpdated", this.mpa);
          }
        } else {
          //create
          const postingAccountValidation =
            PostingAccountControllerHandler.createPostingAccount(this.mpa);
          const validationResult = await (
            await postingAccountValidation
          ).validationResult;

          if (!this.handleServerError(validationResult)) {
            this.mpa = (await postingAccountValidation).mpa;
            (this.$refs.modalComponent as typeof ModalVue)._hide();
            this.addPostingAccountToStore(this.mpa);
            this.$emit("postingAccountCreated", this.mpa);
          }
        }

        const postingAccountValidation =
          PostingAccountControllerHandler.createPostingAccount(this.mpa);
        const validationResult = await (
          await postingAccountValidation
        ).validationResult;

        if (!validationResult.result) {
          this.serverError = new Array<string>();
          for (let resultItem of validationResult.validationResultItems) {
            this.serverError.push(getError(resultItem.error));
          }
        } else {
          this.mpa = (await postingAccountValidation).mpa;
          (this.$refs.modalComponent as typeof ModalVue)._hide();
          this.addPostingAccountToStore(this.mpa);
          this.$emit("postingAccountCreated", this.mpa);
        }
      }
    },
  },
  expose: ["_show"],
  emits: ["postingAccountCreated", "postingAccountUpdated"],
  components: { ModalVue },
});
</script>
