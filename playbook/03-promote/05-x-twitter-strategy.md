# 05 - X/Twitter Strategy

X rewards compression. Say more with fewer words. Every character has to earn its place.

---

## The Platform Dynamic

X is the fastest-moving text platform. Posts have a half-life of 30-90 minutes. Threads get distributed tweet-by-tweet into different people's feeds. The algorithm rewards replies, quote tweets, and engagement velocity.

For builders, X offers something LinkedIn and Reddit cannot: real-time community. When a new framework drops, the conversation happens on X first. When someone ships a side project, the feedback loop is measured in minutes. The builder community on X is small, opinionated, and highly engaged.

The trade-off: X is noisy. Standing out requires sharper writing and a more compressed voice than any other platform. If LinkedIn is a conversation, X is a headline.

## Single Posts vs. Threads

You have two primary formats. Use them for different purposes.

### Single Posts

Best for: observations, hot takes, compressed insights, memes, reactions.

A good single post is self-contained. The reader gets the full idea in one screen. No clicking "show more." No scrolling.

**Example single posts:**

> shipped a feature in 45 minutes that a previous team spent 3 sprints planning.
>
> the difference was not skill. it was that nobody had to approve a Jira ticket first.

> the best developer documentation I have ever read had zero screenshots.
>
> just code blocks, expected outputs, and a troubleshooting section.

> stopped optimizing my site for Google.
> started optimizing it for the person who actually lands on it.
> traffic went down 10%. conversions went up 40%.

**Notice:** each of these makes a single point, gives a specific detail, and ends. No hashtags. No "thoughts?" No CTA.

### Threads

Best for: walkthroughs, project breakdowns, detailed how-tos, stories with multiple beats.

**Thread rules:**

1. **The hook tweet must stand alone.** If someone only sees tweet 1, they should get value from it. The thread is a bonus, not a requirement.
2. **Each tweet in the thread should also stand alone.** The algorithm distributes individual tweets from threads into people's feeds. If tweet 4 makes no sense without tweets 1-3, it dies in isolation.
3. **Number your tweets.** "1/7" in the first tweet tells people it is a thread and how long it is.
4. **Keep threads to 5-8 tweets.** Longer threads lose readers. If you need more than 8, it should be a blog post.
5. **End with a summary or takeaway.** The last tweet should close the loop, not trail off.

**Example thread:**

> 1/5 built my personal site in a weekend. $0/month to run. here is the exact stack and what each piece does.

> 2/5 Next.js 15 for the framework. static export, no server needed. Cloudflare Pages for hosting. free tier covers everything a personal site needs. total build time: ~40 seconds.

> 3/5 blog posts are markdown files in a /content folder. no CMS, no database, no admin panel. I write in VS Code and push to git. new post = new file = automatic deploy.

> 4/5 SEO is handled by a sitemap generator and structured metadata. took about an hour to set up. now every page has proper OG tags, canonical URLs, and JSON-LD. Google started indexing within a week.

> 5/5 the whole thing is open source. the real lesson: you do not need a $50/month stack to have a professional web presence. a free stack with good content beats an expensive stack with none.

## Character Awareness

X has a 280-character limit per tweet (or 25,000 for long-form posts, but those perform differently). The constraint is the feature.

**The principle:** a 140-character post that lands is worth more than a 280-character post that rambles.

Compression forces clarity. If you cannot say it in 280 characters, you probably do not understand it well enough.

**Compression techniques:**

- Cut setup. Jump straight to the insight.
- Remove qualifiers. "I think" and "in my opinion" and "arguably" waste characters and weaken the point.
- Use periods instead of conjunctions. "I tried X. It failed. I tried Y. It worked." is tighter than "I tried X but it failed, so then I tried Y and it worked."
- Let the reader infer context. You do not need to explain the industry or define terms. Your followers already know.

**Before compression (312 characters):**
> I've been thinking about this a lot lately, and I think that the best way to grow your personal brand online is to focus on consistently publishing valuable content on your own website rather than spending all your time on social media platforms.

**After compression (148 characters):**
> build on your website first. social platforms are distribution channels, not home base. the content you own is the content that compounds.

Same idea. Half the characters. Twice the impact.

## Cross-Posting From LinkedIn

Your LinkedIn posts can become X content, but not through copy-paste. The formats are fundamentally different.

**The conversion process:**

1. Take your LinkedIn post.
2. Identify the single sharpest point.
3. Compress it into 1-2 tweets.
4. If the post has enough depth for a thread, break it into 5-7 standalone tweets.

