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
    const sha = getInput('sha');
    const filterOutClosed = getInputBool('filterOutClosed');

    const result = await new GitHub(token, {}).repos.listPullRequestsAssociatedWithCommit({
        owner: context.repo.owner,
        repo: context.repo.repo,
        commit_sha: sha || context.sha,
    });

    let pr = result.data.length > 0 && result.data[0];

    let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(3000);

    const result2 = await new GitHub(token, {}).repos.listPullRequestsAssociatedWithCommit({
        owner: context.repo.owner,
        repo: context.repo.repo,
        commit_sha: sha || context.sha,
    });
    let pr2 = result2.data.length > 0 && result2.data[0];

    if (filterOutClosed === true) {
        pr = pr.state === 'open' && pr
    }

    setOutput('number', pr && pr.number.toString() || '');
    setOutput('pr', pr ? JSON.stringify(pr) : '');
    setOutput('pr_title', pr ? pr.title : '');
    setOutput('pr_url', pr ? pr.html_url : '');
    setOutput('pr_created_at', pr ? pr.created_at : '');
    setOutput('pr_merged_at', pr ? pr.merged_at : '');
    setOutput('pr_closed_at', pr ? pr.closed_at : '');

    setOutput('sha', sha || '');
    setOutput('context_sha', context.sha || '');
    setOutput('number2', pr2 && pr2.number.toString() || '');
}

main().catch(err => setFailed(err.message));
