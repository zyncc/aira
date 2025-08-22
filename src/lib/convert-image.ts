export function convertImage(imageUrl: string, size: number) {
  return imageUrl.replace(/\.(\w+)$/, `.$1?tr=f-avif,w-${size},q-70`);
}
