import * as core from '@actions/core'
import { getJiraClient, queryJiraTickets } from 'action_common_libs/src/jira'

async function main(): Promise<void> {
  try {
    const rawComment: string = core.getInput('comment', { required: true })

    const jira = await getJiraClient()

    // Attempt to parse JSON if comment is in Atlassian Document Format
    let comment: any
    try {
      comment = JSON.parse(rawComment)
    } catch (e) {
      // Comment is not in ADF format, convert it.
      comment = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: rawComment
              }
            ]
          }
        ]
      }
    }

    const tickets = await queryJiraTickets(jira)

    for (const ticket of tickets) {
      await jira.addComment(ticket.key, comment)
    }
  } catch (error: any) {
    console.log(error)
    core.setFailed(error.message)
  }
}

void main()
