export const dateToString = (prop) => {
  const date = new Date(prop);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
};
