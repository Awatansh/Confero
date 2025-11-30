import rss from '@astrojs/rss';
import { getAllPosts } from '../utils/contentHelpers';

export async function GET(context) {
  const posts = await getAllPosts();

  return rss({
    title: 'Confero - Multi-Space Blog',
    description: 'Explore knowledge across multiple disciplines through interconnected spaces.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/posts/${post.slug}`,
    })),
    customData: `<language>en-us</language>`,
  });
}
