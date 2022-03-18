
import { Context } from '@actions/github/lib/context';
import { GitHub } from '@actions/github/lib/utils';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods'

export default function getPullRequestsAssociatedWithCommits(octokit: InstanceType<typeof GitHub>, context: Context, sha: string): Promise<RestEndpointMethodTypes['repos']['listPullRequestsAssociatedWithCommit']['response']> {
    return octokit.rest.repos.listPullRequestsAssociatedWithCommit({
        owner: context.repo.owner,
        repo: context.repo.repo,
        commit_sha: sha,
    });
};
