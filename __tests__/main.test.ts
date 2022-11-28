import {expect, test} from '@jest/globals'
// @ts-ignore
import createDummyPR from './create-dummy-pr'
import getLastPullRequest from '../src/get-last-pr'

test('prefers PR with commit as head SHA', () => {
  const testPRs = [
    createDummyPR(1, {sha: '09e30775c'}),
    createDummyPR(2, {sha: '90775cae3'})
  ]
  const options = {
    preferWithHeadSha: testPRs[1].head.sha
  }
  const foundPR = getLastPullRequest(testPRs, options) || {id: null}
  expect(foundPR.id).toBe(testPRs[1].id)
})

test('filter out draft PRs', () => {
  const testPRs = [createDummyPR(1, {draft: true})]

  expect(() => {
    getLastPullRequest(testPRs, {draft: false})
  }).toThrow("found no PR belonging to the given commit")
})

test('find a draft PRs', () => {
  const testPRs = [createDummyPR(11, {draft: true})]

  const foundPR = getLastPullRequest(testPRs, {draft: true}) || {id: null}
  expect(foundPR.id).toBe(testPRs[0].id)
})
