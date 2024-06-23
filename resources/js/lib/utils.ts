import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateAvatarFromUsername(username: string) {
  return  "https://avatar.iran.liara.run/username?username="+username;
}
