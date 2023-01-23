import { Commit } from 'nodegit'
import { parseCommits } from 'action_common_libs/src/commit-parsing'
import JiraApi from 'jira-client'

export async function getLastCommitToMerge(commits: Commit[], jira: JiraApi): Promise<string | null> {
  const parsedCommits = parseCommits(commits)

  let lastCommit: string | null = null

  const hiddenTickets: string[] = []

  for (let i = 0; i < commits.length; i++) {
    const commit = parsedCommits[i]

    if (commit.jiraTicket != null) {
      if (commit.isCommitHiding) {
        hiddenTickets.push(commit.jiraTicket)
      }

      if (hiddenTickets.includes(commit.jiraTicket)) {
        commit.jiraTicket = undefined
      }
    }
  }

  const flippedCommits = parsedCommits.reverse()

  for (const commit of flippedCommits) {
    if (commit.jiraTicket != null && commit.isCommitResolved) {
      try {
        const ticket = await jira.getIssue(commit.jiraTicket)
        const status = ticket.status.name
        if (status !== 'Verified' && status !== 'Closed' && status !== 'Resolved') {
          break
        }
      } catch (e) {
        console.warn('Failed to load ticket', commit.jiraTicket, e)
      }
    }

    lastCommit = commit.commit.sha()
  }

  return lastCommit
}
