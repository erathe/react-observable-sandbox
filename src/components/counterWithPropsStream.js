import React from 'react';
import {
  map,
  startWith,
  switchMap,
  mapTo,
  catchError,
  scan,
  pluck
} from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { of } from 'rxjs/observable/of';
import {
  mapPropsStream,
  setObservableConfig,
  createEventHandler,
  compose
} from 'recompose';
import config from 'recompose/rxjsObservableConfig';
import { ajax } from 'rxjs/observable/dom/ajax';

setObservableConfig(config);

const count = mapPropsStream(props$ => {
  const { stream: onInc$, handler: onInc } = createEventHandler();
  const { stream: onDec$, handler: onDec } = createEventHandler();

  return props$.switchMap(
    props =>
      merge(onInc$.pipe(mapTo(1)), onDec$.pipe(mapTo(-1))).pipe(
        startWith(0),
        scan((acc, curr) => acc + curr)
      ),
    (props, count) => ({ ...props, count, onInc, onDec })
  );
});

const load = mapPropsStream(props$ => {
  return props$.switchMap(
    props =>
      ajax(`https://swapi.co/api/people/${props.count}/`).pipe(
        pluck('response'),
        startWith({ name: 'Loading...' }),
        catchError(err => of({ name: 'Not Found' }))
      ),
    (props, person) => ({ ...props, person })
  );
});

const Counter = props => (
  <div>
    <button onClick={props.onInc}>+</button>
    <button onClick={props.onDec}>-</button>
    <h3>{props.count}</h3>
    <h1>{props.person.name}</h1>
  </div>
);

const CounterWithInterval = compose(count, load)(Counter);

const CounterWithPropsStream = () => (
  <div>
    <CounterWithInterval />
  </div>
);

export default CounterWithPropsStream;
