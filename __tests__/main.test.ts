import {expect, test} from '@jest/globals'
// @ts-ignore
import createDummyPR from './create-dummy-pr'
import getLastPullRequest from '../src/get-last-pr'

test('prefers PR with commit as head SHA', () => {
  const testPRs = [createDummyPR(1, '09e30775c'), createDummyPR(2, '90775cae3')]
  const options = {
    preferWithHeadSha: testPRs[1].head.sha
  }
  const foundPR = getLastPullRequest(testPRs, options) || {id: null}
  expect(foundPR).not.toBeNull()
  expect(foundPR.id).toBe(testPRs[1].id)
})
