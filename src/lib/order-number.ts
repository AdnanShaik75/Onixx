let counter = 0;
let lastDate = "";

export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");

  if (datePart !== lastDate) {
    lastDate = datePart;
    counter = 0;
  }

  counter++;
  const seq = String(counter).padStart(6, "0");
  return `ONX-${datePart}-${seq}`;
}
