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

      return new ParsedCommit(
        rawCommit,
        match[7].trim(),
        match[5],
        match[3],
        match[2],
        breaking
      )
    } else {
      return new ParsedCommit(rawCommit, rawCommit.message(), undefined, undefined, undefined)
    }
  })
}
