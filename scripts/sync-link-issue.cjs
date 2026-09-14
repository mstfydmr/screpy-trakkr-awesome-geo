// Only called by the trusted main-branch link-check workflow, never PR code.
const TITLE = 'Broken links found by weekly link check';
const MARKER = '<!-- awesome-geo-link-check -->';

module.exports = async function syncLinkIssue({ github, repo, exitCode, report, runUrl }) {
  // Lychee uses 2 for link failures; other errors must not resolve real reports.
  if (!['0', '2'].includes(String(exitCode)) || !report.trim()) {
    throw new Error('No valid link-check result; existing issues were left unchanged.');
  }
  const issues = await github.paginate(github.rest.issues.listForRepo, {
    ...repo, state: 'open', per_page: 100,
  });
  const owned = issues.filter(issue => !issue.pull_request
    && issue.user?.login === 'github-actions[bot]'
    && issue.title === TITLE
    && (issue.body?.includes(MARKER)
      || ['maintenance', 'links'].every(name => issue.labels?.some(label => label.name === name))))
    .sort((a, b) => a.number - b.number);

  if (String(exitCode) === '0') {
    for (const issue of owned) {
      await github.rest.issues.update({
        ...repo, issue_number: issue.number, state: 'closed', state_reason: 'completed',
        body: `${MARKER}\n\nLatest [link check](${runUrl}) passed. Previous report:\n\n${issue.body || ''}`.slice(0, 60000),
      });
    }
    return;
  }

  const body = `${MARKER}\n\nLatest [link check](${runUrl}). This report is updated in place; bot-blocking responses still need human judgment.\n\n${report}`.slice(0, 60000);
  let primary = owned[0];
  if (primary) {
    await github.rest.issues.update({ ...repo, issue_number: primary.number, body });
  } else {
    const result = await github.rest.issues.create({ ...repo, title: TITLE, body, labels: ['maintenance', 'links'] });
    primary = result.data;
  }
  for (const duplicate of owned.slice(1)) {
    await github.rest.issues.update({
      ...repo, issue_number: duplicate.number, state: 'closed', state_reason: 'not_planned',
      body: `${duplicate.body || ''}\n\nConsolidated into #${primary.number}; follow that issue for the current report.`.slice(0, 60000),
    });
  }
};
