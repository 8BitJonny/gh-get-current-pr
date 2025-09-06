import * as core from '@actions/core'
import * as github from '@actions/github'
import getInputAsBoolean from './get-input-as-boolean'

type ActionInput = {
  token: string
  sha: string
  filterOutDraft: boolean
  filterOutClosed: boolean
}

export default function getInputs(): ActionInput {
  const token = core.getInput('github-token', {required: true})
  const triggeredFromPR =
    github.context.eventName === 'pull_request' ||
    github.context.eventName === 'pull_request_target'
  const sha =
    core.getInput('sha') ||
    (triggeredFromPR
      ? github.context.payload.pull_request?.head.sha
      : github.context.sha)
  const filterOutDraft = getInputAsBoolean('filterOutDraft')
  const filterOutClosed = getInputAsBoolean('filterOutClosed')
  return {
    token,
    sha,
    filterOutDraft,
    filterOutClosed
  }
}
