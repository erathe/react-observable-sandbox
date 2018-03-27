import React from 'react';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { mapPropsStream, compose } from 'recompose';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { merge } from 'rxjs/observable/merge';

const mouseDown$ = fromEvent(document, 'mousedown');
const mouseUp$ = fromEvent(document, 'mouseup');
const move$ = fromEvent(document, 'mousemove');

const movement$ = mouseDown$.pipe(
  switchMap(down => move$.pipe(takeUntil(mouseUp$))),
  startWith({ clientX: 0, clientY: 0 })
);

const position$ = merge(mouseDown$, movement$);

const Mousetrack = ({position}) => {
  return (
    <div>
      <h1>Hold down the mouse to know where it is at</h1>
      <h2>{`The mouse is at ${position.clientX}, ${position.clientY}`}</h2>
    </div>
  );
};

const EnhancedMousetrack = compose(
  mapPropsStream(props$ => {
    return combineLatest(props$, position$, (props, position) => {
      return {
        ...props,
        position
      };
    });
  })
)(Mousetrack);

export default EnhancedMousetrack;
