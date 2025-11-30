export interface Breadcrumb {
  label: string;
  href: string;
}

export function generateBreadcrumbs(
  space?: string,
  postTitle?: string
): Breadcrumb[] {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'Home', href: '/' },
  ];

  if (space) {
    breadcrumbs.push(
      { label: 'Spaces', href: '/spaces' },
      { label: space, href: `/spaces/${space}` }
    );
  }

  if (postTitle) {
    breadcrumbs.push({
      label: postTitle,
      href: '#',
    });
  }

  return breadcrumbs;
}

export function getSpaceTitle(spaceId: string): string {
  const titles: Record<string, string> = {
    ml: 'Machine Learning',
    transformers: 'Transformers',
    web: 'Web Development',
    notes: 'General Notes',
    blog: 'Blog',
  };
  
  return titles[spaceId] || spaceId;
}
