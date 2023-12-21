export function capitalizeAndFilter(input: string): string {
  // Split the input string into an array of words
  const words = input.split(/\s+/);

  // Capitalize the first letter of each word and filter out empty strings
  const capitalizedWords = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .filter(Boolean);

  // Join the words back together with a single space between each
  const result = capitalizedWords.join(" ");

  return result;
}