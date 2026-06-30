import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** shadcn/ui className helper. Run `pnpm dlx shadcn@latest add <component>`. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
