import { Commit, Error, Repository, Revwalk } from 'nodegit'

// These require statements are needed as a workaround for the https://github.com/vercel/ncc/issues/1024
require('nodegit/dist/repository.js')
require('nodegit/dist/commit.js')
require('nodegit/dist/oid.js')

// HACK: nodegit package is only declared in libs's package.json and other projects just inherit it.
// Since package takes forever to build, this ensures speedy build times

export async function gatherCommits(repository: Repository, fromSha: string, toSha: string): Promise<Commit[]> {
  const walker = Revwalk.create(repository)
  walker.pushHead()

  const gatheredCommits: Commit[] = []
  let started: boolean = false

  while (true) {
    try {
      const next = await walker.next()
      if (next.iszero() !== 0) {
        break
      }

      const commit = await repository.getCommit(next)

      if (commit.sha() === fromSha) {
        break
      }

      if (commit.sha() === toSha) {
        started = true
      }

      if (started) {
        gatheredCommits.push(commit)
      }
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
