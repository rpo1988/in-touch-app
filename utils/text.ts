export const transform = (
  text: string,
  output: "uppercase" | "titlecase" | "capitalize" | "lowercase"
) => {
  if (!text) return text;

  return output === "uppercase"
    ? text.toUpperCase()
    : output === "lowercase"
    ? text.toLowerCase()
    : output === "capitalize"
    ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    : text
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};
