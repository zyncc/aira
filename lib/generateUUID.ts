export function UUID() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let uuid = "";
  for (let i = 0; i < 11; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    uuid += characters[randomIndex];
  }
  return uuid;
}
