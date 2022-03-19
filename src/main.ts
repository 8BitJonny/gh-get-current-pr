import * as core from '@actions/core'
import * as github from '@actions/github'
import getInputs from './io/get-inputs'
import getLastPullRequest from './get-last-pr'
import getPRsAssociatedWithCommit from './get-prs-associated-with-commit'
import setOutput from './io/set-output'

async function main(): Promise<void> {
  try {
    const {token, sha, filterOutClosed} = getInputs()

    const octokit = github.getOctokit(token)
    const allPRs = await getPRsAssociatedWithCommit(octokit, sha)

    const pr = getLastPullRequest(allPRs, {
      mustBeOpen: filterOutClosed,
      preferWithHeadSha: sha
    })

    setOutput(pr)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

main()
