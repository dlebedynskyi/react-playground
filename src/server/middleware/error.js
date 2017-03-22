/* eslint-disable  import/prefer-default-export, react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom/server';
import Error from '../templates/Error';

/**
 * If this code path is reached, one of two things occurred:
 * 1.) An error route was not suppied in the defined routes
 *    so a not found was piped to this middleware
 * 2.) a non get request was made and was unsuccessfully routed
 *     falling into this 500 code block
 */
export const onError = (err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (process.env.NODE_ENV === 'development') {
    console.error(err); // eslint-disable-line no-console
    renderError(res, err);
  } else {
    renderError(res, null, res.sentry);
  }
};

function renderError(res, err, sentryError) {
  const html = ReactDOM.renderToStaticMarkup(<Error error={err} sentry={sentryError} />);
  res.status((err && err.status) || 500);
  res.send(`<!doctype html>${html}`);
}
