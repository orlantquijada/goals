export function groupBy<T, K extends PropertyKey>(
  items: T[],
  keyFn: (item: T, index: number) => K
): Record<K, T[]> {
  const groups = {} as Record<K, T[]>;

  for (const [index, item] of items.entries()) {
    const key = keyFn(item, index);

    if (groups[key]) {
      groups[key].push(item);
    } else {
      groups[key] = [item];
    }
  }

  return groups;
}

// yyyy-MM-dd
export type DateID = string;

export function toDateID(date: Date): DateID {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

export function fromDateID(dateId: string) {
  const [year, month, day] = dateId.split('-').map(Number);
  return new Date(year, month - 1, day);
}
