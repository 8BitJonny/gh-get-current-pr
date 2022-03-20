import * as core from '@actions/core'
import {PR} from '../types/pull-request'

function setOutputWithDebug(key: string, value: string | null): void {
  core.debug(`Setting output: key: "${key}", value: "${value}"`)
  core.setOutput(key, value)
}

export default function setOutput(pr: PR | null): void {
  if (pr) {
    setOutputWithDebug('number', pr.number.toString())
    setOutputWithDebug('pr', JSON.stringify(pr))
    setOutputWithDebug('pr_title', pr.title)
    setOutputWithDebug('pr_body', pr.body)
    setOutputWithDebug('pr_url', pr.html_url)
    setOutputWithDebug('pr_created_at', pr.created_at)
    setOutputWithDebug('pr_merged_at', pr.merged_at)
    setOutputWithDebug('pr_closed_at', pr.closed_at)
    setOutputWithDebug('pr_labels', pr.labels.map(e => e.name).join(','))
  }
}
