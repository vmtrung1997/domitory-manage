export const verifyNumberString = (string) => {
  if(typeof string === "undefined")
    return false;
  const ortherChar = string.replace(/[0-9]/gi, '');
  console.log('==string', ortherChar, typeof string)
  return !!ortherChar;  // true: invalid
};