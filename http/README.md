This folder is for running the API as a standalonen application, without using Cloudflare workers.

## Setup
1. Install [Node.js](https://nodejs.org/en/download/)
2. Run `npm install` from the parent directory to install the base dependencies
3. Run `npm install` from this directory to install the dependencies for the HTTP server

## Enviroment Variables
* `PORT` - The port the server will listen on. Default is `8088`.
* `ENVIRONMENT` - The environment to run in. Either `production` or `dev`. Default is `dev`.
* `CACHE_BASIC_AUTH` - The basic auth string to use for caching. Default is `placeholder`.
* `CLOUDFLARE_TOKEN` - The Cloudflare token to use for accessing the KV store. Default is `placeholder`.
* `SENTRY_DSN` - The Sentry DSN to use for error reporting. Defaults to empty.
* `SENTRY_TRACE_RATE` - The Sentry trace sample rate to use for error reporting. Default is `0`.
* `SENTRY_PROFILE_RATE` - The Sentry profile sample rate to use for error reporting. Default is `0`.
* `SENTRY_ENV` - The Sentry environment to use for error reporting. Default is `unknown`.