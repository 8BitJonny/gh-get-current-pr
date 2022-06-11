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

```
  steps:
    - uses: 8BitJonny/gh-get-current-pr@2.0.0
      id: PR
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        # Verbose setting SHA when using Pull_Request event trigger to fix #16
        sha: ${{ github.event.pull_request.head.sha }}
        # Only return if PR is still open
        filterOutClosed: true
        # Only return if PR is not in draft state
        filterOutDraft: 1
    - run: echo "Your PR is ${prNumber} and its JSON is ${prJSON}"
      if: success() && steps.PR.outputs.number
      env:
        prNumber: ${{ steps.PR.outputs.number }}
        # JSON object with the full PR object
        prJSON: ${{ steps.PR.outputs.pr }}
        # Direct access to common PR properties
        prUrl: ${{ steps.PR.outputs.pr_url }}
        prTitle: ${{ steps.PR.outputs.pr_title }}
        prBody: ${{ steps.PR.outputs.pr_body }}
        prCreatedAt: ${{ steps.PR.outputs.pr_created_at }}
        prMergedAt: ${{ steps.PR.outputs.pr_merged_at }}
        prClosedAt: ${{ steps.PR.outputs.pr_closed_at }}
        prLabel: ${{ steps.PR.outputs.pr_labels }}
```

### Pull_request trigger
If you use the `pull_request` event trigger, it won't find the associated PR for the first commit inside that same PR out of the box.

This [article](https://frontside.com/blog/2020-05-26-github-actions-pull_request/#how-does-pull_request-affect-actionscheckout) describes why this is, in detail.
A short form of the article's explanation is, that Github creates an extra merge commit before the `pull_request` event is triggered for which this action can't find an assosiated PR. The `pull_request` trigger for the second PR commit and all following, will again work as expected.

#### Workaround
To always find and pass the correct commit SHA to this action use this workflow config:
```
      - uses: 8BitJonny/gh-get-current-pr@master
        with:
          sha: ${{ github.event.pull_request.head.sha }}
```
This will then work no matter the trigger event and no matter if it is the first PR commit or not.


## :computer: Contributing
Contributions are always welcome!
