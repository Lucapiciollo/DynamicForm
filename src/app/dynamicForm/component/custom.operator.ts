import { filter, pairwise } from "rxjs";
import { Observable } from "rxjs/internal/Observable";



export const minChars = (length: number) => {
  return <T>(source: Observable<T>): Observable<T> => {
    return new Observable(subscriber => {
      const subscription = source.pipe(pairwise(), filter(([prevValue, next]: [any, any]) => next?.length > length || prevValue?.length>=next?.length)).subscribe({
        async next(value) {
          subscriber.next(value[1]);
        },
        error(error) {
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        }
      });
      return () => { subscription.unsubscribe() };
    });
  }
}
