export function getCloudinaryThumbnailUrl(url: string) {
  return url.replace("/upload/", "/upload/w_70,h_70,c_fill,f_webp,q_auto:eco/");
}

export function getCloudinaryImageUrl(url: string) {
  return url.replace("/upload/", "upload/w_1000/q_auto:best/f_webp/");
}
