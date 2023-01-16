import { Commit } from 'nodegit'

export function createFakeCommit(
  sha: string,
  message: string,
  isoDate: string,
  description: string = ''
): Commit {
  // Only implement required methods
  // @ts-expect-error
  return {
    sha(): string {
      return sha
    },
    message(): string {
      return message
    },
    body(): string {
      return description
    },
    date(): Date {
      return new Date(Date.parse(isoDate))
    }

  }
}
