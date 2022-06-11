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
    - uses: 8BitJonny/gh-get-current-pr@2.0.0
      id: PR

    - run: echo "Your PR number is ${{ steps.PR.outputs.number }} and its JSON is ${{ steps.PR.outputs.pr }}"
```

### Inputs
See [action.yml](action.yml) for more details.
```yml
    - uses: 8BitJonny/gh-get-current-pr@2.0.0
      id: PR
      with:
        # Authetication token to access GitHub APIs. (Can be omitted by default.)
        github-token: ${{ github.token }}
        # Verbose setting SHA when using Pull_Request event trigger to fix #16. (For push even trigger this is not necessary.)
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
    - uses: 8BitJonny/gh-get-current-pr@2.0.0
      id: PR

    - run: echo "PR ${prNumber} ${prTitle} at ${prUrl} is ${prJSON}"
      if: steps.PR.outcome == 'success'
      env:
        # JSON object with the full PR object
        # toJSON(fromJSON(...pr)) parses it into memory and then format is with pretty-print.
        prJSON: ${{ toJSON(fromJSON(steps.current_pr.outputs.pr)) }}
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
    - uses: 8BitJonny/gh-get-current-pr@2.0.0
      id: PR

    - name: "Pull Request ${{ steps.PR.outputs.number }}"
      run: |
        echo "from ${{ fromJSON(steps.PR.outputs.pr).head.ref }}"
        echo "to ${{ fromJSON(steps.PR.outputs.pr).base.ref }}"
```

### Pull_request trigger
If you use the `pull_request` event trigger, it won't find the associated PR for the first commit inside that same PR out of the box.

This [article](https://frontside.com/blog/2020-05-26-github-actions-pull_request/#how-does-pull_request-affect-actionscheckout) describes why this is, in detail.
A short form of the article's explanation is, that Github creates an extra merge commit before the `pull_request` event is triggered for which this action can't find an assosiated PR. The `pull_request` trigger for the second PR commit and all following, will again work as expected.

#### Workaround
To always find and pass the correct commit SHA to this action use this workflow config:
```yml
      - uses: 8BitJonny/gh-get-current-pr@2.0.0
        with:
          sha: ${{ github.event.pull_request.head.sha }}
```
This will then work no matter the trigger event and no matter if it is the first PR commit or not.


## :computer: Contributing
Contributions are always welcome!
