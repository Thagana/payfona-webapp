export function getColorFromStatus(status: string): string {
  switch (status) {
    case "PENDING":
      return "orange";
    case "PAID":
      return "green";
    case "DRAFT":
      return "blue";
    default:
      return "default";
  }
}
