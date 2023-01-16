// noinspection ExceptionCaughtLocallyJS

import * as core from '@actions/core'
import { Repository } from 'nodegit'
import { generateChangelog } from './generator'
import * as fs from 'fs/promises'
import { gatherCommits } from 'action_common_libs/src/commit-gathering'

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
    const commits = await gatherCommits(repo, fromCommit, toCommit)

    const changelog = generateChangelog(commits, {
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
