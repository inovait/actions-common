import JiraApi from 'jira-client'
import * as fs from 'fs/promises'
import * as YAML from 'yaml'
import * as core from '@actions/core'

interface SearchResponse {
  issues: JiraTicket[]
}

export interface JiraTicket {
  key: string
}

export async function getJiraClient(): Promise<JiraApi> {
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

  const jiraUrl = new URL(baseUrl)

  return new JiraApi({
    protocol: jiraUrl.protocol,
    host: jiraUrl.host,
    port: jiraUrl.port,
    username: email,
    password: token,
    apiVersion: '3'
  })
}

export async function queryJiraTickets(jira: JiraApi): Promise<JiraTicket[]> {
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

  const response: SearchResponse = (await jira.searchJira(jql)) as SearchResponse

  return response.issues
}
