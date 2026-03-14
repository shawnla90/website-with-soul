# Chapter 3: Cron Automation

> Schedule scripts to run without you. SEO scans at midnight. Content index rebuilds at dawn. Deploys after lunch. This chapter covers launchd (macOS) and systemd (Linux) patterns for automated tasks.

## Why Scheduled Tasks Matter

Manual processes do not scale. If you have to remember to run the SEO keyword scan, rebuild the content index, or sync your blog cache, you will forget. Automated schedules turn sporadic maintenance into reliable infrastructure.

Good candidates for automation:

- **Nightly SEO scans.** Check keyword rankings, discover new opportunities.
- **Content index rebuilds.** Regenerate blog metadata, sitemap, RSS feed.
- **Cache syncing.** Pull fresh data from external APIs (Reddit, analytics, search console).
- **Draft generation.** Create blog post drafts from SEO briefs overnight.
- **Scheduled deploys.** Rebuild and deploy the site at a fixed time daily.
- **Log rotation.** Clean up old log files before they fill the disk.

## macOS: launchd

macOS uses launchd instead of cron. It is more capable (watches files, handles failures, manages logging) but the XML plist format takes getting used to.

### Plist File Structure

Plist files live in `~/Library/LaunchAgents/` for user-level jobs. Each file defines one scheduled task.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.yourname.seo-scan</string>

    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>/Users/yourname/your-repo/scripts/seo_scan.sh</string>
    </array>

    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>0</integer>
        <key>Minute</key>
        <integer>30</integer>
    </dict>

    <key>StandardOutPath</key>
    <string>/Users/yourname/logs/seo-scan.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/yourname/logs/seo-scan-error.log</string>

    <key>WorkingDirectory</key>
    <string>/Users/yourname/your-repo</string>

    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin</string>
    </dict>
</dict>
</plist>
```

### Key Fields Explained

| Field | Purpose |
|---|---|
| `Label` | Unique identifier. Convention: reverse domain like `com.yourname.task-name` |
| `ProgramArguments` | The command to run. Always use full paths. |
| `StartCalendarInterval` | When to run. Hour/Minute/Day/Month/Weekday. |
| `StandardOutPath` | Where stdout goes. Create the logs directory first. |
| `StandardErrorPath` | Where stderr goes. Separate file makes debugging easier. |
| `WorkingDirectory` | The cwd when the script runs. Set this to your repo root. |
| `EnvironmentVariables` | PATH and other env vars. launchd has a minimal environment by default. |

### Schedule Patterns

Run at midnight every day:

```xml
<key>StartCalendarInterval</key>
<dict>
    <key>Hour</key>
    <integer>0</integer>
    <key>Minute</key>
    <integer>0</integer>
</dict>
```

Run every hour:

```xml
<key>StartCalendarInterval</key>
<dict>
    <key>Minute</key>
    <integer>0</integer>
</dict>
```

Run every Monday at 9am:

```xml
<key>StartCalendarInterval</key>
<dict>
    <key>Weekday</key>
    <integer>1</integer>
    <key>Hour</key>
    <integer>9</integer>
    <key>Minute</key>
    <integer>0</integer>
</dict>
```

Run every 30 minutes (use `StartInterval` instead):

```xml
<key>StartInterval</key>
<integer>1800</integer>
```

### Loading and Managing

```bash
# Load the plist (starts the schedule)
launchctl load ~/Library/LaunchAgents/com.yourname.seo-scan.plist

# Unload (stops the schedule)
launchctl unload ~/Library/LaunchAgents/com.yourname.seo-scan.plist

# Check if it is running
launchctl list | grep yourname

# Run it immediately (for testing)
launchctl start com.yourname.seo-scan

# Check for errors in the plist
plutil -lint ~/Library/LaunchAgents/com.yourname.seo-scan.plist
```

### Keeping a Process Alive

For long-running services (like a dev server that needs to stay up), use `KeepAlive`:

```xml
<key>KeepAlive</key>
<true/>
<key>RunAtLoad</key>
<true/>
```

This restarts the process if it crashes. Useful for dev servers, webhook listeners, or any service your other scripts depend on.

### Example: Nightly Cron Script

The script that your plist calls. Keep it simple and self-contained:

```bash
#!/bin/bash
set -euo pipefail

REPO_DIR="$HOME/your-repo"
LOG_FILE="$HOME/logs/nightly-$(date +%Y-%m-%d).log"

cd "$REPO_DIR"

echo "=== Nightly run: $(date) ===" >> "$LOG_FILE"

# Pull latest changes
git pull origin main >> "$LOG_FILE" 2>&1

# Run SEO scan
python3 scripts/seo_scan.py >> "$LOG_FILE" 2>&1

# Rebuild content index
node scripts/rebuild-index.js >> "$LOG_FILE" 2>&1

# Generate blog drafts from new briefs
python3 scripts/generate_drafts.py >> "$LOG_FILE" 2>&1

