import * as core from '@actions/core'
import github from '@actions/github';
import getInputAsBoolean from './getInputAsBoolean'
import getPullRequestsAssociatedWithCommit from './getPullRequestsAssociatedWithCommit'

async function main(): Promise<void> {
  try {
    const token = core.getInput('github-token', { required: true });
    const sha = core.getInput('sha') || github.context.sha;
    const filterOutClosed = getInputAsBoolean('filterOutClosed');

    const octokit = github.getOctokit(token)
    const result = await getPullRequestsAssociatedWithCommit(octokit, github.context, sha);

    const pullRequests = result.data.filter((pullRequest) => pullRequest.state === 'open' || !filterOutClosed);

    let pr = pullRequests.length > 0 && pullRequests[0];
    pullRequests.forEach(pullRequest => pullRequest.head.sha.startsWith(sha) && (pr = pullRequest));

    core.setOutput('number', pr && pr.number.toString() || '');
    core.setOutput('pr', pr ? JSON.stringify(pr) : '');
    core.setOutput('pr_title', pr ? pr.title : '');
    core.setOutput('pr_body', pr ? pr.body : '');
    core.setOutput('pr_url', pr ? pr.html_url : '');
    core.setOutput('pr_created_at', pr ? pr.created_at : '');
    core.setOutput('pr_merged_at', pr ? pr.merged_at : '');
    core.setOutput('pr_closed_at', pr ? pr.closed_at : '');
    core.setOutput('pr_labels', pr ? pr.labels.map((e) => e.name).join(",") : '');
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

main()
