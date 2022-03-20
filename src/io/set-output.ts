import * as core from '@actions/core'
import {PR} from '../types/pull-request'

function setIfNotNull(
  map: Map<string, string>,
  key: string,
  value: string | null
): void {
  value && map.set(key, value)
}

const outputKeys = [
  'number',
  'pr',
  'pr_title',
  'pr_body',
  'pr_url',
  'pr_created_at',
  'pr_merged_at',
  'pr_closed_at',
  'pr_labels'
]

export default function setOutput(pr: PR | null): void {
  const outputVars = new Map<string, string>()
  if (pr) {
    setIfNotNull(outputVars, 'number', pr.number.toString())
    setIfNotNull(outputVars, 'pr', JSON.stringify(pr))
    setIfNotNull(outputVars, 'pr_title', pr.title)
    setIfNotNull(outputVars, 'pr_body', pr.body)
    setIfNotNull(outputVars, 'pr_url', pr.html_url)
    setIfNotNull(outputVars, 'pr_created_at', pr.created_at)
    setIfNotNull(outputVars, 'pr_merged_at', pr.merged_at)
    setIfNotNull(outputVars, 'pr_closed_at', pr.closed_at)
    setIfNotNull(outputVars, 'pr_labels', pr.labels.map(e => e.name).join(','))
  }

  for (const key of outputKeys) {
    const value = outputVars.get(key) || ''
    core.debug(`Setting output: key: "${key}", value: "${value}"`)
    core.setOutput(key, value)
  }
}
