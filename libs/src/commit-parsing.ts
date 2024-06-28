import { Commit } from './commit-gathering'

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
  const commitRegex = /^(\[(?:([A-Z]{2,6}-[0-9]+)|#([0-9]+))] )?([a-zA-Z]+)(\((.+)\))?(!?):(.*)/

  return commits.filter(rawCommit => rawCommit.parents.split(' ').length === 1).map(rawCommit => {
    const summary: string = rawCommit.summary.trim()
    const body = rawCommit.body

    const match = commitRegex.exec(summary)
    if (match != null) {
      const breaking = (body?.includes('BREAKING') ?? false) || (
        match[7] != null && match[7].trim().length > 0
      )

      let jiraTicket = match[2] ?? match[3]
      let commitResolved: boolean = false
      if (jiraTicket == null) {
        const jiraRegex = /(([0-9a-zA-Z]+) )?(?:([A-Z]{2,6}-[0-9]+)|#([0-9]+))/g
        const jiraMatchInBody = jiraRegex.exec(body ?? '')
        if (jiraMatchInBody != null) {
          jiraTicket = jiraMatchInBody[3] ?? jiraMatchInBody[4]
          const keyword = jiraMatchInBody[2]

          if (resolveKeywords.includes(keyword)) {
            commitResolved = true
          }
        }
      }

      return new ParsedCommit(
        rawCommit,
        match[8].trim(),
        match[6],
        match[4],
        jiraTicket,
        breaking,
        commitResolved
      )
    } else {
      const jiraRegex = /(([0-9a-zA-Z]+) )?(?:([A-Z]{2,6}-[0-9]+)|#([0-9]+))/g
      const jiraMatchInBody = jiraRegex.exec(rawCommit.summary + '\n' + rawCommit.body)

      let jiraTicket: string | undefined
      let commitResolved: boolean = false

      if (jiraMatchInBody != null) {
        jiraTicket = jiraMatchInBody[3] ?? jiraMatchInBody[4]
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
