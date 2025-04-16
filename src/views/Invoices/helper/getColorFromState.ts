export function getColorFromStatus(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'yellow';
      case 'PAID':
        return 'green';
      case 'DRAFT':
        return 'default';
      default:
        return 'default';
    }
  }
  