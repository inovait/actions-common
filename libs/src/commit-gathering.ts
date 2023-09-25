// These require statements are needed as a workaround for the https://github.com/vercel/ncc/issues/1024
import { readCommit, CommitObject, ReadCommitResult } from 'isomorphic-git'
import * as fs from 'fs'

export async function gatherCommits(folder: string, fromSha: string, toSha: string): Promise<CommitObject[]> {
  const commits = await getCommits(folder, fromSha, toSha)
  return commits.map((result) => result.commit)
}

async function getCommits(dir: string, fromSha: string, toSha: string): Promise<ReadCommitResult[]> {
  const tips = [
    await readCommit({
      fs,
      dir,
      oid: fromSha
    })
  ]

  const readCommits: ReadCommitResult[] = []

  while (tips.length > 0) {
    const commit = tips.pop() as ReadCommitResult
    if (commit.oid === toSha) {
      break
    }

    readCommits.push(commit)

    for (const parentSha of commit.commit.parent) {
      if (tips.map(commit => commit.oid).includes(parentSha)) {
        continue
      }

      const parentCommit = await readCommit({
        fs,
        dir,
        oid: parentSha
      })

      tips.push(parentCommit)
    }
  }

  return readCommits
}
