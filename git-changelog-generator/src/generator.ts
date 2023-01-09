import { Commit } from 'nodegit'

export interface GenerationOptions {
  gitCommitUrlPrefix: string,
  jiraUrl?: string
}

export function generateChangelog(commits: Commit[], options: GenerationOptions): string {
  const sortedCommits = commits.sort((a, b) => { return a.date().getTime() > b.date().getDate() ? -1 : 1 })
  const parsedCommits = parseCommits(sortedCommits)

  let changelog = ''

  changelog += generateCommitCategory(
    parsedCommits.filter((commit) => commit.type == 'feat'),
    'Features',
    options
  )

  changelog += generateCommitCategory(
    parsedCommits.filter((commit) => commit.type == 'fix'),
    'Bug Fixes',
    options
  )

  changelog += generateCommitCategory(parsedCommits.filter((commit) => !commit.type), '', options)

  return changelog.trim()
}

class ParsedCommit {

  constructor(commit: Commit, clearedMessage: string, scope?: string, type?: string, jiraTicket?: string) {
    this.commit = commit
    this.clearedMessage = clearedMessage
    this.scope = scope
    this.type = type
    this.jiraTicket = jiraTicket
  }

  type?: string
  scope?: string
  jiraTicket?: string
  clearedMessage: string
  commit: Commit
}

export function generateCommitCategory(
  commits: ParsedCommit[],
  categoryTitle: string,
  options: GenerationOptions
): string {
  if (commits.length == 0) {
    return ''
  }

  let categoryText = ''

  if (categoryTitle.length != 0) {
    categoryText += `### ${categoryTitle}\n\n`
  }

  categoryText += generateCommitList(commits, options)

  categoryText += "\n"

  return categoryText
}

export function generateCommitList(
  commits: ParsedCommit[],
  options: GenerationOptions
): string {
  let listText = ''

  for (let commit of commits) {
    listText += '* '

    if (commit.scope) {
      listText += `**${commit.scope}** `
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
      )
    } else {
      return new ParsedCommit(rawCommit, rawCommit.message(), undefined, undefined)
    }
  })
}

