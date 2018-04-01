import React from 'react';
import {
  map,
  startWith,
  switchMap,
  pluck,
  catchError,
  withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ajax } from 'rxjs/observable/dom/ajax';
import {
  setObservableConfig,
  createEventHandler,
  mapPropsStream,
  compose,
  flattenProp
} from 'recompose';
import config from 'recompose/rxjsObservableConfig';

setObservableConfig(config);
const REQUEST_PERSON_URL = id => `https://swapi.co/api/people/${id}/`;

const input = mapPropsStream(props$ => {
  const { stream: onInput$, handler: onInput } = createEventHandler();
  return props$.pipe(
    switchMap(
      props => onInput$.pipe(map(e => e.target.value), startWith('')),
      (props, inputValue) => ({ ...props, inputValue, onInput })
    )
  );
});

const save = mapPropsStream(props$ => {
  const { stream: onSave$, handler: onSave } = createEventHandler();

  const getPerson$ = id =>
    ajax(REQUEST_PERSON_URL(id)).pipe(
      pluck('response'),
      catchError(err => of({ name: 'Not Found' })),
      startWith({ loading: true })
    );

  const save$ = onSave$.pipe(
    withLatestFrom(props$),
    switchMap(
      ([_, props]) => getPerson$(props.inputValue),
      (props, person) => ({
        person,
        loading: person.loading
      })
    ),
    startWith({ person: {} })
  );

  return props$.combineLatest(save$, (props, postTodo) => ({
    ...props,
    postTodo,
    onSave
  }));
});

const FormInput = props => {
  return (
    <div>
      {props.loading ? <h1>Loading...</h1> : <h1>not Loading</h1>}
      <input type="text" onInput={props.onInput} />
      <button onClick={props.onSave}>Save</button>
      <h2>{props.inputValue}</h2>
      <h2>{props.person.name}</h2>
      <h3>{props.testProps}</h3>
    </div>
  );
};

const TodoListStream = compose(input, save, flattenProp('postTodo'))(FormInput);

const todoList = () => <TodoListStream testProps={'coming through?'}/>;

export default todoList;
