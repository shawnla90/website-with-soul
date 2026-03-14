/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://yoursite.com',
  generateRobotsTxt: true,
  outDir: './public',
  transform: async (config, path) => {
    const highPriority = ['/', '/about']
    const mediumPriority = ['/blog']

    let priority = 0.5
    let changefreq = 'weekly'

    if (highPriority.includes(path)) {
      priority = 1.0
      changefreq = 'daily'
    } else if (mediumPriority.includes(path) || path.startsWith('/blog/')) {
      priority = 0.8
      changefreq = 'weekly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      // AI crawler allowlist - let them index your content
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
    ],
  },
}
