export interface ClientToServerEvents {
  join: (code: string) => void;
  create: () => void;
}
