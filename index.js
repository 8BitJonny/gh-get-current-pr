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

    if (filterOutClosed === true) {
        pr = pr.state === 'open' && pr
    }

    setOutput('number', pr?.number.toString() ?? '');
    setOutput('pr', pr ? JSON.stringify(pr) : '');
    setOutput('pr_title', pr?.title ?? '');
    setOutput('pr_number', pr?.number.toString() ?? '');
    setOutput('pr_url', pr?.html_url ?? '');
    setOutput('pr_created_at', pr?.created_at ?? '');
    setOutput('pr_merged_at', pr?.merged_at ?? '');
    setOutput('pr_closed_at', null?.closed_at ?? '');
}

main().catch(err => setFailed(err.message));
