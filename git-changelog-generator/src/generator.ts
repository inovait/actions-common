import { Commit } from 'nodegit'

export interface GenerationOptions {
  gitCommitUrlPrefix: string,
  jiraUrl?: string
}

export function generateChangelog(commits: Commit[], options: GenerationOptions): string {
  const sortedCommits = commits.sort((a, b) => { return a.date().getTime() > b.date().getDate() ? -1 : 1 })
  const parsedCommits = parseCommits(sortedCommits)

  let changelog = ''

  changelog += generateCommitCategory(parsedCommits, '', options)

  return changelog
}

class ParsedCommit {

  constructor(commit: Commit, clearedMessage: string, scope?: string, type?: string) {
    this.commit = commit
    this.clearedMessage = clearedMessage
    this.scope = scope
    this.type = type
  }

  type?: string
  scope?: string
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

  return categoryText
}

export function generateCommitList(
  commits: ParsedCommit[],
  options: GenerationOptions
): string {
  let listText = ''

  for (let commit of commits) {
    listText += '* '

    listText += commit.clearedMessage
    const sha = commit.commit.sha()
    listText += ` ([${sha.substring(0, 8)}](${options.gitCommitUrlPrefix}${sha}))\n`
  }

  return listText
}

export function parseCommits(commits: Commit[]): ParsedCommit[] {
  return commits.map(rawCommit => new ParsedCommit(rawCommit, rawCommit.message(), undefined, undefined))
}
