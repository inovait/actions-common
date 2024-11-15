import { test } from '@jest/globals'
import { createFakeCommit } from './TestCommit'
import { getJiraTickets } from '../src/detector'

test('detect all jira tickets from commits', () => {
  const commits =
    [
      createFakeCommit(
        'abd0ae703769b889814fc1c896b55e96a1e9dbce',
        'fix: lock OnDemandProvider into mutex',
        '2018-11-20T08:29:38+01:00'
      ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        '[ABC-70] test(retrofit): add JUnit dependency',
        '2018-11-20T07:57:01+01:00'
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'fix: use SupervisorJob on ViewModel',
        '2018-11-20T07:48:42+01:00',
        'ABC-71'
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c0140c',
        'feat: make LiveData observing utils inline',
        '2018-11-07T07:48:01+01:00',
        'This fixes ABC-72'
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c0140c',
        'feat: feature 73',
        '2018-11-07T07:48:01+01:00',
        'fix ABC-73'
      ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a351a1d',
        '[ABC-B70] test(retrofit): add JUnit dependency',
        '2018-11-20T07:57:01+01:00'
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c2140c',
        'feat: feature 74',
        '2018-11-07T07:48:01+01:00',
        'fix ABC-D73'
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c21403',
        'SPAAT-1542: Ticket title\n\nJIRA: https://inovait.atlassian.net/browse/SPAAT-1542\nTicket description',
        '2018-11-07T07:48:01+01:00'
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c21403',
        '[SPAAT-1537] Ticket title',
        '2018-11-07T07:48:01+01:00'
      )
    ]

  expect(getJiraTickets(commits)).toEqual(['ABC-70', 'ABC-71', 'ABC-72', 'ABC-73', 'SPAAT-1542', 'SPAAT-1537'])
})

test('detect only jira tickets that have been resolved from commits', () => {
  const commits =
    [
      createFakeCommit(
        'abd0ae703769b889814fc1c896b55e96a1e9dbce',
        'fix: lock OnDemandProvider into mutex',
        '2018-11-20T08:29:38+01:00'
      ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        '[ABC-70] test(retrofit): add JUnit dependency',
        '2018-11-20T07:57:01+01:00'
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'fix: use SupervisorJob on ViewModel',
        '2018-11-20T07:48:42+01:00',
        'ABC-71'
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c0140c',
        'feat: feature 72',
        '2018-11-07T07:48:01+01:00',
        'This fixes ABC-72'
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c0140c',
        'feat: feature 73',
        '2018-11-07T07:48:01+01:00',
        'fix ABC-73'
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c0140c',
        'feat: feature 73',
        '2018-11-07T07:48:01+01:00',
        'resolved ABC-74'
      )
    ]

  expect(getJiraTickets(commits, true)).toEqual(['ABC-72', 'ABC-73', 'ABC-74'])
})

test('detect all github tickets from commits', () => {
  const commits =
    [
      createFakeCommit(
        'abd0ae703769b889814fc1c896b55e96a1e9dbce',
        'fix: lock OnDemandProvider into mutex',
        '2018-11-20T08:29:38+01:00'
      ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
        '[#7] test(retrofit): add JUnit dependency',
        '2018-11-20T07:57:01+01:00'
      ),
      createFakeCommit(
        '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
        'fix: use SupervisorJob on ViewModel',
        '2018-11-20T07:48:42+01:00',
        '#12'
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c0140c',
        'feat: make LiveData observing utils inline',
        '2018-11-07T07:48:01+01:00',
        'This fixes #33'
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c0140c',
        'feat: feature 73',
        '2018-11-07T07:48:01+01:00',
        'fix #34'
      ),
      createFakeCommit(
        'fa5e0250f59bf5c8acdab7ae5e8070459a351a1d',
        '[35] test(retrofit): add JUnit dependency',
        '2018-11-20T07:57:01+01:00'
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c2140c',
        'feat: feature 74',
        '2018-11-07T07:48:01+01:00',
        'fix #66'
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c21403',
        '#77: Ticket title\nTicket description',
        '2018-11-07T07:48:01+01:00'
      ),
      createFakeCommit(
        '340762ccc0ac26ab71c0579ac1f2a61211c21403',
        '[#88] Ticket title',
        '2018-11-07T07:48:01+01:00'
      )
    ]

  expect(getJiraTickets(commits)).toEqual(['7', '12', '33', '34', '66', '77', '88'])
})

test('detect only github tickets that have been resolved from commits', () => {
  const commits =
        [
          createFakeCommit(
            'abd0ae703769b889814fc1c896b55e96a1e9dbce',
            'fix: lock OnDemandProvider into mutex',
            '2018-11-20T08:29:38+01:00'
          ),
          createFakeCommit(
            'fa5e0250f59bf5c8acdab7ae5e8070459a321a1d',
            '[#7] test(retrofit): add JUnit dependency',
            '2018-11-20T07:57:01+01:00'
          ),
          createFakeCommit(
            '962b3eb5cd9c6c9673ab2d818a560fe1a18765bb',
            'fix: use SupervisorJob on ViewModel',
            '2018-11-20T07:48:42+01:00',
            '#12'
          ),
          createFakeCommit(
            '340762ccc0ac26ab71c0579ac1f2a61211c0140c',
            'feat: make LiveData observing utils inline',
            '2018-11-07T07:48:01+01:00',
            'This fixes #33'
          ),
          createFakeCommit(
            '340762ccc0ac26ab71c0579ac1f2a61211c0140c',
            'feat: feature 73',
            '2018-11-07T07:48:01+01:00',
            'fix #34'
          ),
          createFakeCommit(
            'fa5e0250f59bf5c8acdab7ae5e8070459a351a1d',
            '[35] test(retrofit): add JUnit dependency',
            '2018-11-20T07:57:01+01:00'
          ),
          createFakeCommit(
            '340762ccc0ac26ab71c0579ac1f2a61211c2140c',
            'feat: feature 74',
            '2018-11-07T07:48:01+01:00',
            'fix #66'
          ),
          createFakeCommit(
            '340762ccc0ac26ab71c0579ac1f2a61211c21403',
            '#77: Ticket title\n\nJIRA: https://inovait.atlassian.net/browse/SPAAT-1542\nTicket description',
            '2018-11-07T07:48:01+01:00'
          ),
          createFakeCommit(
            '340762ccc0ac26ab71c0579ac1f2a61211c21403',
            '[#88] Ticket title',
            '2018-11-07T07:48:01+01:00'
          ),
          createFakeCommit(
            '340762ccc0ac26ab71c0579ac1f2a61211c0140c',
            'feat: feature 73',
            '2018-11-07T07:48:01+01:00',
            'resolved #5'
          )
        ]

  expect(getJiraTickets(commits, true)).toEqual(['33', '34', '66', '5'])
})
