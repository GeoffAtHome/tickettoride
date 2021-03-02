export function getItem(path: string) {
  const item = localStorage.getItem(path);
  if (item === null) return '';
  return item;
}
