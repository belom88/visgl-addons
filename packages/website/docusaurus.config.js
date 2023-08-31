// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Vehicle Layer',
  tagline: 'Mapping everything',
  url: 'https://some-url.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'belom88', // Usually your GitHub org/user name.
  projectName: 'vehicle-layer', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/belom88/visgl-addons',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/belom88/visgl-addons',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Vehicle Layer',
        logo: {
          alt: 'Vehicle Layer Logo',
          src: 'img/logo.webp',
        },
        items: [
          {
            type: 'doc',
            docId: 'get-started',
            position: 'left',
            label: 'Tutorial',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/belom88/visgl-addons',
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
                label: 'Tutorial',
                to: '/docs/get-started',
              },
            ],
          },
          {
            title: 'Contacts',
            items: [
              {
                label: 'Linkedin',
                href: 'https://www.linkedin.com/in/belom88',
              },
              {
                html: 'viktor.o.belomestnov@gmail.com',
              }
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
                href: 'https://github.com/belom88/visgl-addons',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Viktor Belomestnov, Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
