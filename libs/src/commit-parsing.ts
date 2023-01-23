import { Commit } from 'nodegit'

export class ParsedCommit {
  constructor(
    commit: Commit,
    clearedMessage: string,
    scope?: string,
    type?: string,
    jiraTicket?: string,
    breaking?: boolean,
    isCommitResolved: boolean = false,
    isCommitHiding: boolean = false,
  ) {
    this.commit = commit
    this.clearedMessage = clearedMessage
    this.scope = scope
    this.type = type
    this.jiraTicket = jiraTicket
    this.breaking = breaking
    this.isCommitResolved = isCommitResolved
    this.isCommitHiding = isCommitHiding
  }

  type?: string
  scope?: string
  jiraTicket?: string
  clearedMessage: string
  commit: Commit
  breaking?: boolean
  isCommitResolved: boolean
  isCommitHiding: boolean
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
      let commitResolved: boolean = false
      let commitHidden: boolean = false
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
          if (hideKeywords.includes(keyword)) {
            commitHidden = true
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
        commitResolved,
        commitHidden
      )
    } else {
      return new ParsedCommit(rawCommit, rawCommit.message(), undefined, undefined, undefined)
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

const hideKeywords = [
  'hide',
  'hides',
  'hidden'
]


