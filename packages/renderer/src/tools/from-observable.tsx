import { Observable, Subject, takeUntil } from 'rxjs';
import { createSignal, onCleanup } from 'solid-js';

/** Converting an observable to a signal */
export function createFromObservable<T>(
  input: Observable<T>,
  defaultValue?: T,
  cleanup$ = onCleanup$(),
) {
  const [value, setValue] = createSignal(defaultValue as T);

  input.pipe(takeUntil(cleanup$)).subscribe(setValue);

  return [value, setValue] as const;
}

/** Returns an observable that emits once when a component is cleaned up */
export function onCleanup$() {
  const obs = new Subject<void>();

  onCleanup(() => {
    obs.next();
    obs.complete();
  });

  return obs.asObservable();
}