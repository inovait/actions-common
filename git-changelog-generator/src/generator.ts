import { Commit } from 'action_common_libs/src/commit-gathering'
import { parseCommits, ParsedCommit } from 'action_common_libs/src/commit-parsing'
import { Octokit } from '@octokit/rest'

export interface GenerationOptions {
  gitCommitUrlPrefix: string
  jiraUrl?: string
  showNames?: boolean
  excludeEmails?: string[]
  githubToken?: string
}

async function fetchGithubUsernames(options: GenerationOptions, customFetch: any, sortedCommits: Commit[], githubUsernameMap: Map<string, string>): Promise<void> {
  const octokit = new Octokit({
    auth: options.githubToken,
    request: {
      fetch: customFetch
    }
  })

  const parsedCommits = parseCommits(sortedCommits)

  for (const commit of parsedCommits) {
    const email = commit.commit.authorEmail
    if (options.excludeEmails?.includes(email) === true) {
      continue
    }

    console.log(email)
    if (!githubUsernameMap.has(email)) {
      try {
        const query = encodeURIComponent(`author-email:"${email}"`)

        // Query must be added to the URL manually to fix
        // broken octokit encoding of the plus sign
        const res = await octokit.request(`GET /search/commits?q=${query}`, {
          per_page: 1,
          sort: 'committer-date',
          order: 'desc'
        })
        console.log(res)

        const username = res.data.items?.at(0)?.author?.login
        if (username != null) {
          githubUsernameMap.set(email, username)
        }
      } catch (e) {
        console.error('Failed to get the username for the ', email)
        console.error(e)
      }
    }
  }
}

export async function generateChangelog(commits: Commit[], options: GenerationOptions, customFetch: any | undefined = undefined): Promise<string> {
  const sortedCommits = commits.sort((a, b) =>
    a.date < b.date ? -1 : 1
  )

  const parsedCommits = parseCommits(sortedCommits)

  const githubUsernameMap = new Map<string, string>()
  if (options.githubToken != null && options.githubToken.trim() !== '' && options.showNames === true) {
    await fetchGithubUsernames(
      options,
      customFetch,
      sortedCommits,
      githubUsernameMap
    )
  }

  let changelog = ''

  changelog += generateCommitCategory(
    parsedCommits.filter((commit) => (commit.breaking === true) && commit.type === 'feat'),
    'BREAKING Features',
    options,
    githubUsernameMap
  )

  changelog += generateCommitCategory(
    parsedCommits.filter((commit) => (commit.breaking === true) && commit.type === 'fix'),
    'BREAKING Bug Fixes',
    options,
    githubUsernameMap
  )

  changelog += generateCommitCategory(
    parsedCommits.filter((commit) => (commit.breaking === false) && commit.type === 'feat'),
    'Features',
    options,
    githubUsernameMap
  )

  changelog += generateCommitCategory(
    parsedCommits.filter((commit) => (commit.breaking === false) && commit.type === 'fix'),
    'Bug Fixes',
    options,
    githubUsernameMap
  )

  changelog += generateCommitCategory(
    parsedCommits.filter((commit) => (commit.type != null) && commit.type !== 'feat' && commit.type !== 'fix' && ((commit.breaking === true) || commit.jiraTicket)),
    'Miscellaneous',
    options,
    githubUsernameMap
  )

  changelog += generateCommitCategory(
    parsedCommits.filter(
      (commit) => commit.type == null
    ),
    '',
    options,
    githubUsernameMap
  )

  return changelog.trim()
}

export function generateCommitCategory(
  commits: ParsedCommit[],
  categoryTitle: string,
  options: GenerationOptions,
  githubUsernameMap: Map<string, string>
): string {
  if (commits.length === 0) {
    return ''
  }

  let categoryText = ''

  if (categoryTitle.length !== 0) {
    categoryText += `### ${categoryTitle}\n\n`
  }

  categoryText += generateCommitList(commits, options, githubUsernameMap)

  categoryText += '\n'

  return categoryText
}

export function generateCommitList(
  commits: ParsedCommit[],
  options: GenerationOptions,
  githubUsernameMap: Map<string, string>
): string {
  let listText = ''

  for (const commit of commits) {
    listText += '* '

    if ((commit.jiraTicket != null) && (options.jiraUrl != null)) {
      const isGithubTicket = !isNaN(Number(commit.jiraTicket))
      if (isGithubTicket) {
        listText += `[#${commit.jiraTicket}](${options.jiraUrl}/issues/${commit.jiraTicket}) - `
      } else {
        listText += `[${commit.jiraTicket}](${options.jiraUrl}/browse/${commit.jiraTicket}) - `
      }
    }

    if (commit.scope != null) {
      listText += `**${commit.scope}**: `
    }

    listText += commit.clearedSummary
    const sha = commit.commit.hash
    listText += ` ([${sha.substring(0, 8)}](${options.gitCommitUrlPrefix}${sha}))`

    const authorEmail = commit.commit.authorEmail
    if (options.showNames === true && options.excludeEmails?.includes(authorEmail) !== true) {
      const githubUsername = githubUsernameMap.get(authorEmail)
      let displayedName: string
      if (githubUsername != null) {
        displayedName = `@${githubUsername}`
      } else {
        displayedName = `${commit.commit.authorName}`
      }
      listText += ` by ${displayedName}`
    }

    listText += '\n'
  }

  return listText
}
