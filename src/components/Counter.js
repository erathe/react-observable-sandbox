import React from 'react';
import { map, startWith } from 'rxjs/operators';
import { interval } from 'rxjs/observable/interval';
import { componentFromStream, setObservableConfig } from 'recompose';
import config from 'recompose/rxjsObservableConfig';

setObservableConfig(config);

const Counter = componentFromStream(props$ => {
  return interval(1000).pipe(map(i => <h1>{i + 1}</h1>), startWith(<h1>0</h1>));
});

export default Counter;
