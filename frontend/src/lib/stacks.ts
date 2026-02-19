// Keep in sync with backend (prompts/types.py)
// Order here determines order in dropdown
export enum Stack {
  ASTRO_BLOG = "astro_blog",
}

export const STACK_DESCRIPTIONS: {
  [key in Stack]: { components: string[]; inBeta: boolean };
} = {
  astro_blog: { components: ["Astro", "Blog"], inBeta: true },
};
