import type { PostingAccountTransport } from "@/api";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";

export function mapPostingAccountTransportToModel(
  transport: PostingAccountTransport,
): PostingAccount {
  const model = {} as PostingAccount;
  model.id = transport.id;
  model.name = transport.name;
  return model;
}

export function mapPostingAccountToTransport(
  model: PostingAccount,
): PostingAccountTransport {
  const transport = {} as PostingAccountTransport;
  transport.id = model.id;
  transport.name = model.name;
  return transport;
}
