// The build replaces %BASE_URL% in app/index.html; local development uses /.
export function siteBase() {
  const base = typeof document === 'undefined' ? '/' : document.querySelector('meta[name="portfolio-base"]')?.getAttribute('content') || '/';
  return `/${base.split('/').filter(Boolean).join('/')}${base === '/' ? '' : '/'}`;
}
export function siteHref(href: string) {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  return siteBase() + href.slice(1);
}
export function sitePath(pathname: string) {
  const base = siteBase();
  const path = pathname === base.slice(0, -1) ? '/' : pathname.startsWith(base) ? '/' + pathname.slice(base.length) : pathname;
  return path.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
}

export function caseStudyReturn(id: string, featured: boolean, source: string | null) {
  if (source === 'work') return { href: `/work/#${id}`, label: '← Work gallery' };
  return featured ? { href: '/#work', label: '← Selected work' } : { href: '/#experience', label: '← Experience' };
}
