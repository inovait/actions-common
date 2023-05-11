import * as core from '@actions/core'
import { gatherCommits } from 'action_common_libs/src/commit-gathering'
import { getJiraTickets } from './detector'

async function main(): Promise<void> {
  try {
    const toCommit: string = core.getInput('to', { required: true })
    const fromCommit: string = core.getInput('from', { required: true })
    const onlyResolvedTickets = core.getBooleanInput('onlyResolvedTickets')

    const commits = await gatherCommits('.', fromCommit, toCommit)

    const tickets = getJiraTickets(commits, onlyResolvedTickets)
    core.setOutput('tickets', tickets.join(','))
  } catch (error: any) {
    console.log(error)
    core.setFailed(error.message)
  }
}

void main()