echo "=== Complete: $(date) ===" >> "$LOG_FILE"
```

Make it executable:

```bash
chmod +x scripts/nightly.sh
```

## Linux: systemd

Linux servers use systemd for scheduled tasks. You need two files: a service unit (what to run) and a timer unit (when to run it).

### Service Unit

Save to `~/.config/systemd/user/seo-scan.service`:

```ini
[Unit]
Description=Run SEO keyword scan

[Service]
Type=oneshot
WorkingDirectory=/home/yourname/your-repo
ExecStart=/bin/bash scripts/seo_scan.sh
StandardOutput=append:/home/yourname/logs/seo-scan.log
StandardError=append:/home/yourname/logs/seo-scan-error.log
Environment=PATH=/usr/local/bin:/usr/bin:/bin
```

### Timer Unit

Save to `~/.config/systemd/user/seo-scan.timer`:

```ini
[Unit]
Description=Run SEO scan daily at midnight

[Timer]
OnCalendar=*-*-* 00:30:00
Persistent=true

[Install]
WantedBy=timers.target
```

`Persistent=true` means if the machine was off at the scheduled time, it runs the task when it boots up. This is important for laptops and machines that sleep.

### Timer Patterns

```ini
# Every day at midnight
OnCalendar=*-*-* 00:00:00

# Every hour
OnCalendar=hourly

# Every Monday at 9am
OnCalendar=Mon *-*-* 09:00:00

# Every 30 minutes
OnCalendar=*:0/30

# First of every month at 6am
OnCalendar=*-*-01 06:00:00
```

### Managing Timers

```bash
# Enable and start the timer
systemctl --user enable seo-scan.timer
systemctl --user start seo-scan.timer

# Check timer status
systemctl --user list-timers

# Run the service immediately (for testing)
systemctl --user start seo-scan.service

# View logs
journalctl --user -u seo-scan.service

# Stop the timer
systemctl --user stop seo-scan.timer
systemctl --user disable seo-scan.timer
```

## Error Handling

Automated scripts fail silently unless you build in error handling. Three patterns that prevent silent failures.

### 1. Exit on Error

```bash
set -euo pipefail
```

This stops the script on the first error instead of continuing with broken state. The `pipefail` flag catches errors in piped commands too.

### 2. Log Everything

```bash
exec > >(tee -a "$LOG_FILE") 2>&1
echo "Started: $(date)"
```

Redirect all output to a log file while still printing to stdout. When something breaks at 3am, the log tells you what happened.

### 3. Notifications on Failure

```bash
if ! python3 scripts/seo_scan.py >> "$LOG_FILE" 2>&1; then
    echo "SEO scan failed at $(date)" | \
        mail -s "Cron failure: seo-scan" you@example.com
fi
```

Or use a webhook to post to Slack, Discord, or any notification service:

```bash
notify_failure() {
    curl -s -X POST "$WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "{\"text\": \"Cron failed: $1 at $(date)\"}"
}
```

## Log Rotation

Logs grow forever unless you rotate them. A simple approach:

```bash
# In your nightly script, clean logs older than 30 days
find "$HOME/logs" -name "*.log" -mtime +30 -delete
```

Or use a dedicated log rotation entry in your launchd/systemd setup that runs weekly.

## Practical Schedule for a Solo Builder

Here is a schedule that works for one person running one or two sites:

| Time | Task | Frequency |
|---|---|---|
| 00:00 | SEO keyword scan | Daily |
| 00:30 | Content index rebuild | Daily |
| 01:00 | Blog draft generation | Weekly (Monday) |
| 06:00 | Site rebuild and deploy | Daily |
| 22:00 | Cache sync (Reddit, analytics) | Daily |
| Sunday 03:00 | Log cleanup | Weekly |

This schedule runs everything overnight. You wake up to fresh data, new drafts to review, and a recently deployed site.

## Testing Before Scheduling

Always test your scripts manually before putting them on a schedule:

```bash
# Run the script directly
bash scripts/nightly.sh

# Check the output
cat ~/logs/nightly-$(date +%Y-%m-%d).log

# Verify no errors
echo $?
```

Common issues that only surface in cron:

- **Missing PATH.** Your shell has a rich PATH. launchd and systemd do not. Always set PATH explicitly.
- **Missing environment variables.** API keys in your `.bashrc` or `.zshrc` do not exist in cron. Source them explicitly or set them in the plist/service file.
- **Wrong working directory.** Relative paths break. Use absolute paths or set `WorkingDirectory`.
- **Permissions.** The script might need to write to directories it does not own. Test with the same user the cron runs as.

## What You Have After This Chapter

- launchd plist templates for macOS scheduled tasks
- systemd service and timer templates for Linux
- Error handling and logging patterns
- A practical schedule for a solo builder's automated tasks

Next up: [Chapter 4: Agent Systems](./04-agent-systems.md) covers using Claude Code subagents and teams to multiply your output.
