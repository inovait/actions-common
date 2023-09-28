import { Commit } from 'action_common_libs/src/commit-gathering'

export function createFakeCommit(
    sha: string,
    summary: string,
    isoDate: string,
    description: string = '',
    parentCount: number = 1
): Commit {
  let parents = ''
  for (let i = 0; i < parentCount; i++) {
    parents += 'P '
  }
  parents = parents.trim()

  // Only implement required methods
  return {
    hash: sha,
    date: isoDate,
    summary,
    body: description,
    parents
  }
}
