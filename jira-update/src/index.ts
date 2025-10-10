import * as core from '@actions/core'
import { getJiraClient, queryJiraTickets } from 'action_common_libs/src/jira'
import { Version3Parameters } from 'jira.js'

async function main(): Promise<void> {
  try {
    const fixVersion: string = core.getInput('fixVersion', { trimWhitespace: true })
    const priority: string = core.getInput('priority', { trimWhitespace: true })
    const field: string = core.getInput('field', { trimWhitespace: true })

    const jira = await getJiraClient()
    const tickets = await queryJiraTickets(jira)

    for (const ticket of tickets) {
      let performRegularUpdate = false

      const updateObject: any = {}
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

      if (field != null) {
        const fieldSplit = field.split('+=')

        if (fieldSplit.length === 2) {
          const fieldName = fieldSplit[0]
          const fieldToInsert = fieldSplit[1]

          updateObject[fieldName] = [
            {
              add: fieldToInsert
            }
          ]

          performRegularUpdate = true
        }
      }

      console.info(`Updating ${ticket.key}`)

      if (performRegularUpdate) {
        const editIssue: Version3Parameters.EditIssue = { issueIdOrKey: ticket.key, update: updateObject }
        await jira.issues.editIssue(editIssue)
      }
    }
  } catch (error: any) {
    console.log(error)
    core.setFailed(error.message)
  }
}

void main()
