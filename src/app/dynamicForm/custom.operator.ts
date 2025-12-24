/** @format */

import {buffer, debounceTime, OperatorFunction, Subject, Subscriber} from 'rxjs';
import {Observable} from 'rxjs/internal/Observable';

export function bufferWithMaxAwaitTime<T, R>(project: (value: Array<T>, length: number) => R, maxAwaitTime: number = 0, minOccurrence: number | null = 0): OperatorFunction<T, R> {
   return source =>
      new Observable(destination => {
         const ListenerSubject = new Subject<T>();
         const debounceListener$ = ListenerSubject.pipe(debounceTime(maxAwaitTime));
         const Listener$ = ListenerSubject.pipe(buffer(debounceListener$));
         Listener$.subscribe((results: Array<T>) => {
            if (minOccurrence && minOccurrence > 0) {
               if (results.length - 1 >= minOccurrence) destination.next(project(results, results.length));
            } else destination.next(project(results, results.length));
         });
         source.subscribe({
            next: value => {
               ListenerSubject.next(value);
            },
            error: err => {
               ListenerSubject.complete();
               destination.complete();
               destination.error(err);
            },
            complete() {
               ListenerSubject.complete();
               destination.complete();
            },
         });
         return () => destination.unsubscribe();
      });
}

export function autoUnsubscribe<T>(subscriber: Subscriber<any>) {
   return (source: Observable<T>) =>
      new Observable<T>(observer => {
         const subscription = source.subscribe(observer);
         subscriber.add(subscription);
         return () => {
            subscription.unsubscribe();
            subscriber.remove(subscription);
         };
      });
}
