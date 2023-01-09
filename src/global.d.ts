declare module "*.dict.yaml" {
  const content: string;
  export default content;
}

declare module "opencc-js/core" {
  export function ConverterFactory(
    ...dictGroups: (readonly (string | readonly (readonly [string, string])[])[])[]
  ): (s: string) => string;
}

declare module "opencc-js/preset" {
  export const from: {
    cn: readonly [string, string];
    hk: readonly [string, string];
    tw: readonly [string, string];
    twp: readonly [string, string];
    jp: readonly [string, string];
  };
  export const to: {
    cn: readonly [string, string];
    hk: readonly [string, string];
    tw: readonly [string, string];
    twp: readonly [string, string];
    jp: readonly [string, string];
  };
}
