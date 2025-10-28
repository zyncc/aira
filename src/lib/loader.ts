export default function imageKitLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const params = [`w-${width}`, `q-${quality || 80}`];
  return `${src}?tr=${params.join(",")}`;
}
