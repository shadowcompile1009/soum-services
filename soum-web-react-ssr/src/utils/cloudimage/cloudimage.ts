import qs from "query-string";

export type GetCloudImageUrlOptions = {
  quality?: number;
  format?: string;
  preset?: string;
};

export const getCloudImageUrl = (
  src: string,
  { quality = 75, format, preset }: GetCloudImageUrlOptions = {}
): string => {
  if (!format && !src.includes(".svg")) {
    format = "webp";
  }

  const isLocalHost = process.env.REACT_APP_URL?.includes("localhost");

  if (src.startsWith("/") && isLocalHost) {
    return src;
  }

  if (src.startsWith("/") && !isLocalHost) {
    src = `https://cltarabyfa.cloudimg.io/${process.env.REACT_APP_URL}${src}`;
  } else {
    src = `https://cltarabyfa.cloudimg.io/${src}`;
  }

  return `${src}?${qs.stringify({
    force_format: format,
    q: quality,
    p: preset,
  })}`;
};
