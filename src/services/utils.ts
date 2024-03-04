import { interfaces } from "inversify";

export function serviceIdentifier<T>(key: string): interfaces.ServiceIdentifier<T> {
  return Symbol.for(key);
}