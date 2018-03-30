import React, { cloneElement, Children } from 'react';
import { map, switchMap, mapTo, startWith, scan } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import {
  componentFromStream,
  setObservableConfig,
  createEventHandler
} from 'recompose';
import config from 'recompose/rxjsObservableConfig';

setObservableConfig(config);

const Counter = ({ value, onInc, onDec }) => (
  <div>
    <button onClick={onInc}>+</button>
    <h2>{value}</h2>
    <button onClick={onDec}>-</button>
  </div>
);

const CounterStream = componentFromStream(props$ => {
  const { stream: onInc$, handler: onInc } = createEventHandler();
  const { stream: onDec$, handler: onDec } = createEventHandler();

  return props$.pipe(
    switchMap(props =>
      merge(onInc$.pipe(mapTo(1)), onDec$.pipe(mapTo(-1))).pipe(
        startWith(props.value),
        scan((acc, curr) => acc + curr),
        map(value => ({ ...props, value, onInc, onDec })),
        map(props =>
          Children.map(props.children, child => cloneElement(child, props))
        )
      )
    )
  );
});

const ButtonCounter = () => (
  <CounterStream value={3}>
    <Counter />
    <Counter />
    <Counter />
  </CounterStream>
);

export default ButtonCounter;
