import * as github from '@actions/github'
import * as core from '@actions/core'
import {GitHub} from '@actions/github/lib/utils'
import {PR} from '../types/pull-request'

export default async function getPullRequestsAssociatedWithCommits(
  octokit: InstanceType<typeof GitHub>,
  sha: string
): Promise<PR[]> {
  const triggeredFromPR =
    github.context.eventName === 'pull_request' ||
    github.context.eventName === 'pull_request_target'
  const result = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
    owner: triggeredFromPR
      ? github.context.payload.pull_request?.head.repo.owner.login
      : github.context.repo.owner,
    repo: triggeredFromPR
      ? github.context.payload.pull_request?.head.repo.name
      : github.context.repo.repo,
    commit_sha: sha
  })
  core.debug(`Used url to fetch associated PRs: ${result.url}`)
  return result.data
}
