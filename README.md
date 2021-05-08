# Github Action: Get current PR

Simple Github Action for checking if the current commit belongs to a pull request and returning the full PR object if that is the case

## Why?

Inside a running github action you can't always get the information whether you are currently in a PR or not. If for example the trigger event is `pull_request` you have that information but not when your trigger event is `push`.

This action enables you to get the PR no matter which event type triggered the workflow.

## Usage

```
  steps:
    - uses: actions/checkout@v1
    - uses: 8BitJonny/gh-get-current-pr@v1.1.0
      id: PR
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        # Only return if PR is still open
        filterOutClosed: true
    - run: echo "Your PR is ${prNumber} and its JSON is ${prJSON}"
      if: success() && steps.PR.outputs.number
      env:
        prNumber: ${{ steps.PR.outputs.number }}
        # JSON object with the full PR object
        prJSON: ${{ steps.PR.outputs.pr }}
        # Direct access to common PR properties
        prUrl: ${{ steps.PR.outputs.pr_url }}
        prTitle: ${{ steps.PR.outputs.pr_title }}
        prCreatedAt: ${{ steps.PR.outputs.pr_created_at }}
        prMergedAt: ${{ steps.PR.outputs.pr_merged_at }}
        prClosedAt: ${{ steps.PR.outputs.pr_closed_at }}
```

## :computer: Contributing
Contributions are always welcome!
