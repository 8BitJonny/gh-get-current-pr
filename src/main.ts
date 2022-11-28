import * as core from '@actions/core'
import * as github from '@actions/github'
import getInputs from './io/get-inputs'
import getLastPullRequest from './get-last-pr'
import getPRsAssociatedWithCommit from './adapter/get-prs-associated-with-commit'
import setOutput from './io/set-output'

async function main(): Promise<void> {
  try {
    const {token, sha, filterOutClosed, filterOutDraft} = getInputs()

    const octokit = github.getOctokit(token)
    const allPRs = await getPRsAssociatedWithCommit(octokit, sha)

    if (allPRs.length === 0) {
      throw new Error(`found no PR belonging to the given commit '${sha}'`)
    }

    const pr = getLastPullRequest(allPRs, {
      draft: !filterOutDraft,
      closed: !filterOutClosed,
      preferWithHeadSha: sha
    })

    setOutput(pr)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

main()
