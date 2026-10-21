import activity from '../../scripts/github-snapshot.json';

const profile = 'https://github.com/VISHNU07202003';
export default function GithubActivity() {
  const snapshotDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  }).format(new Date(activity.fetchedAt));
  return <section id="github" className="github-section frame section-space" aria-labelledby="github-title">
    <div className="section-heading"><span className="eyebrow">Beyond selected work</span><a href={profile} className="github-profile" rel="noreferrer">@VISHNU07202003 ↗</a></div>
    <div className="github-heading"><h2 id="github-title">Still building<span className="accent-dot">.</span></h2><span className="github-snapshot-label">GitHub at a glance</span></div>
    <div className="github-stats">
      <div><span className="github-number">{activity.repositories}</span><h3>Public repositories</h3><p>New and established work.<br/>Includes forks and archived repositories.</p></div>
      <div><span className="github-number">{activity.commits}</span><h3>Indexed public commits</h3><p>Authored by my GitHub account.<br/>Public default-branch history indexed by GitHub.</p></div>
    </div>
    <p className="github-note">Snapshot as of <time dateTime={activity.fetchedAt}>{snapshotDate}</time>. Updated manually; these figures are not live. Private work and unindexed commits are excluded.</p>
  </section>;
}
