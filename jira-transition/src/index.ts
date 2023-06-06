import * as core from '@actions/core'
import { getJiraClient, queryJiraTickets } from 'action_common_libs/src/jira'

interface TransitionsResponse {
  transitions: Transition[]
}

interface Transition {
  id: string
  name: string
}

async function main(): Promise<void> {
  try {
    const from: string | undefined = core.getInput('from')?.toLowerCase()?.trim()
    const to: string = core.getInput('to', { required: true }).toLowerCase()?.trim()
    let resolution: string = core.getInput('resolution')
    const jira = await getJiraClient()
    const tickets = await queryJiraTickets(jira)

    for (const ticket of tickets) {
      const status = ticket.fields.status
      if (from != null && from.length > 0 && status.name?.toLowerCase() !== from) {
        core.info(`Ticket ${ticket.key} is not in '${from}', but in '${status.name}'. Skipping...`)
        continue
      }

      const allPossibleTransitions: TransitionsResponse = await jira.listTransitions(ticket.key) as TransitionsResponse
      let targetTransition: Transition | null = null

      for (const transition of allPossibleTransitions.transitions) {
        if (transition.name.toLowerCase() === to) {
          targetTransition = transition
          break
        }
      }

      if (targetTransition == null) {
        const possibleTransitionsText = allPossibleTransitions.transitions.map((t) => t.name).join(', ')
        core.setFailed(`Invalid transition '${to}' for issue ${ticket.key}. Possible transitions: ${possibleTransitionsText}`)
        return
      }

      if (resolution === '') {
        if (ticket.fields.issuetype.name === 'Bug') {
          resolution = 'Fixed'
        } else {
          resolution = 'Done'
        }
      }
      core.info(`Transitioning ${ticket.key} to ${targetTransition.name} (${targetTransition.id}).`)
      await jira.transitionIssue(ticket.key, {
        transition: {
          id: targetTransition.id
        },
        fields: {
          resolution: {
            name: resolution
          }
        }
      })
    }
  } catch (error: any) {
    console.log(error)
    core.setFailed(error.message)
  }
}

void main()
