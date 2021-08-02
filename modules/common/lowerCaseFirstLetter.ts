export function lowerCaseFirstLetter(string: string): string {
  return string.charAt(0).toLocaleLowerCase() + string.slice(1);
}
