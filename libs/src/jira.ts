import * as fs from 'fs/promises'
import * as YAML from 'yaml'
import * as core from '@actions/core'
import { Version3Client } from 'jira.js'
import { SearchForIssuesUsingJqlEnhancedSearch } from 'jira.js/out/version3/parameters'

export interface JiraTicket {
  key: string
  fields: TicketFields
}

export interface TicketFields {
  status: Field
  issuetype: Field
}

export interface Field {
  id: string
  name: string
}

export async function getJiraClient(): Promise<Version3Client> {
  const configPath = `${process.env.HOME ?? ''}/jira/config.yml`

  try {
    await fs.access(configPath)
  } catch (e) {
    throw Error('Invalid jira config. Did you execute gajira-login action first?')
  }

  const configString = await fs.readFile(configPath, 'utf8')
  const config = YAML.parse(configString)

  const baseUrl: string | undefined = config.baseUrl
  const token: string | undefined = config.token
  const email: string | undefined = config.email

  if (baseUrl == null || token == null || email == null) {
    throw Error('Invalid jira config. Did you execute gajira-login action first?')
  }

  return new Version3Client({
    host: baseUrl,
    authentication: {
      basic: {
        email,
        apiToken: token
      }
    }
  })
}

export async function queryJiraTickets(jira: Version3Client): Promise<JiraTicket[]> {
  const ticketsRaw: string = core.getInput('tickets') ?? ''
  const inputJql: string = core.getInput('jql')?.trim() ?? ''

  let jql: string
  if (inputJql.length !== 0) {
    jql = inputJql
  } else {
    const ticketKeys = ticketsRaw.trim()
      .split(',')
      .map((ticket) => ticket.trim())
      .filter((ticket) => ticket.length > 0)

    if (ticketKeys.length === 0) {
      core.info('No tickets provided. Skipping...')
      return []
    }

    jql = `key in (${ticketKeys.join(',')})`
  }

  const tickets: JiraTicket[] = []
  const parameters: SearchForIssuesUsingJqlEnhancedSearch = {
    jql,
    failFast: false,
    fields: ['status', 'issuetype']
  }

  do {
    const response = await jira.issueSearch.searchForIssuesUsingJqlEnhancedSearch(parameters)

    const issues = (response.issues ?? []).map((it) => it as JiraTicket)
    tickets.push(...issues)
    if (response.nextPageToken == null) {
      break
    }
    parameters.nextPageToken = response.nextPageToken
  } while (true)

  return tickets
}
