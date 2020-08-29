export const mod = (n: number, m: number): number => ((n % m) + m) % m

export const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min