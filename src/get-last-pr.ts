import {PR} from './types/pull-request'

interface Options {
  draft?: boolean
  closed?: boolean
  preferWithHeadSha?: string
}

const Defaults: Options = {
  draft: true,
  closed: true
}

function findByHeadSha(pullRequests: PR[], sha: string): PR | undefined {
  return pullRequests.find(pullRequest => pullRequest.head.sha.startsWith(sha))
}

export default function getLastPullRequest(
  pullRequests: PR[],
  options: Options
): PR {
  options = {...Defaults, ...options}

  const filteredPRs = pullRequests
    .filter(({state}) => state === 'open' || !!options.closed)
    .filter(({draft}) => !draft || !!options.draft)

  if (filteredPRs.length === 0) throw new Error("found no PR belonging to the given commit")

  const defaultChoice = pullRequests[0]
  const preferredChoice =
    options.preferWithHeadSha !== undefined
      ? findByHeadSha(pullRequests, options.preferWithHeadSha)
      : null
  return preferredChoice || defaultChoice
}
