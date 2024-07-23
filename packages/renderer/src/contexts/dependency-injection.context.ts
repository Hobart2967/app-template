import { Container } from 'inversify';
import { createContext, useContext } from 'solid-js';

export const DependencyInjectionContext = createContext<Container|null>(null);

export function useDependency<T>(token: any): T {
  const container = useContext(DependencyInjectionContext) as Container;
  return container.get(token);
}