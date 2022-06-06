// returns the model name in camelcase
export const modelName = (model: { name: string }): string => {
  const parts = model.name.split("_");
  return parts
    .map((p, i) => {
      if (i === 0) {
        return p[0].toLowerCase() + p.slice(1);
      }
      return p[0].toUpperCase() + p.slice(1);
    })
    .join("");
};
