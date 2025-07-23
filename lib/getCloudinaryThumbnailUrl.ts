export function getCloudinaryThumbnailUrl(url: string) {
  return url.replace("/upload/", "/upload/w_70,h_70,c_fill,f_auto,q_auto:eco/");
}
