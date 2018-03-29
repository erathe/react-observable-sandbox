import React from 'react';
import { map, startWith, delay } from 'rxjs/operators';
import { interval } from 'rxjs/observable/interval';
import {
  componentFromStream,
  setObservableConfig,
  createEventHandler
} from 'recompose';
import config from 'recompose/rxjsObservableConfig';

setObservableConfig(config);

const FormInput = ({ text, onInput }) => (
  <div>
    <input type="text" onInput={onInput} />
    <h2>{text}</h2>
  </div>
);

const SimpleFormStream = componentFromStream(props$ => {
  const { stream: onInput$, handler: onInput } = createEventHandler();

  const text$ = onInput$.pipe(
    map(e => e.target.value),
    delay(300),
    startWith('')
  );

  return text$.pipe(map(text => ({ text, onInput }))).pipe(map(FormInput));
});

const SimpleForm = () => <SimpleFormStream />;

export default SimpleForm;
