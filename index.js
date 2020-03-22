/***************************
 * Project: ActionGetCurrentPR
 * File: index
 * Created on 22.03.20
 ***************************/

const { getInput, setOutput, setFailed } = require('@actions/core');
const { GitHub, context } = require('@actions/github');

async function main() {
    const token = getInput('github-token', { required: true });
    const sha = getInput('sha');
    const filterOutClosed = getInput('filterOutClosed');

    const result = await new GitHub(token, {}).repos.listPullRequestsAssociatedWithCommit({
        owner: context.repo.owner,
        repo: context.repo.repo,
        commit_sha: sha || context.sha,
    });

    let pr = result.data.length > 0 && result.data[0];

    if (filterOutClosed === true) {
        pr = pr.state === 'open' && pr
    }

    setOutput('number', pr && pr.number || '');
    setOutput('pr', pr ? JSON.stringify(pr) : '');
}

main().catch(err => setFailed(err.message));
