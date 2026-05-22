/** @format */

import { buffer, debounceTime, OperatorFunction, Subject, Subscriber } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

/**
 * Operatore RxJS custom che accumula le emissioni della sorgente in un buffer
 * e le emette come array dopo che non arrivano nuovi valori per `maxAwaitTime` ms.
 *
 * Opzionalmente, emette solo se il buffer contiene almeno `minOccurrence` elementi.
 * Utile per ridurre il numero di chiamate HTTP quando arrivano rapidamente più eventi.
 *
 * @param project - Funzione di trasformazione applicata all'array accumulato.
 * @param maxAwaitTime - Tempo di debounce in ms (default: 0).
 * @param minOccurrence - N. minimo di elementi nel buffer per emettere (default: 0 = sempre).
 */
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

/**
 * Operatore RxJS che registra automaticamente la subscription nell'`obs` `Subscriber`
 * del componente, garantendo la corretta cancellazione quando il componente viene
 * distrutto senza richiedere l'uso esplicito di `takeUntil`.
 *
 * @param subscriber - Il `Subscriber` del componente a cui aggiungere la subscription.
 */
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
