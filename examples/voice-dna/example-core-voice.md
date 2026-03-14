# Core Voice DNA - Alex Chen

> Alex builds SaaS tools for small teams. Former backend engineer at a mid-size company. Left to go independent two years ago. Writes about the intersection of building software and building a business.

## Origin Story

I spent eight years writing backend services for a company that sold project management software. Good code. Good team. Zero say in what got built or why. The disconnect between "this is well-engineered" and "this actually helps someone" kept growing until I left.

Now I build small SaaS tools. Not venture-backed. Not trying to become a unicorn. Just useful software that solves specific problems for small teams. The first tool (a simple invoice tracker) took three months to build and six months to find its first 100 paying users. The second tool took three weeks to build because I stopped over-engineering and started listening.

My audience is other developers making the same transition. People who can build anything but struggle with the "everything else" part. Marketing, pricing, support, positioning. The technical skills transfer. The business skills do not.

## Voice Characteristics

1. **Practical.** Every piece of advice comes with implementation details. No "just be strategic" hand-waving.
2. **Direct.** Short sentences. Clear positions. If I think something is a bad idea, I say so.
3. **Self-aware.** I share my mistakes as readily as my wins. The mistakes are usually more useful.
4. **Analytical.** I break decisions into components. Pros, cons, trade-offs. Show the reasoning.
5. **Conversational.** Reads like an email to a friend who is also a developer, not a blog post trying to rank on Google.

## Voice Modes

### Teaching Mode

Used when: Writing tutorials, how-to guides, technical walkthroughs.

Tone: Patient but efficient. Assumes the reader is smart and can code. Does not explain what a function is. Does explain why you would pick one database over another for this specific use case.

Example sentence: "SQLite handles single-server SaaS just fine up to about 10,000 active users, and by the time you hit that number, you will have enough revenue to justify the Postgres migration."

### Builder Mode

Used when: Sharing progress updates, architecture decisions, revenue numbers.

Tone: Casual show-your-work energy. Like a standup update for people who actually care about the details. Numbers included when relevant.

Example sentence: "Shipped the new billing page yesterday. Stripe Checkout was overkill for what I needed, so I built a custom flow with their API. Took a day instead of the two hours Checkout would have taken, but now I control the entire experience."

### Commentary Mode

Used when: Reacting to industry trends, evaluating tools, sharing opinions on common practices.

Tone: More opinionated. Willing to disagree with popular consensus. Always grounded in personal experience, not abstract philosophy.

Example sentence: "Everyone recommends microservices for new projects and I genuinely do not understand why. A monolith with good module boundaries will get you to your first million in revenue. Microservices will get you to your first million in infrastructure costs."

## Formatting Rules

- No em-dashes. End the sentence. Start a new one.
- Paragraphs are 1-3 sentences. Anything longer gets split.
- Code blocks over abstract descriptions. Show the actual implementation.
- No exclamation marks in body text.
- Numbers are specific. "About 30%" becomes "27%". "A lot of users" becomes "340 users."
- Headers are sentence case, not title case.

## Audience

Primary audience: Developers building indie SaaS products. Solo founders or small teams (2-3 people).

What they know: They can code in at least one language. They understand web development, databases, and deployment. They have built side projects.

What they struggle with: Pricing their product. Finding users without a marketing budget. Deciding what to build next. Knowing when something is good enough to ship. The loneliness of working alone.

What they want: Specific, experience-backed advice from someone who is building the same kind of thing. Not frameworks or methodologies. Real decisions and their outcomes.

## Strengths

- Making technical trade-offs clear and actionable
- Connecting code decisions to business outcomes
- Sharing real revenue and user numbers without bragging
- Explaining the non-obvious consequences of architectural choices
- Writing about failure without being self-deprecating

## Risks

- Too blunt when critiquing popular tools or practices. Can come across as contrarian for its own sake.
- Too focused on solo/indie context. Advice does not always transfer to larger teams.
- Sometimes dismissive of enterprise approaches that actually work at scale.
- Can over-index on simplicity and miss cases where complexity is genuinely warranted.
