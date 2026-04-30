export function validateStock(items: any[], stock: any[]) {
  const problems: string[] = [];

  items.forEach((item) => {
    const stockItem = stock.find(
      (s) => s.productId === item.id && s.size === item.size
    );

    if (!stockItem || stockItem.stock < item.quantity) {
      problems.push(
        `${item.name} Größe ${item.size}: nur ${stockItem?.stock || 0} verfügbar`
      );
    }
  });

  return {
    valid: problems.length === 0,
    problems,
  };
}
