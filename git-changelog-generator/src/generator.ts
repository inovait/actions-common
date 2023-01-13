import { Commit } from 'nodegit'

export interface GenerationOptions {
  gitCommitUrlPrefix: string
  jiraUrl?: string
}

export function generateChangelog(commits: Commit[], options: GenerationOptions): string {
  const sortedCommits = commits.sort((a, b) => { return a.date().getTime() > b.date().getDate() ? -1 : 1 })
  const parsedCommits = parseCommits(sortedCommits)

  let changelog = ''

  changelog += generateCommitCategory(
    parsedCommits.filter((commit) => (commit.breaking === true) && commit.type === 'feat'),
    'BREAKING Features',
    options
  )

  changelog += generateCommitCategory(
    parsedCommits.filter((commit) => (commit.breaking === true) && commit.type === 'fix'),
    'BREAKING Bug Fixes',
    options
  )

  changelog += generateCommitCategory(
    parsedCommits.filter((commit) => (commit.breaking === false) && commit.type === 'feat'),
    'Features',
    options
  )

  changelog += generateCommitCategory(
    parsedCommits.filter((commit) => (commit.breaking === false) && commit.type === 'fix'),
    'Bug Fixes',
    options
  )

  changelog += generateCommitCategory(
    parsedCommits.filter((commit) => (commit.type != null) && commit.type !== 'feat' && commit.type !== 'fix' && ((commit.breaking === true) || commit.jiraTicket)),
    'Miscellaneous',
    options
  )

  changelog += generateCommitCategory(parsedCommits.filter((commit) => commit.type == null), '', options)

  return changelog.trim()
}

class ParsedCommit {
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

export function generateCommitCategory(
  commits: ParsedCommit[],
  categoryTitle: string,
  options: GenerationOptions
): string {
  if (commits.length === 0) {
    return ''
  }

  let categoryText = ''

  if (categoryTitle.length !== 0) {
    categoryText += `### ${categoryTitle}\n\n`
  }

  categoryText += generateCommitList(commits, options)

  categoryText += '\n'

  return categoryText
}

export function generateCommitList(
  commits: ParsedCommit[],
  options: GenerationOptions
): string {
  let listText = ''

  for (const commit of commits) {
    listText += '* '

    if ((commit.jiraTicket != null) && (options.jiraUrl != null)) {
      listText += `[${commit.jiraTicket}](${options.jiraUrl}/browse/${commit.jiraTicket}) - `
    }

    if (commit.scope != null) {
      listText += `**${commit.scope}**: `
    }

    listText += commit.clearedMessage
    const sha = commit.commit.sha()
    listText += ` ([${sha.substring(0, 8)}](${options.gitCommitUrlPrefix}${sha}))\n`
  }

  return listText
}

export function parseCommits(commits: Commit[]): ParsedCommit[] {
  const commitRegex = /^(\[(.+)] )?([a-zA-Z]+)(\((.+)\))?:(.*)/

  return commits.map(rawCommit => {
    const match = commitRegex.exec(rawCommit.message())
    if (match != null) {
      return new ParsedCommit(
        rawCommit,
        match[6].trim(),
        match[5],
        match[3],
        match[2],
        rawCommit.body()?.includes('BREAKING') ?? false
      )
    } else {
      return new ParsedCommit(rawCommit, rawCommit.message(), undefined, undefined, undefined)
    }
  })
}
