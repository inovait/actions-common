import * as core from '@actions/core'
import { getJiraClient, queryJiraTickets } from 'action_common_libs/src/jira'

async function main(): Promise<void> {
  try {
    const fixVersion: string = core.getInput('fixVersion', { trimWhitespace: true })
    const priority: string = core.getInput('priority', { trimWhitespace: true })
    const resolution: string = core.getInput('resolution', {trimWhitespace: true})

    const jira = await getJiraClient()
    const tickets = await queryJiraTickets(jira)

    for (const ticket of tickets) {
      const updateObject: any = {}
      let performRegularUpdate = false

      if(resolution != null && resolution.length !== 0) {
        updateObject.resolution = [
          {
            set: {
               name: resolution
            }
          }
        ]
        performRegularUpdate = true
      }

      if (fixVersion != null && fixVersion.length !== 0) {
        updateObject.fixVersions = [
          {
            add: {
              name: fixVersion
            }
          }
        ]
        performRegularUpdate = true
      }

      if (priority != null && priority.length !== 0) {
        updateObject.priority = [
          {
            set: {
              name: priority
            }
          }
        ]

        performRegularUpdate = true
      }

      console.info(`Updating ${ticket.key}`)

      if (performRegularUpdate) {
        await jira.updateIssue(ticket.key, {
          update: updateObject
        })
      }
    }
  } catch (error: any) {
    console.log(error)
    core.setFailed(error.message)
  }
}

void main()
