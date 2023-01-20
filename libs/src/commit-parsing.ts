import { Commit } from 'nodegit'

export class ParsedCommit {
  constructor(commit: Commit, clearedMessage: string, scope?: string, type?: string, jiraTicket?: string, breaking?: boolean) {
    this.commit = commit
    this.clearedMessage = clearedMessage
    this.scope = scope
    this.type = type
    this.jiraTicket = jiraTicket
    this.breaking = breaking
  }

  type?: string
  scope?: string
  jiraTicket?: string
  clearedMessage: string
  commit: Commit
  breaking?: boolean
}

export function parseCommits(commits: Commit[]): ParsedCommit[] {
  const commitRegex = /^(\[(.+)] )?([a-zA-Z]+)(\((.+)\))?(!?):(.*)/

  return commits.map(rawCommit => {
    const match = commitRegex.exec(rawCommit.message())
    if (match != null) {
      const breaking = (rawCommit.body()?.includes('BREAKING') ?? false) || (
        match[6] != null && match[6].trim().length > 0
      )

      let jiraTicket = match[2]
      if (jiraTicket == null) {
        const body = rawCommit.body() ?? ''
        JIRA_REGEX.lastIndex = 0
        const jiraMatchInBody = JIRA_REGEX.exec(body)
        if (jiraMatchInBody != null) {
          jiraTicket = jiraMatchInBody[0]
        }
      }

      return new ParsedCommit(
        rawCommit,
        match[7].trim(),
        match[5],
        match[3],
        jiraTicket,
        breaking
      )
    } else {
      return new ParsedCommit(rawCommit, rawCommit.message(), undefined, undefined, undefined)
    }
  })
}

const JIRA_REGEX = /[A-Z]{2,4}-[0-9]+/g
