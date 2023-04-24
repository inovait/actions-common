// These require statements are needed as a workaround for the https://github.com/vercel/ncc/issues/1024
import { readCommit, log, CommitObject } from 'isomorphic-git'
import * as fs from 'fs'

export async function gatherCommits(folder: string, fromSha: string, toSha: string): Promise<CommitObject[]> {
  const fromCommit = await readCommit({
    fs,
    dir: folder,
    oid: fromSha
  })

  const since = new Date(fromCommit.commit.committer.timestamp * 1000)

  const results = await log({
    fs,
    dir: folder,
    ref: toSha,
    since
  })

  return results.map((result) => result.commit)
}
