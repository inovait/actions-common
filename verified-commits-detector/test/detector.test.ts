import { test } from '@jest/globals'
import { createFakeCommit } from './TestCommit'
import { getLastCommitToMerge } from '../src/detector'
import { createFakeJiraClient } from './FakeJiraClient'

test('detect first verified ticket', async() => {
  const commits =
    [
      createFakeCommit(
        'abd0ae703769b889814fc1c896b55e96a1e9dbce',
        'feat: resolve 77',
        '2018-11-20T08:29:38+01:00',
        'resolves ABC-77'
      ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        'feat: resolve 76',
        '2018-11-20T07:57:01+01:00',
        'resolves ABC-76'
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'fix: resolve 75',
        '2018-11-20T07:48:42+01:00',
        'resolves ABC-75'
      )
    ]

  const tickets: Record<string, string> = {
    'ABC-77': 'In Progress',
    'ABC-76': 'Selected for Development',
    'ABC-75': 'Verified'
  }

  expect(await getLastCommitToMerge(commits, createFakeJiraClient(tickets))).toEqual('962b3eb5cd9c6c9673ab2d818a560fe1a18765bb')
})

test('detect several verified ticket', async() => {
  const commits =
    [
      createFakeCommit(
        'abd0ae703769b889814fc1c896b55e96a1e9dbce',
        'feat: resolve 77',
        '2018-11-20T08:29:38+01:00',
        'resolves ABC-77'
      ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        'feat: resolve 76',
        '2018-11-20T07:57:01+01:00',
        'resolves ABC-76'
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'fix: resolve 75',
        '2018-11-20T07:48:42+01:00',
        'resolves ABC-75'
      )
    ]

  const tickets: Record<string, string> = {
    'ABC-77': 'In Progress',
    'ABC-76': 'Verified',
    'ABC-75': 'Verified'
  }

  expect(await getLastCommitToMerge(commits, createFakeJiraClient(tickets))).toEqual('fa5e0250f59bf5c8acdab7ae5e8070459a321a1d')
})

test('return null when there is nothing to merge', async() => {
  const commits =
    [
      createFakeCommit(
        'abd0ae703769b889814fc1c896b55e96a1e9dbce',
        'feat: resolve 77',
        '2018-11-20T08:29:38+01:00',
        'resolves ABC-77'
      ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        'feat: resolve 76',
        '2018-11-20T07:57:01+01:00',
        'resolves ABC-76'
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'fix: resolve 75',
        '2018-11-20T07:48:42+01:00',
        'resolves ABC-75'
      )
    ]

  const tickets: Record<string, string> = {
    'ABC-77': 'In Progress',
    'ABC-76': 'In Progress',
    'ABC-75': 'In Review'
  }

  expect(await getLastCommitToMerge(commits, createFakeJiraClient(tickets))).toEqual(null)
})

test('ignore unknown tickets', async() => {
  const commits =
    [
      createFakeCommit(
        'abd0ae703769b889814fc1c896b55e96a1e9dbce',
        'feat: resolve 77',
        '2018-11-20T08:29:38+01:00',
        'resolves ABC-77'
      ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        'feat: resolve 76',
        '2018-11-20T07:57:01+01:00',
        'resolves ABC-76'
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'fix: resolve 75',
        '2018-11-20T07:48:42+01:00',
        'resolves ABC-75'
      )
    ]

  const tickets: Record<string, string> = {
    'ABC-77': 'In Progress',
    'ABC-76': 'Verified'
  }

  expect(await getLastCommitToMerge(commits, createFakeJiraClient(tickets))).toEqual('fa5e0250f59bf5c8acdab7ae5e8070459a321a1d')
})

test('ignore commits without tickets', async() => {
  const commits =
    [
      createFakeCommit(
        'abd0ae703769b889814fc1c896b55e96a1e9dbce',
        'feat: resolve 77',
        '2018-11-20T08:29:38+01:00',
        'resolves ABC-77'
      ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        'feat: resolve 76',
        '2018-11-20T07:57:01+01:00',
        'resolves ABC-76'
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'refactor: remove dead code',
        '2018-11-20T07:48:42+01:00'
      )
    ]

  const tickets: Record<string, string> = {
    'ABC-77': 'In Progress',
    'ABC-76': 'Verified'
  }

  expect(await getLastCommitToMerge(commits, createFakeJiraClient(tickets))).toEqual('fa5e0250f59bf5c8acdab7ae5e8070459a321a1d')
})

test('ignore non-resolved tickets', async() => {
  const commits =
    [
      createFakeCommit(
        'abd0ae703769b889814fc1c896b55e96a1e9dbce',
        'feat: resolve 77',
        '2018-11-20T08:29:38+01:00',
        'resolves ABC-77'
      ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        'feat: resolve 76',
        '2018-11-20T07:57:01+01:00',
        'resolves ABC-76'
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'fix: resolve 75',
        '2018-11-20T07:48:42+01:00',
        'ABC-75'
      )
    ]

  const tickets: Record<string, string> = {
    'ABC-77': 'In Progress',
    'ABC-76': 'Verified'
  }

  expect(await getLastCommitToMerge(commits, createFakeJiraClient(tickets))).toEqual('fa5e0250f59bf5c8acdab7ae5e8070459a321a1d')
})

