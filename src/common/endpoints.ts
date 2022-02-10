export const calcGetDocumentEndpoint = (id: string): string => {
  const url = new URL(`/docs/${id}`, import.meta.env.VITE_HTTP_ENDPOINT);
  return url.toString();
};

export const calcEditDocumentEndpoint = (id: string): string => {
  const url = new URL(`/docs/${id}/edit`, import.meta.env.VITE_WS_ENDPOINT);
  return url.toString();
};
