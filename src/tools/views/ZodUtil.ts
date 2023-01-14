export function globErr(message: string) {
  return {
    errorMap: () => {
      return { message: message };
    },
  };
}
