import { parseCommits } from 'action_common_libs/src/commit-parsing'
import { CommitObject } from 'isomorphic-git'

export function getJiraTickets(commits: CommitObject[], onlyFinalCommits: boolean = false): string[] {
  const parsedCommits = parseCommits(commits)
  const tickets: string[] = []

  for (const commit of parsedCommits) {
    console.log("Commit", commit)
    if (commit.jiraTicket != null && (!onlyFinalCommits || commit.isCommitResolved === true)) {
      tickets.push(commit.jiraTicket)
    }
  }

  return tickets
}
