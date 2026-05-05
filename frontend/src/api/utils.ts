export const generateApiPath = (
  path: string,
  params: Record<string, string>,
): string =>
  Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, value),
    path,
  );
