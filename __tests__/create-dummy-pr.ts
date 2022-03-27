import {PR} from '../src/types/pull-request'

export default function createDummyPR(id: number, sha: string): PR {
  return Object.assign({} as PR, {
    id,
    head: {
      sha
    }
  })
}
