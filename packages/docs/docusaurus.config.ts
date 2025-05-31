import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Unified Exagonal Platform',
  tagline: 'Unified API for Express, Fastify, and More - One Definition, Cross Platform and Runtime',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'albasyir', // Usually your GitHub org/user name.
  projectName: 'platform-manager', // Usually your repo name.

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
          editUrl:
            'https://github.com/albasyir/platform-manager/tree/main/packages/docs/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'UEP',
      logo: {
        alt: 'UEP Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/albasyir/platform-manager',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Documentation',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/albasyir/platform-manager',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Albasyir Group. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    // Enhanced homepage configuration
    announcementBar: {
      id: 'support_us',
      content: '⭐️ If you like UEP, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/albasyir/platform-manager">GitHub</a>! ⭐️',
      backgroundColor: '#fafbfc',
      textColor: '#091E42',
      isCloseable: true,
    },
    metadata: [
      {
        name: 'keywords',
        content: 'http server, express, fastify, typescript, nodejs, api, microservices, websocket',
      },
    ],
    // Hero section
    hero: {
      title: 'UEP',
      tagline: 'Unified API for Express, Fastify, and More - One Router, Cross Platform',
      image: 'img/hero-image.png',
      alt: 'UEP Hero Image',
    },
    // Features section
    features: [
      {
        title: 'Unified API',
        description: 'Write your routes once and run them on any supported platform. Switch between Express and Fastify without changing your code.',
        icon: '🔄',
      },
      {
        title: 'TypeScript First',
        description: 'Built with TypeScript from the ground up, providing excellent type safety and developer experience.',
        icon: '📦',
      },
      {
        title: 'Simple & Intuitive',
        description: 'Clean and consistent API that makes it easy to build and maintain your applications.',
        icon: '✨',
      },
      {
        title: 'Extensible',
        description: 'Easy to extend with new platforms and features. Add support for your favorite HTTP server.',
        icon: '🔌',
      },
    ],
    // Call to action
    cta: {
      title: 'Ready to Get Started?',
      description: 'Start building your next application with UEP today.',
      buttonText: 'Get Started',
      buttonLink: '/docs/intro',
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
