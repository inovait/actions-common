import { parseCommits } from 'action_common_libs/src/commit-parsing'
import { CommitObject } from 'isomorphic-git'

export function getVersionToBump(commits: CommitObject[]): string {
  const parsedCommits = parseCommits(commits)

  if (parsedCommits.find((commit) => commit.breaking) != null) {
    return 'major'
  }

  if (parsedCommits.find((commit) => commit.type === 'feat') != null) {
    return 'minor'
  }

  if (parsedCommits.find((commit) => commit.type === 'fix' ||
    parsedCommits.every((commit) => commit.type == null)) != null
  ) {
    return 'patch'
  }

  return 'none'
}
