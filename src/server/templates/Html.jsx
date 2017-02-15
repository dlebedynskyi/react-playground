/* eslint-disable react/no-danger */
/* eslint-disable react/no-unused-prop-types */
/* test */
import React, {PropTypes} from 'react';
import serialize from 'serialize-javascript';

const Html = ({
  head,
  style,
  assets,
  body,
  config,
  initialState,
  asyncComponents
  }) => {
  const attrs = head.htmlAttributes.toComponent();
  const {lang, ...rest} = attrs || {};
  const trackingId = config
    && config.analytics
    && config.analytics.google
    && config.analytics.google.trackingId;
  return (
    <html {...rest} lang={lang || 'en'}>
      <head>
        {head.title.toComponent()}
        <meta charSet="utf-8" />
        <meta name="identity-build-tag" content={config.tag} />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {head.meta.toComponent()}
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        {assets && assets.vendor && assets.vendor.css ?
            <link rel="stylesheet" type="text/css" href={assets.vendor.css} /> :
            null}
        {assets && assets.app && assets.app.css ?
            <link rel="stylesheet" type="text/css" href={assets.app.css} /> :
            null}
        {head.link.toComponent()}
        {style ?
          <style
            id="css"
            dangerouslySetInnerHTML={{ __html: style }} /> :
          null}
      </head>
      <body>
        <div
          id="app"
          className="ml-layout-app"
          dangerouslySetInnerHTML={{ __html: body }} />
        <script
          dangerouslySetInnerHTML={{ __html: `
            window.__CONFIG__ = ${serialize(config, {isJSON: true})};
            window.__INITIAL_STATE__ = ${serialize(initialState || {}, {isJSON: true})};
            `}} />
        {asyncComponents && asyncComponents.state ?
          <script
            dangerouslySetInnerHTML={{ __html: `
              window.${asyncComponents.STATE_IDENTIFIER} = ${serialize(asyncComponents.state, {isJSON: true})};
              `}} /> :
            null}
        {assets && assets.vendor && assets.vendor.js ?
          <script src={assets.vendor.js} /> :
          null}
        {assets && assets.app && assets.app.js ?
          <script src={assets.app.js} /> :
          null}
        {trackingId ?
          <script
            dangerouslySetInnerHTML={{ __html:
             'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
             `ga('create','${trackingId}','auto');ga('send','pageview')` }} /> :
          null}
        {trackingId ?
          <script src="https://www.google-analytics.com/analytics.js" async defer /> :
          null}
      </body>
    </html>
  );
};

Html.defaultProps = {
  stylesheet: [],
  initialState: null,
  codeSplitState: null,
  style: null,
  asyncComponents: null
};

Html.propTypes = {
  head: PropTypes.shape({
    title: PropTypes.object,
    meta: PropTypes.object,
    link: PropTypes.object
  }).isRequired,
  stylesheet: React.PropTypes.arrayOf(React.PropTypes.string),
  config: PropTypes.shape({
    analytics: PropTypes.shape({
      google: PropTypes.shape({
        trackingId: PropTypes.string
      })
    })
  }).isRequired,
  initialState: PropTypes.object,
  asyncComponents: PropTypes.object,
  style: PropTypes.string,
  body: PropTypes.node.isRequired,
  script: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
};

export default Html;
