export function convertImage(imageUrl: string) {
  return imageUrl.replace(/\.(\w+)$/, ".$1?tr=f-avif,w-3000,q-70");
}

export function convertImageToThumbnail(imageUrl: string) {
  return imageUrl.replace(/\.(\w+)$/, ".$1?tr=f-avif,w-200");
}
