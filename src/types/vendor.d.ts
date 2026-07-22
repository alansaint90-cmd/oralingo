declare module "bcryptjs" {
  export function hash(data: string, saltOrRounds: string | number): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
}

declare module "pg" {
  export class Pool {
    constructor(config?: Record<string, unknown>);
  }
}
