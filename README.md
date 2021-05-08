# Github Action: Get current PR

Simple Github Action for checking if the current commit belongs to a pull request and returning the full PR object if that is the case

## Initial Problem

Inside the workflow you can't always get the information whether you are currently in a PR or not. If for example the trigger event is `pull_request` you have that
information but not when your trigger event is `push`. This action enables to get the PR even if you trigger the workflow on `push`.

## Usage

```
  steps:
    - uses: actions/checkout@v1
    - uses: 8BitJonny/gh-get-current-pr@v1.0.1
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
```
