export function formatINR(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}
