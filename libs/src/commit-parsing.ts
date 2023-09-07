import { CommitObject } from 'isomorphic-git'

export class ParsedCommit {
  constructor(commit: CommitObject, clearedSummary: string, scope?: string, type?: string, jiraTicket?: string, breaking?: boolean, isCommitResolved?: boolean) {
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
  commit: CommitObject
  breaking?: boolean
  isCommitResolved?: boolean
}

export function parseCommits(commits: CommitObject[]): ParsedCommit[] {
  const commitRegex = /^(\[([A-Z]{2,6}-[0-9]+)] )?([a-zA-Z]+)(\((.+)\))?(!?):(.*)/

  return commits.filter(rawCommit => rawCommit.parent.length === 1).map(rawCommit => {
    let summary: string = ''
    let body: string | undefined

    if (rawCommit.message.includes('\n')) {
      const newLinePosition = rawCommit.message.indexOf('\n')
      summary = rawCommit.message.substring(0, newLinePosition)
      body = rawCommit.message.substring(newLinePosition + 1)
    } else {
      summary = rawCommit.message
      body = undefined
    }

    const match = commitRegex.exec(summary)
    if (match != null) {
      const breaking = (body?.includes('BREAKING') ?? false) || (
        match[6] != null && match[6].trim().length > 0
      )

      let jiraTicket = match[2]
      let commitResolved: boolean = false
      if (jiraTicket == null) {
        const jiraRegex = /(([0-9a-zA-Z]+) )?([A-Z]{2,6}-[0-9]+)/g
        const jiraMatchInBody = jiraRegex.exec(body ?? '')
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
      const jiraRegex = /(([0-9a-zA-Z]+) )?([A-Z]{2,6}-[0-9]+)/g
      const jiraMatchInBody = jiraRegex.exec(body ?? '')

      let jiraTicket: string | undefined = undefined
      let commitResolved: boolean = false

      if (jiraMatchInBody != null) {
        jiraTicket = jiraMatchInBody[3]
        const keyword = jiraMatchInBody[2]

        if (resolveKeywords.includes(keyword)) {
          commitResolved = true
        }
      }

      return new ParsedCommit(rawCommit, summary, undefined, undefined, jiraTicket, undefined, commitResolved)
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
  'resolved'
]
