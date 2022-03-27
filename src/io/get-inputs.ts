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
  const sha = core.getInput('sha') || github.context.sha
  const filterOutDraft = getInputAsBoolean('filterOutDraft')
  const filterOutClosed = getInputAsBoolean('filterOutClosed')
  return {
    token,
    sha,
    filterOutDraft,
    filterOutClosed
  }
}
