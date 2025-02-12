// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  release: `tarkov-api@${process.env.DEPLOY_REF || 'local'}`,
  environment: process.env.SENTRY_ENV || 'unknown',
  dsn: process.env.SENTRY_DSN || '',
  integrations: [
    nodeProfilingIntegration(),
    Sentry.requestDataIntegration({
      include: {
        ip: true
      }
    }),
    Sentry.graphqlIntegration({
      ignoreResolveSpans: true
    })
  ],
  // Performance Monitoring
  tracesSampleRate: process.env.SENTRY_TRACE_RATE || 0,

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: process.env.SENTRY_PROFILE_RATE || 0,
});