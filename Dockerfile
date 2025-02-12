FROM node:20-slim

# Copy the files from the host to the container
COPY . /app

# Setup base package
WORKDIR /app
RUN npm ci

# Setup HTTP package
WORKDIR /app/http
RUN npm ci

ENV CLOUDFLARE_TOKEN=placeholder
ENV CACHE_BASIC_AUTH=placeholder
ENV PORT=8788
ENV ENVIRONMENT=dev
ENV SENTRY_DSN=
ENV SENTRY_TRACE_RATE=0
ENV SENTRY_PROFILE_RATE=0

EXPOSE $PORT

# Run the application
ENTRYPOINT ["npm", "run", "start"]