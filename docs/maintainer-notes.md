# Maintainer Notes

This is a living document for the maintainers of this repository.

## Deployment Process

This is a simple run down of how review / deploy a pull request.

1. A pull request is opened
2. We review the code
3. We comment `.deploy to development` and ensure the creator of the pull request is happy with the changes
4. We comment `.deploy` to deploy to production. We "let it bake" and ensure everything is working as expected for a few minutes to a few days depending on the complexity of the changes.
5. We approve the pull request and merge it into `main`

> It should be noted that the approval step can come before the deployment steps if that suits the situation better.

## Required Secrets

To deploy the API, you will need the following secrets. To deploy via GitHub Actions, you will need to add these secrets to the `secrets` and `production` environments in the repository settings.

* `CLOUDFLARE_TOKEN` - The Cloudflare API token used for accessing the KV store until such a time as we have an independent database for the new express hosted API.
* `CACHE_BASIC_AUTH` - The basic auth string to use with the cache server.
* `SSH_HOST` - The host (ip or DNS record) of the server to deploy the Docker container.
* `SSH_USER` - The user to use when connecting to the deployment server.
* `SSH_PRIVATE_KEY` - The private key to use when connecting to the deployment server.

## CI Failures

A known issue (I am not sure of the cause) for CI failures is when dependabot opens a pull request. For some very strange reason, the necessary secrets are not injected into the Actions workflow when the pull request comes from dependabot. This causes the wrangler environment in CI to fail because it lacks the proper credentials to authenticate with Cloudflare.

The fix: Simply push a commit to the branch in question. It can be an empty commit if you like. This will trigger the CI workflow again and the secrets will be injected properly.

IDK why this happens, but it does. ¯\\\_(ツ)\_/¯
