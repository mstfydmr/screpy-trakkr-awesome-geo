const test = require('node:test');
const assert = require('node:assert/strict');
const sync = require('./sync-link-issue.cjs');

const issue = (number, extra = {}) => ({
  number, title: 'Broken links found by weekly link check', body: 'Old report',
  user: { login: 'github-actions[bot]' }, labels: [{ name: 'maintenance' }, { name: 'links' }], ...extra,
});
function fixture(issues) {
  const calls = [];
  return {
    calls,
    github: {
      paginate: async () => issues,
      rest: { issues: {
        listForRepo: () => {},
        update: async args => calls.push(['update', args]),
        create: async args => { calls.push(['create', args]); return { data: { number: 99 } }; },
      } },
    },
  };
}
const args = { repo: { owner: 'owner', repo: 'repo' }, report: 'Link report', runUrl: 'https://github.com/owner/repo/actions/runs/1' };

test('repeated failures update one report and consolidate only owned duplicates', async () => {
  const f = fixture([issue(32), issue(6), issue(100, { user: { login: 'contributor' } }), issue(101, { pull_request: {} }), issue(102, { title: 'Another issue' })]);
  await sync({ ...args, github: f.github, exitCode: '2' });
  assert.equal(f.calls.length, 2);
  assert.equal(f.calls[0][1].issue_number, 6);
  assert.match(f.calls[0][1].body, /Link report/);
  assert.equal(f.calls[1][1].issue_number, 32);
  assert.equal(f.calls[1][1].state, 'closed');
  f.calls.length = 0;
  await sync({ ...args, github: f.github, exitCode: '2' });
  assert.ok(f.calls.every(([method]) => method === 'update'));
});

test('a clean result closes owned reports without touching human issues', async () => {
  const f = fixture([issue(6), issue(7, { user: { login: 'contributor' } })]);
  await sync({ ...args, github: f.github, exitCode: '0' });
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0][1].state_reason, 'completed');
  assert.match(f.calls[0][1].body, /Latest \[link check\]/);
});

test('first failure creates a report; clean run with no report does nothing', async () => {
  const f = fixture([]);
  await sync({ ...args, github: f.github, exitCode: '2' });
  assert.equal(f.calls[0][0], 'create');
  f.calls.length = 0;
  await sync({ ...args, github: f.github, exitCode: '0' });
  assert.equal(f.calls.length, 0);
});

test('missing or infrastructure results cannot close or replace reports', async () => {
  const f = fixture([issue(6)]);
  for (const exitCode of ['', '1', '3', '127']) {
    await assert.rejects(sync({ ...args, github: f.github, exitCode }));
  }
  await assert.rejects(sync({ ...args, github: f.github, exitCode: '0', report: '' }));
  assert.equal(f.calls.length, 0);
});
