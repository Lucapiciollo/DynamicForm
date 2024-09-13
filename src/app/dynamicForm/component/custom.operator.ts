import { filter, pairwise, tap } from "rxjs";
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


export const debug = (tag: string,name?:string) => {
  return <T>(source: Observable<T>): Observable<T> => {
    return new Observable(subscriber => {
      const subscription = source.pipe(filter(f=>f!=null),tap({
        next(value) {
           console.log(`%c[Class: ${name} - ${tag}: Next]`, "background: green; color: #fff; padding: 3px; font-size: 0.7rem;" ,value )
        },
        error(error) {
          console.log(`%c[Class: ${name} - ${tag}: Error]`, "background: red; color: #fff; padding: 3px; font-size: 0.7rem;", error)
        },
        complete() {
           console.log(`%c[Class: ${name} - ${tag}]: Complete`, "background: #00BCD4; color: #fff; padding: 3px; font-size: 0.7remx;")
        }
      })).pipe().subscribe({
        next(value) {
          subscriber.next(value);
        },
        error(error) {
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        }
      });

      return () => subscription.unsubscribe();
    });
  }
}
