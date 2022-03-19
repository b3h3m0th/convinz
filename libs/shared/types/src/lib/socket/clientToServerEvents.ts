export interface ClientToServerEvents {
  join: (code: string) => void;
  create: (code: string) => void;
}
