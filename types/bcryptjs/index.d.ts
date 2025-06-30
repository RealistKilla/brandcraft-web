declare module "bcryptjs" {
  export function hash(...args): Promise<string>;
  export function compare(...args): Promise<boolean>;
  export function genSalt(rounds: number): Promise<string>;
  // add anything else you need
}
