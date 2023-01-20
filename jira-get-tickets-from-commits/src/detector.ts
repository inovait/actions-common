import { Commit } from 'nodegit'
import { parseCommits } from 'action_common_libs/src/commit-parsing'

export function getJiraTickets(commits: Commit[], onlyFinalCommits: boolean = false): string[] {
  const parsedCommits = parseCommits(commits)
  const tickets: string[] = []

  for (const commit of parsedCommits) {
    if (commit.jiraTicket != null && (!onlyFinalCommits || commit.isCommitResolved === true)) {
      tickets.push(commit.jiraTicket)
    }
  }

  return tickets
}
