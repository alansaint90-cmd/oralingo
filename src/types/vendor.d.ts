declare module "bcryptjs" {
  export function hash(data: string, saltOrRounds: string | number): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
}

declare module "pg" {
  export type QueryResult<T = Record<string, unknown>> = {
    rowCount: number | null;
    rows: T[];
  };

  export type PoolClient = {
    query<T = Record<string, unknown>>(text: string, values?: unknown[]): Promise<QueryResult<T>>;
    release(): void;
  };

  export class Pool {
    constructor(config?: Record<string, unknown>);
    query<T = Record<string, unknown>>(text: string, values?: unknown[]): Promise<QueryResult<T>>;
    connect(): Promise<PoolClient>;
    end(): Promise<void>;
  }
}
