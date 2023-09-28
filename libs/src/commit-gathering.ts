import * as child_process from 'node:child_process'

export function gatherCommits(folder: string, fromSha: string, toSha: string): Commit[] {
  // Use git log to efficiently list all commits
  // based on https://gist.github.com/cekstam/a7758b8f315835d479f379715eebd0c3
  const res = child_process.execSync(
      `git log ${fromSha}..${toSha} \\
  --pretty=format:'{^^^^hash^^^^:^^^^%H^^^^,^^^^date^^^^:^^^^%cI^^^^,^^^^parents^^^^:^^^^%P^^^^,^^^^summary^^^^:^^^^%s^^^^,^^^^body^^^^:^^^^%b^^^^}!!ZZ!!' \\
  | sed 's/"/\\\\"/g' \\
  | sed 's/\\^^^^/"/g'`,
      {
        cwd: folder
      }
  )

  return res.toString().split('!!ZZ!!')
    .filter(commitStr => commitStr.trim().length > 0)
    .map(commitStr => { console.log(commitStr); return JSON.parse(commitStr) as Commit })
}

export interface Commit {
  hash: string
  /**
   * Date in ISO8601 format
   */
  date: string

  /**
   * Space separated list of parents
   */
  parents: string

  summary: string
  body: string
}
