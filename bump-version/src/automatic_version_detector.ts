import { Commit } from 'action_common_libs/src/commit-gathering'
import { parseCommits } from 'action_common_libs/src/commit-parsing'

export function getVersionToBump(commits: Commit[]): string {
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
