import React from 'react';
import { map, startWith, switchMap } from 'rxjs/operators';
import {
  setObservableConfig,
  createEventHandler,
  mapPropsStream,
  withState,
  compose,
  withHandlers
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

const FormInput = props => {
  return (
    <div>
      <input type="text" onInput={props.onInput} />
      <button onClick={props.addTodo}>Save</button>
      <h2>{props.inputValue}</h2>
      {props.todoItemsState.map(({inputValue, id}) => {
        return <h2 key={id}>{inputValue}</h2>;
      })}
    </div>
  );
};

const TodoListStream = compose(
  input,
  withState('todoItemsState', 'setItem', []),
  withHandlers({
    addTodo: ({ setItem, inputValue }) => () =>
      setItem(items => [{ inputValue, id: Date.now() }, ...items])
  })
)(FormInput);

const todoList = () => <TodoListStream />;

export default todoList;
