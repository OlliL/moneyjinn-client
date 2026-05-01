import { mapPostingAccountTransportToModel } from "@/service/mapper/PostingAccountTransportMapper";
import PostingAccountService from "@/service/PostingAccountService";
import { WebSocketSingleton } from "@/config/WebSocketSingleton";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import type { PostingAccountChangedEventTransport } from "@/model/wsevent/PostingAccountChangedEventTransport";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const usePostingAccountStore = defineStore("postingAccount", () => {
  const postingAccount = ref([] as Array<PostingAccount>);

  const getPostingAccount = computed((): Array<PostingAccount> => {
    return postingAccount.value;
  });

  const getAsSelectBoxValues = computed((): Array<SelectBoxValue> => {
    return postingAccount.value.map((mpa) => {
      return { id: mpa.id, value: mpa.name } as SelectBoxValue;
    });
  });

  function initPostingAccountStore() {
    return PostingAccountService.fetchAllPostingAccount().then(
      (postingAccountArray) => {
        postingAccount.value = postingAccountArray;
      },
    );
  }

  function subscribeToWebsocket() {
    WebSocketSingleton.getInstance().subscribe(
      "/topic/postingAccountChanged",
      subscribeCallback,
    );
  }

  function subscribeCallback(body: string) {
    if (body) {
      const event: PostingAccountChangedEventTransport = JSON.parse(body);
      const mpa = mapPostingAccountTransportToModel(
        event.postingAccountTransport,
      );

      switch (event.eventType) {
        case "CREATE": {
          // idempotency
          const pos = postingAccount.value.findIndex(
            (entry) => entry.id === mpa.id,
          );
          if (pos === undefined) {
            postingAccount.value.push(mpa);
          } else {
            postingAccount.value.splice(pos, 1, mpa);
          }
          break;
        }
        case "UPDATE": {
          const pos = postingAccount.value.findIndex(
            (entry) => entry.id === mpa.id,
          );
          if (pos !== undefined) postingAccount.value.splice(pos, 1, mpa);
          break;
        }
        case "DELETE": {
          postingAccount.value = postingAccount.value.filter(
            (originalMpa) => mpa.id !== originalMpa.id,
          );
          break;
        }
      }

      postingAccount.value.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  async function searchPostingAccounts(
    comment: string,
  ): Promise<Array<PostingAccount>> {
    const mpa = postingAccount.value;

    if (comment === "") {
      return mpa;
    }

    const commentUpper = comment.toUpperCase();
    return mpa.filter((entry) =>
      entry.name.toUpperCase().includes(commentUpper),
    );
  }

  return {
    postingAccount,
    getPostingAccount,
    getAsSelectBoxValues,
    initPostingAccountStore,
    subscribeToWebsocket,
    subscribeCallback,
    searchPostingAccounts,
  };
});
