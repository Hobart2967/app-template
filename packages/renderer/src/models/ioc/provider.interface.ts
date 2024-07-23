import { interfaces } from 'inversify';

export type ServiceProvider<T = any> = interfaces.ServiceIdentifier<T>
export type ConstantValueProvider<T = any> = { use: interfaces.ServiceIdentifier<T>, withValue: T };
export type AliasedProvider<T = any> = { use: interfaces.Newable<T>, withAlias: interfaces.ServiceIdentifier<T> };
export type Provider<T = any> =
  ServiceProvider<T>
  | ConstantValueProvider<T>
  | AliasedProvider<T>;