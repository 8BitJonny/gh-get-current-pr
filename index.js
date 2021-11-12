/***************************
 * Project: ActionGetCurrentPR
 * File: index
 * Created on 22.03.20
 ***************************/

const { getInput, setOutput, setFailed } = require('@actions/core');
const { GitHub, context } = require('@actions/github');

const getInputBool = (name, defaultValue = false) => {
    const param = getInput(name);
    if (param === 'true' || param === '1') {
        return true
    } else if (param === 'false' || param === '0') {
        return false
    } else return defaultValue
};

async function main() {
    const token = getInput('github-token', { required: true });
    const sha = getInput('sha') || context.sha;
    const filterOutClosed = getInputBool('filterOutClosed');

    const result = await new GitHub(token, {}).repos.listPullRequestsAssociatedWithCommit({
        owner: context.repo.owner,
        repo: context.repo.repo,
        commit_sha: sha,
    });

    const pullRequests = result.data.filter((pullRequest) => pullRequest.state === 'open' || !filterOutClosed);

    let pr = pullRequests[0] ?? [];
    pullRequests.forEach(pullRequest => pullRequest.head.sha.startsWith(sha) && (pr = pullRequest));

    setOutput('number', pr && pr.number.toString() || '');
    setOutput('pr', pr ? JSON.stringify(pr) : '');
    setOutput('pr_title', pr ? pr.title : '');
    setOutput('pr_body', pr ? pr.body : '');
    setOutput('pr_url', pr ? pr.html_url : '');
    setOutput('pr_created_at', pr ? pr.created_at : '');
    setOutput('pr_merged_at', pr ? pr.merged_at : '');
    setOutput('pr_closed_at', pr ? pr.closed_at : '');
}

main().catch(err => setFailed(err.message));
