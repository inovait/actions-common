// noinspection ExceptionCaughtLocallyJS

import * as core from '@actions/core'
import { Commit, Error, Repository, Revwalk } from 'nodegit'
import { generateChangelog } from './generator'
import * as fs from 'fs/promises'

// These require statements are needed as a workaround for the https://github.com/vercel/ncc/issues/1024
require('nodegit/dist/repository.js')
require('nodegit/dist/commit.js')
require('nodegit/dist/oid.js')

async function main(): Promise<void> {
  try {
    const toCommit: string = core.getInput('to', { required: true })
    const fromCommit: string = core.getInput('from', { required: true })
    const gitCommitUrlPrefix: string = core.getInput('git_commit_url_prefix', { required: true })
    const targetFile: string = core.getInput('target_file')
    const jiraUrl: string = core.getInput('jira_url')

    const repo = await Repository.open('.')
    const walker = Revwalk.create(repo)
    walker.pushHead()

    const gatheredCommits: Commit[] = []
    let started: boolean = false

    while (true) {
      try {
        const next = await walker.next()
        if (next.iszero() !== 0) {
          break
        }

        const commit = await repo.getCommit(next)

        if (commit.sha() === fromCommit) {
          break
        }

        if (commit.sha() === toCommit) {
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

    const changelog = generateChangelog(gatheredCommits, {
      gitCommitUrlPrefix,
      jiraUrl
    })

    if (targetFile !== '') {
      await fs.writeFile(targetFile, changelog)
    }

    core.setOutput('changelog', changelog)
  } catch (error: any) {
    console.log(error)
    core.setFailed(error.message)
  }
}

void main()