test('ignore commits from specific ticket when hide commit hides them', async() => {
  const commits =
    [
      createFakeCommit(
        '6389e2590099338e67c0320c95585dc9f336ed4b',
        'feat: feature 78',
        '2018-11-20T08:30:38+01:00',
        'resolves ABC-78'
      ),
      createFakeCommit(
        '28887c19d9055e570a170e08f2738c07f040c167',
        'feat: move 77 to feature flag',
        '2018-11-20T08:29:38+01:00',
        'hide ABC-77'
      ),
      createFakeCommit(
        'abd0ae703769b889814fc1c896b55e96a1e9dbce',
        'feat: resolve 77',
        '2018-11-20T08:29:38+01:00',
        'resolves ABC-77'
      ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        'feat: resolve 76',
        '2018-11-20T07:57:01+01:00',
        'resolves ABC-76'
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'fix: resolve 75',
        '2018-11-20T07:48:42+01:00',
        'resolves ABC-75'
      )
    ]

  const tickets: Record<string, string> = {
    'ABC-78': 'In Review',
    'ABC-77': 'In Progress',
    'ABC-76': 'Verified',
    'ABC-75': 'Verified'
  }

  expect(await getLastCommitToMerge(commits, createFakeJiraClient(tickets))).toEqual('28887c19d9055e570a170e08f2738c07f040c167')
})

test('hide commit should not affect unrelated tickets', async() => {
  const commits =
    [
      createFakeCommit(
        '6389e2590099338e67c0320c95585dc9f336ed4b',
        'feat: feature 78',
        '2018-11-20T08:30:38+01:00',
        'resolves ABC-78'
      ),
      createFakeCommit(
        '28887c19d9055e570a170e08f2738c07f040c167',
        'feat: move 77 to feature flag',
        '2018-11-20T08:29:38+01:00',
        'hide ABC-77'
      ),
      createFakeCommit(
        'abd0ae703769b889814fc1c896b55e96a1e9dbce',
        'feat: resolve 77',
        '2018-11-20T08:29:38+01:00',
        'resolves ABC-77'
      ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        'feat: resolve 76',
        '2018-11-20T07:57:01+01:00',
        'resolves ABC-76'
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'fix: resolve 75',
        '2018-11-20T07:48:42+01:00',
        'resolves ABC-75'
      )
    ]

  const tickets: Record<string, string> = {
    'ABC-78': 'In Review',
    'ABC-77': 'In Progress',
    'ABC-76': 'In Review',
    'ABC-75': 'Verified'
  }

  expect(await getLastCommitToMerge(commits, createFakeJiraClient(tickets))).toEqual('962b3eb5cd9c6c9673ab2d818a560fe1a18765bb')
})

test('only hide older commits', async() => {
  const commits =
    [
      createFakeCommit(
        '6389e2590099338e67c0320c95585dc9f336ed4b',
        'feat: feature 77',
        '2018-11-20T08:30:38+01:00',
        'resolves ABC-77'
      ),
      createFakeCommit(
        '28887c19d9055e570a170e08f2738c07f040c167',
        'feat: move 77 to feature flag',
        '2018-11-20T08:29:38+01:00',
        'hide ABC-77'
      ),
      createFakeCommit(
        'abd0ae703769b889814fc1c896b55e96a1e9dbce',
        'feat: resolve 77',
        '2018-11-20T08:29:38+01:00',
        'resolves ABC-77'
      ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        'feat: resolve 76',
        '2018-11-20T07:57:01+01:00',
        'resolves ABC-76'
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'fix: resolve 75',
        '2018-11-20T07:48:42+01:00',
        'resolves ABC-75'
      )
    ]

  const tickets: Record<string, string> = {
    'ABC-78': 'In Review',
    'ABC-77': 'In Progress',
    'ABC-76': 'Verified',
    'ABC-75': 'Verified'
  }

  expect(await getLastCommitToMerge(commits, createFakeJiraClient(tickets))).toEqual('28887c19d9055e570a170e08f2738c07f040c167')
})

test('treat non-resolved commits as resolved as soon as there is resolved ticket available', async() => {
  const commits =
    [
      createFakeCommit(
        'abd0ae703769b889814fc1c896b55e96a1e9dbce',
        'feat: resolve 77',
        '2018-11-20T08:29:38+01:00',
        'resolves ABC-77'
      ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        'feat: resolve 76',
        '2018-11-20T07:57:01+01:00',
        'resolves ABC-76'
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'fix: resolve 75',
        '2018-11-20T07:48:42+01:00',
        'resolves ABC-75'
      )
    ]

  const tickets: Record<string, string> = {
    'ABC-77': 'In Progress',
    'ABC-76': 'Verified',
    'ABC-75': 'Verified'
  }

  expect(await getLastCommitToMerge(commits, createFakeJiraClient(tickets))).toEqual('fa5e0250f59bf5c8acdab7ae5e8070459a321a1d')
})
