import * as github from '@actions/github'
import * as core from '@actions/core'
import {GitHub} from '@actions/github/lib/utils'
import {PR} from '../types/pull-request'

export default async function getPullRequestsAssociatedWithCommits(
  octokit: InstanceType<typeof GitHub>,
  sha: string
): Promise<PR[]> {
  const result = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    commit_sha: sha
  })
  core.debug(`Used url to fetch associated PRs: ${result.url}`)
  return result.data
}
