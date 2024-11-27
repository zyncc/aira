export default function formatCurrency(price: number) {
  const formatted = new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "INR",
  }).format(price);

  return formatted;
}
