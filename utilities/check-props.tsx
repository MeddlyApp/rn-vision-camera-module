export const checkIfPropsAreEqual = (prevProps: any, nextProps: any) => {
  Object.entries(nextProps).forEach(([key, val]) => {
    if (prevProps[key] !== val) return false;
  });
  return true;
};
