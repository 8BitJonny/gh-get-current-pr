<p align="left">
  <img height="30px" src="https://forthebadge.com/images/badges/built-with-love.svg">
  <img height="30px" src="https://github.com/8BitJonny/8BitJonny/blob/master/worksOnMyMachine.svg">
  <a href="https://github.com/8BitJonny/gh-get-current-pr/actions/workflows/build.yml">
    <img src="https://github.com/8BitJonny/gh-get-current-pr/actions/workflows/build.yml/badge.svg" alt="Build Status">
  </a>
  <a href="https://github.com/8BitJonny/gh-get-current-pr/actions/workflows/test.yml">
    <img src="https://github.com/8BitJonny/gh-get-current-pr/actions/workflows/test.yml/badge.svg" alt="Test Status">
  </a>
  <a href="https://github.com/8BitJonny/gh-get-current-pr/blob/master/package.json" alt="Version">
    <img src="https://img.shields.io/github/v/release/8BitJonny/gh-get-current-pr.svg?display_name=tag&sort=semver" />
  </a>
  <a href="https://github.com/8BitJonny/gh-get-current-pr/blob/master/LICENSE.md" alt="License">
    <img src="https://img.shields.io/github/license/8BitJonny/gh-get-current-pr.svg" />
  </a>
</p>

# Github Action: Get current PR

Github Action for checking if the current commit belongs to a pull request and returning the full PR object if that is the case

## :thinking: Why?

Inside a running github action you can't always get the information whether you are currently in a PR or not. If for example the trigger event is `pull_request` you have that information but not when your trigger event is `push`.

This action enables you to get the PR no matter which event type triggered the workflow.

## :keyboard: Usage

```yml
    steps:
      - uses: 8BitJonny/gh-get-current-pr@3.0.0
        id: PR

      - run: echo "Your PR number is ${{ steps.PR.outputs.number }} and its JSON is ${{ steps.PR.outputs.pr }}"
```

### Inputs
See [action.yml](action.yml) for more details.
```yml
    steps:
      - uses: 8BitJonny/gh-get-current-pr@3.0.0
        id: PR
        with:
          # Authetication token to access GitHub APIs. (Can be omitted by default.)
          github-token: ${{ github.token }}
          # For which commit SHA the action should lookup a PR for (By default current commit)
          sha: ${{ github.event.pull_request.head.sha }}
          # Only return if PR is still open. (By default it returns PRs in any state.)
          filterOutClosed: true
          # Only return if PR is not in draft state. (By default it returns PRs in any state.)
          filterOutDraft: true
```

### Outputs
See [action.yml](action.yml) for more details.
```yml
    steps:
      - uses: 8BitJonny/gh-get-current-pr@3.0.0
        id: PR

      - run: echo "PR ${prNumber} ${prTitle} at ${prUrl} is ${prJSON}"
        if: steps.PR.outputs.pr_found == 'true'
        env:
          # JSON object with the full PR object
          # toJSON(fromJSON(...pr)) parses it into memory and then format is with pretty-print.
          prJSON: ${{ toJSON(fromJSON(steps.PR.outputs.pr)) }}
          # Direct access to common PR properties
          prNumber: ${{ steps.PR.outputs.number }}
          prUrl: ${{ steps.PR.outputs.pr_url }}
          prTitle: ${{ steps.PR.outputs.pr_title }}
          prBody: ${{ steps.PR.outputs.pr_body }}
          prCreatedAt: ${{ steps.PR.outputs.pr_created_at }}
          prMergedAt: ${{ steps.PR.outputs.pr_merged_at }}
          prClosedAt: ${{ steps.PR.outputs.pr_closed_at }}
          prLabel: ${{ steps.PR.outputs.pr_labels }}
```

### JSON output
Useful when the information you're looking for is not exported as a direct output of the action. Simply parse the `pr` output as JSON and navigate the object.
See [GitHub Documentation](https://docs.github.com/en/rest/commits/commits#list-pull-requests-associated-with-a-commit) for details how the object looks like.
```yml
    steps:
      - uses: 8BitJonny/gh-get-current-pr@3.0.0
        id: PR

      - name: "Pull Request ${{ steps.PR.outputs.number }}"
        if: steps.PR.outputs.pr_found == 'true'
        run: |
          echo "from ${{ fromJSON(steps.PR.outputs.pr).head.ref }}"
          echo "to ${{ fromJSON(steps.PR.outputs.pr).base.ref }}"
```

## Limitations

### Can't find closed, unmerged PRs
Currently, if you try to find a PR that hasn't been merged yet AND which has been closed, then this app will completely fail in finding that PR. This workflow can only find open PRs, draft PRs and closed+merged PRs.

See https://github.com/8BitJonny/gh-get-current-pr/issues/165 for the progress on this issue as this might come in a later version.


## :computer: Contributing
Contributions are always welcome!
