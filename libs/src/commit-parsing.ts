import { Commit } from 'nodegit'

export class ParsedCommit {
  constructor(commit: Commit, clearedSummary: string, scope?: string, type?: string, jiraTicket?: string, breaking?: boolean, isCommitResolved?: boolean) {
    this.commit = commit
    this.clearedSummary = clearedSummary
    this.scope = scope
    this.type = type
    this.jiraTicket = jiraTicket
    this.breaking = breaking
    this.isCommitResolved = isCommitResolved
  }

  type?: string
  scope?: string
  jiraTicket?: string
  clearedSummary: string
  commit: Commit
  breaking?: boolean
  isCommitResolved?: boolean
}

export function parseCommits(commits: Commit[]): ParsedCommit[] {
  const commitRegex = /^(\[(.+)] )?([a-zA-Z]+)(\((.+)\))?(!?):(.*)/

  return commits.map(rawCommit => {
    const match = commitRegex.exec(rawCommit.summary())
    if (match != null) {
      const breaking = (rawCommit.body()?.includes('BREAKING') ?? false) || (
        match[6] != null && match[6].trim().length > 0
      )

      let jiraTicket = match[2]
      let commitResolved: boolean = false
      if (jiraTicket == null) {
        const jiraRegex = /(([0-9a-zA-Z]+) )?([A-Z]{2,4}-[0-9]+)/g
        const body = rawCommit.body() ?? ''
        const jiraMatchInBody = jiraRegex.exec(body)
        if (jiraMatchInBody != null) {
          jiraTicket = jiraMatchInBody[3]
          const keyword = jiraMatchInBody[2]

          if (resolveKeywords.includes(keyword)) {
            commitResolved = true
          }
        }
      }

      return new ParsedCommit(
        rawCommit,
        match[7].trim(),
        match[5],
        match[3],
        jiraTicket,
        breaking,
        commitResolved
      )
    } else {
      return new ParsedCommit(rawCommit, rawCommit.summary(), undefined, undefined, undefined)
    }
  })
}

const resolveKeywords = [
  'close',
  'closes',
  'closed',
  'fix',
  'fixes',
  'fixed',
  'resolve',
  'resolves',
  'resolved',
]


