<template>
  <div
    data-testid="posting-account-mobile-accordion"
    class="md:hidden w-full max-w-md mx-auto px-2 mb-6 space-y-3"
  >
    <div
      v-if="postingAccounts.length === 0"
      data-testid="posting-account-empty-mobile"
      class="w-full text-center text-muted-foreground mt-4"
    >
      {{ $t("General.noEntries") }}
    </div>
    <Accordion v-else type="multiple" class="space-y-2">
      <AccordionItem
        v-for="mpa in postingAccounts"
        :key="mpa.id"
        :value="`item-${mpa.id}`"
        :data-testid="`posting-account-mobile-row-${mpa.id}`"
        class="border rounded-lg bg-background shadow-sm px-3 py-2"
      >
        <AccordionTrigger class="hover:no-underline w-full min-w-0">
          <div
            :data-testid="`posting-account-mobile-trigger-${mpa.id}`"
            class="grid grid-cols-[1fr_auto] items-center w-full gap-2"
          >
            <div class="flex flex-col items-start text-left overflow-hidden">
              <span class="font-bold text-sm truncate w-full">{{
                mpa.name
              }}</span>
            </div>
            <div class="flex items-center gap-1 pr-2">
              <Button
                variant="ghost"
                size="icon"
                :data-testid="`posting-account-mobile-edit-${mpa.id}`"
                @click.stop="editPostingAccount(mpa)"
              >
                <Pencil class="icon-small" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                :data-testid="`posting-account-mobile-delete-${mpa.id}`"
                @click.stop="deletePostingAccount(mpa)"
              >
                <Trash2 class="icon-small" />
              </Button>
            </div>
          </div>
        </AccordionTrigger>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<script lang="ts" setup>
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { Pencil, Trash2 } from "lucide-vue-next";
import type { PropType } from "vue";

defineProps({
  postingAccounts: {
    type: Array as PropType<PostingAccount[]>,
    required: true,
  },
});

const emit = defineEmits(["deletePostingAccount", "editPostingAccount"]);

const deletePostingAccount = (mpa: PostingAccount) => {
  emit("deletePostingAccount", mpa);
};

const editPostingAccount = (mpa: PostingAccount) => {
  emit("editPostingAccount", mpa);
};
</script>
