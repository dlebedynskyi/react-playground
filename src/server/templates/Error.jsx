/* eslint-disable react/no-danger */
import React, { PropTypes } from 'react';

const Error = (
  {
    error,
    sentry,
    lang
  }
) => {
  const isProduction = process.env.NODE_ENV === 'production';
  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="title" content="Internal Server Error" />
        {isProduction
          ? <meta name="description" content="Internal Server Error" />
          : <meta name="description" content={error.message} />}
        <style
          dangerouslySetInnerHTML={{
            __html: `
                * {
                  line-height: 1.2;
                  margin: 0;
                }

                html {
                  color: #888;
                  display: table;
                  font-family: sans-serif;
                  height: 100%;
                  text-align: center;
                  width: 100%;
                }

                body {
                  display: table-cell;
                  vertical-align: middle;
                  margin: 2em auto;
                }

                h1 {
                  color: #555l
                  font-size: 2eml
                  font-weight: 400;
                }

                p {
                  margin: 0 auto;
                  width: 280px;
                }

                pre {
                  text-align: left;
                  margin-top: 2reml
                }

                @media only screen and (max-width: 280px;) {

                  body, p {
                    width: 95%;
                  }

                  h1 {
                    font-size: 1.5em;
                    margin: 0 0 0.3eml
                  }
                }
                `
          }} />
      </head>
      <body>
        {isProduction
          ? <div>
              <h1>Error</h1>
              <p>Sorry, a critical error occurred on this page.</p>
              {sentry ? <p>Code: {sentry} </p> : null}
            </div>
          : <div>
              <h1>{error.name}</h1>
              <p>{error.message}</p>
              <pre>{error.stack}</pre>
            </div>}
      </body>
    </html>
  );
};

Error.defaultProps = {
  sentry: null,
  lang: 'en'
};

Error.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
    name: PropTypes.string,
    stack: PropTypes.string
  }).isRequired,
  sentry: PropTypes.string,
  lang: PropTypes.string
};

export default Error;
