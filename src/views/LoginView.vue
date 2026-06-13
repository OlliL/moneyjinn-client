<template>
  <form @submit.prevent="handleLogin">
    <div class="flex min-h-screen items-center justify-center px-4">
      <div
        class="w-full max-w-md rounded-sm border bg-card text-card-foreground"
      >
        <div class="border-b p-4 text-center">
          <h4 class="text-2xl font-bold">{{ $t("LoginView.welcome") }}</h4>
        </div>
        <div class="p-4">
          <div class="text-center pb-3">
            <h5 class="text-xl font-medium">
              {{ $t("LoginView.enterYourData") }}
            </h5>
          </div>
          <div class="mb-2">
            <InputStandard
              v-model="username"
              :validation-schema="schema.username"
              id="username"
              :field-label="$t('General.username')"
              :focus="true"
            >
              <template #icon>
                <User />
              </template>
            </InputStandard>
          </div>
          <div class="mb-2">
            <InputStandard
              v-model="password"
              :validation-schema="schema.password"
              field-type="password"
              id="password"
              :field-label="$t('General.password')"
            >
              <template #icon>
                <Lock />
              </template>
            </InputStandard>
          </div>
          <div class="mb-2 mt-6 flex flex-col items-center">
            <ButtonSubmit
              :button-label="$t('LoginView.login')"
              test-id="login-submit"
            >
              <template #icon><LogIn /> </template>
            </ButtonSubmit>
          </div>
        </div>
        <div class="border-t p-3 text-center text-sm text-muted-foreground">
          <small
            >moneyjin {{ version }} - &copy; {{ $t("LoginView.by") }} Oliver
            Lehmann</small
          >
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import InputStandard from "@/components/common/InputStandard.vue";
import router, { Routes } from "@/router";
import UserService from "@/service/UserService";
import {
  handleBackendError,
  showServerError,
} from "@/tools/views/HandleBackendError";
import { Lock, LogIn, User } from "@lucide/vue";
import { useForm } from "vee-validate";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { string } from "zod";
import { version } from "../../package.json";

const { t } = useI18n();

const schema = {
  username: string().min(1, t("LoginView.validation.username")),
  password: string().min(1, t("LoginView.validation.password")),
};

const props = defineProps<{
  error?: string;
}>();

onMounted(() => {
  if (props.error) {
    showServerError(props.error);
  }
});

const username = ref("");
const password = ref("");

const { handleSubmit } = useForm();

const handleLogin = handleSubmit((values) => {
  UserService.login(values.username, values.password)
    .then(() => {
      router.push({ name: Routes.Home });
    })
    .catch((backendError) => {
      handleBackendError(backendError);
      password.value = "";
    });
});
</script>
