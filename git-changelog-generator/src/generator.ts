import { Commit } from 'action_common_libs/src/commit-gathering'
import { parseCommits, ParsedCommit } from 'action_common_libs/src/commit-parsing'

export interface GenerationOptions {
  gitCommitUrlPrefix: string
  jiraUrl?: string
}

export function generateChangelog(commits: Commit[], options: GenerationOptions): string {
  const sortedCommits = commits.sort((a, b) =>
    a.date < b.date ? -1 : 1
  )
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

    listText += commit.clearedSummary
    const sha = commit.commit.hash
    listText += ` ([${sha.substring(0, 8)}](${options.gitCommitUrlPrefix}${sha}))\n`
  }

  return listText
}
