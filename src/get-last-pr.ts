import {PR} from './types/pull-request'

interface Options {
  mustBeOpen?: boolean
  preferWithHeadSha?: string
}

const Defaults: Options = {
  mustBeOpen: false
}

function findByHeadSha(pullRequests: PR[], sha: string): PR | undefined {
  return pullRequests.find(pullRequest => pullRequest.head.sha.startsWith(sha))
}

export default function getLastPullRequest(
  pullRequests: PR[],
  options: Options
): PR | null {
  options = {...options, ...Defaults}
  const filteredPRs = pullRequests.filter(
    pullRequest => pullRequest.state === 'open' || !options.mustBeOpen
  )

  if (filteredPRs.length === 0) return null

  const defaultChoice = pullRequests[0]
  const preferredChoice =
    options.preferWithHeadSha !== undefined
      ? findByHeadSha(pullRequests, options.preferWithHeadSha)
      : null
  return preferredChoice || defaultChoice
}
