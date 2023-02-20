import { Commit, Error, Repository, Revwalk } from 'nodegit'

// These require statements are needed as a workaround for the https://github.com/vercel/ncc/issues/1024
require('nodegit/dist/repository.js')
require('nodegit/dist/commit.js')
require('nodegit/dist/oid.js')

export async function gatherCommits(repository: Repository, fromSha: string, toSha: string): Promise<Commit[]> {
  const walker = Revwalk.create(repository)
  walker.push((await repository.getCommit(toSha)).id())
  walker.hide((await repository.getCommit(fromSha)).id())

  const gatheredCommits: Commit[] = []

  while (true) {
    try {
      const next = await walker.next()
      if (next.iszero() !== 0) {
        break
      }

      const commit = await repository.getCommit(next)

      gatheredCommits.push(commit)
    } catch (e: any) {
      if (e.errno === Error.CODE.ITEROVER) {
        break
      } else {
        throw e
      }
    }
  }

  return gatheredCommits
}
