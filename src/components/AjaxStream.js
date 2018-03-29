import React from 'react';
import { map, switchMap, tap, pluck, startWith } from 'rxjs/operators';
import { ajax } from 'rxjs/observable/dom/ajax';
import { componentFromStream, setObservableConfig } from 'recompose';
import config from 'recompose/rxjsObservableConfig';

setObservableConfig(config);

const REQUEST_PERSON_URL = id => `https://swapi.co/api/people/${id}/`;

const Card = props => (
  <div>
    <h1>{props.name}</h1>
    {props.homeworld || props.name === 'Loading...' ? (
      <h2>{props.homeworld}</h2>
    ) : (
      <h2>Loading planet...</h2>
    )}
  </div>
);

const loadById = id =>
  ajax(REQUEST_PERSON_URL(id)).pipe(
    pluck('response'),
    switchMap(
      response =>
        ajax(response.homeworld).pipe(
          pluck('response'),
          startWith({ name: '' })
        ),
      (person, homeworld) => ({ ...person, homeworld: homeworld.name })
    ),
    startWith({ name: 'Loading...' })
  );

const CardStream = componentFromStream(props$ =>
  props$.pipe(switchMap(props => loadById(props.id)), map(Card))
);

const AjaxStream = () => <CardStream id={1} />;

export default AjaxStream;
