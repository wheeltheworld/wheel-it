export const setQueryParam = (param: string, value: string) => {
  const url = new URLSearchParams(window.location.search);
  url.set(param, value);
  window.location.search = url.toString();
};
