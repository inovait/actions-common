import { Commit } from 'nodegit'

export function getJiraTickets(commits: Commit[]): string[] {
  const tickets: string[] = []

  for (const commit of commits) {
    searchForTickets(commit.message(), tickets)
    const body = commit.body()
    if (body != null) {
      searchForTickets(body, tickets)
    }
  }

  return tickets
}

function searchForTickets(text: any, target: string[]): void {
  while (true) {
    const match = JIRA_REGEX.exec(text)
    if (match == null) {
      break
    }

    const ticketName = match[0]
    if (!target.includes(ticketName)) {
      target.push(ticketName)
    }
  }
}

const JIRA_REGEX = /[A-Z]{2,4}-[0-9]+/g
