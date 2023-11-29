import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
// import dashToEmdash from './src/remark/dash-to-emdash'; 
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config: Config = {
  title: 'Short Attention',
  tagline: 'A blog about LLMs, AI, and random topics',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://kelk.ai',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'iankelk', // Usually your GitHub org/user name.
  projectName: 'iankelk.github.io', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [
            remarkMath,
            require('./src/remark/dash-to-emdash')
          ],
          rehypePlugins: [rehypeKatex],
        },
        blog: {
          showReadingTime: true,
          readingTime: ({content, defaultReadingTime}) =>
            defaultReadingTime({content, options: {wordsPerMinute: 300}}),
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Short Attention Blog`,
            createFeedItems: async (params) => {
              const {blogPosts, siteConfig, defaultCreateFeedItems, ...rest} = params;
              return defaultCreateFeedItems({
                // Keep only the 10 most recent blog posts in the feed
                blogPosts: blogPosts.filter((item, index) => index < 20),
                siteConfig,
                outDir: rest.outDir,
              });
            },
          },
          remarkPlugins: [
            remarkMath,
            require('./src/remark/dash-to-emdash')
          ],
          rehypePlugins: [rehypeKatex],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-PNHB98RZ0D',
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/short-attention-social-card.jpg',
    navbar: {
      title: 'Projects Page',
      logo: {
        alt: 'Short Attention Logo',
        src: 'img/logo.svg',
      },
      items: [
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'tutorialSidebar',
        //   position: 'left',
        //   label: 'Tutorial',
        // },
        {to: '/blog', label: 'Short Attention Blog', position: 'left'},
        {
          href: 'https://github.com/iankelk',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        // {
        //   title: 'Docs',
        //   items: [
        //     {
        //       label: 'Tutorial',
        //       to: '/docs/intro',
        //     },
        //   ],
        // },
       {
          title: 'Social',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/kelkulus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/iankelk',
            },
          ],
        },
        // New Feeds section
        {
          title: 'Blog Feeds',
          items: [
            {
              label: 'RSS',
              href: 'https://kelk.ai/blog/rss.xml',
            },
            {
              label: 'Atom',
              href: 'https://kelk.ai/blog/atom.xml',
            },
            {
              label: 'JSON',
              href: 'https://kelk.ai/blog/feed.json',
            },
          ],
        },
      ],
      // Existing copyright...
      copyright: `Copyright © ${new Date().getFullYear()} Short Attention Blog`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