**LinkedIn post (850 characters):**
> spent two hours this morning fixing a bug that turned out to be a single missing comma. the error message pointed to the database layer. the logs pointed to the API. the actual problem was in a JSON config file I had not touched in 3 months. lesson: when nothing makes sense, check the files you have not changed.

**X single post (180 characters):**
> spent 2 hours debugging. error logs pointed everywhere except the actual problem. it was a missing comma in a config file I had not touched in 3 months. check the unchanged files.

**Timing:** post on LinkedIn first. Wait 1-2 days. Post the X version. This gives each platform a fresh window and avoids your cross-platform followers seeing the same thing twice on the same day.

## Tone Differences From LinkedIn

X is more compressed, more casual, and less structured than LinkedIn.

| | LinkedIn | X |
|---|---|---|
| Paragraph length | 1-2 sentences | 1 sentence or a short phrase |
| Emoji usage | Occasional, subtle | Less than LinkedIn. Rarely. Let the words work. |
| Formatting | Whitespace-heavy, vertical | Flat, dense, punchy |
| CTAs | "Link in comments" | "Link in bio" or none |
| Tone | Professional-casual | Casual-sharp |
| Self-reference | "We did X on our project" | "did X. it worked." |

## Profile Does the Brand Work

On X, your profile bio and pinned tweet do the heavy lifting that a CTA would do on other platforms.

**Bio checklist:**
- What you do (in 5 words or fewer)
- One proof point or notable project
- Link to your website

**Example bios:**

> building tools for GTM teams. shipped [project name]. everything at [yoursite.com]

> frontend dev. writing about web performance. blog: [yoursite.com]

> solo founder. building in public. site: [yoursite.com]

**Pinned tweet:** Your best-performing tweet or a thread that showcases your work. This is the first thing someone sees when they click your profile. Make it representative.

Do not put your pitch in every tweet. Put it in your profile. Let the tweets be the content that makes people curious enough to click your profile.

## The Reply Game

On X, replies are content. A great reply on a popular tweet can get more visibility than your own posts.

**How to play the reply game:**

1. Follow 10-20 accounts in your niche who post regularly and get engagement.
2. Turn on notifications for 3-5 of them.
3. When they post, reply within the first 15-30 minutes (early replies get the most visibility).
4. Add something. A specific example, a counterpoint, a relevant experience. Not "great point" or a fire emoji.

**Example:**

Someone posts: "just migrated from Vercel to Cloudflare Pages. faster, cheaper, fewer surprises."

**Bad reply:** "nice, been thinking about doing the same"

**Good reply:** "did this migration last month. the build step was smooth but watch out for the preview deployment differences. SSR behaves differently in their worker runtime vs Vercel's edge functions."

The good reply demonstrates expertise, adds value for everyone reading the thread, and makes people want to click your profile.

## What Not to Do

### Hashtag Spam
> #webdev #coding #buildinpublic #seo #nextjs #frontend #developer

Hashtags on X are mostly dead. One or two relevant ones occasionally is fine. A wall of them looks desperate and clutters the post.

### Engagement Bait
> "Like if you agree. RT if you have experienced this."

This worked in 2019. It looks transparent now and the algorithm deprioritizes it.

### Quote Tweeting Yourself
Retweeting your own post to push it back into feeds. Once is fine if you are adding context. Doing it repeatedly looks like you are gaming your own timeline.

### Thread Teasers Without Payoff
> "I just discovered something that changed how I think about web development forever. Thread."

If the thread does not deliver on the promise, you lose followers. And it usually does not deliver.

## Posting Cadence

**Single posts:** 1-2 per day maximum. Quality over quantity.

**Threads:** 1-2 per week maximum. Threads take more effort to read, so space them out.

**Replies:** 3-5 per day. This is where most of your growth comes from.

**Best times:** Weekday mornings (8-10am EST) and early evenings (5-7pm EST). Builder X is most active during US business hours with a second wave for European evenings.

## The Long Game

X growth is slower than LinkedIn for most builders. Expect 4-8 weeks before your posts consistently get more than a few likes. The reply game accelerates this. Being consistently present in popular threads builds name recognition faster than posting into the void.

The compounding effect on X comes from relationships, not content. The people who reply to your posts, quote tweet your threads, and engage with your ideas become your distribution network. Invest in those relationships.

---

Next: [06 - Google-Reddit SEO](./06-google-reddit-seo.md)
