export const getMethods = (object: any) => {
  const prototype = Reflect.getPrototypeOf(object);

  if (prototype) {
    return Object.values(prototype);
  }

  return [];
};
