import * as core from '@actions/core'
import { Repository } from 'nodegit'
import { gatherCommits } from 'action_common_libs/src/commit-gathering'
import { getJiraTickets } from './detector'

// These require statements are needed as a workaround for the https://github.com/vercel/ncc/issues/1024
require('nodegit/dist/repository.js')
require('nodegit/dist/commit.js')
require('nodegit/dist/oid.js')

async function main(): Promise<void> {
  try {
    const toCommit: string = core.getInput('to', { required: true })
    const fromCommit: string = core.getInput('from', { required: true })
    const onlyResolvedTickets = core.getBooleanInput('onlyResolvedTickets')

    const repo = await Repository.open('.')
    const commits = await gatherCommits(repo, fromCommit, toCommit)

    const tickets = getJiraTickets(commits, onlyResolvedTickets)
    core.setOutput('tickets', tickets.join(','))
  } catch (error: any) {
    console.log(error)
    core.setFailed(error.message)
  }
}

void main()
