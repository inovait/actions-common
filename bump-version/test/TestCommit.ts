import { CommitObject } from 'isomorphic-git'

export function createFakeCommit(
  sha: string,
  summary: string,
  isoDate: string,
  description: string = '',
  parentCount: number = 1
): CommitObject {
  let message: string
  if (description.length === 0) {
    message = summary
  } else {
    message = `${summary}\n\n${description}`
  }

  // Only implement required methods
  return {
    tree: sha,
    message,
    // @ts-expect-error
    committer: {
      timestamp: new Date(Date.parse(isoDate)).getTime() / 1000
    },
    parent: new Array(parentCount)
  }
}
