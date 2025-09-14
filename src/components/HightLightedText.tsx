
const HightLightedText = (text: string, search: string) => {
  if (!search) return text;

  const regex = new RegExp(`(${search})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === search.toLowerCase() ? (
      <mark key={index}>{part}</mark>
    ) : (
      part
    )
  );
}

export default HightLightedText
