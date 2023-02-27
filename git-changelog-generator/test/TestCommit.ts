import { Commit } from 'nodegit'

export function createFakeCommit(
  sha: string,
  summary: string,
  isoDate: string,
  description: string = '',
  parentCount: number = 1
): Commit {
  // Only implement required methods
  // @ts-expect-error
  return {
    sha(): string {
      return sha
    },
    summary(): string {
      return summary
    },
    body(): string {
      return description
    },
    date(): Date {
      return new Date(Date.parse(isoDate))
    },
    parentcount(): number {
      return parentCount
    }
  }
}
