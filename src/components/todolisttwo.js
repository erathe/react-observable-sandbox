import React from 'react';
import {
  map,
  startWith,
  switchMap,
  pluck,
  catchError
} from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { ajax } from 'rxjs/observable/dom/ajax';
import {
  setObservableConfig,
  createEventHandler,
  mapPropsStream,
  withState,
  compose,
  flattenProp
} from 'recompose';
import config from 'recompose/rxjsObservableConfig';

setObservableConfig(config);

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

  const postTodo$ = props$.pipe(
    switchMap(props =>
      onSave$.pipe(
        switchMap(
          _ =>
            ajax(`https://swapi.co/api/people/${props.inputValue}/`).pipe(
              pluck('response'),
              catchError(err => of({ name: 'Not Found' })),
              startWith({loading: true})
            ),
          (props, person) => ({ person, loading: person.loading })
        ),
        startWith({ person: {} })
      )
    )
  );

  return props$.combineLatest(postTodo$, (props, postTodo) => ({
    ...props,
    postTodo,
    onSave
  }));
});

const FormInput = props => {
    console.log(props)
  return (
    <div>
      {props.loading ? <h1>Loading...</h1> : <h1>not Loading</h1>}
      <input type="text" onInput={props.onInput} />
      <button onClick={props.onSave}>Save</button>
      <h2>{props.inputValue}</h2>
      <h2>{props.person.name}</h2>
    </div>
  );
};

const TodoListStream = compose(
  input,
  save,
  flattenProp('postTodo')
)(FormInput);

const todoList = () => <TodoListStream />;

export default todoList;
