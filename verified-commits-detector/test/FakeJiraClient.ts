import JiraApi from 'jira-client'

export function createFakeJiraClient(
  issueStatuses: Record<string, string>
): JiraApi {
  // Only implemented required methods for tests
  // @ts-expect-error
  return {
    async getIssue(issueIdOrKey: string, fields?: string | string[], expand?: string): Promise<JiraApi.JsonResponse> {
      const status = issueStatuses[issueIdOrKey]

      if (status == null) {
        throw new Error('Issue does not exist or you do not have permission to see it.')
      }

      return {
        key: issueIdOrKey,
        status: {
          name: status
        }
      }
    }
  }
}
