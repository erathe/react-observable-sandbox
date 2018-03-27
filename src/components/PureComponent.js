import React from 'react';
import { map, startWith, scan, switchMap } from 'rxjs/operators';
import { interval } from 'rxjs/observable/interval';
import { from } from 'rxjs/observable/from';
import { zip } from 'rxjs/observable/zip';
import { componentFromStream, setObservableConfig } from 'recompose';
import config from 'recompose/rxjsObservableConfig';

setObservableConfig(config);

const RenderHelper = props => (
  <div>
    <h1>{props.message}</h1>
  </div>
);

const createTypewriter = message =>
  zip(from(message), interval(100), letter => letter).pipe(
    scan((acc, curr) => acc + curr)
  );

const StreamingMessage = componentFromStream(props$ =>
  props$.pipe(
    switchMap(props => createTypewriter(props.message)),
    map(message => ({message})),
    map(RenderHelper)
  )
);

const Message = () => <StreamingMessage message={'This typewriter effect is insane yo'} />;

export default Message;
