# ProfileMe.dev Architecture

This document explains the architecture and design decisions for ProfileMe.dev.

## Core Principles

### 1. JSON-First Canonical State

**All users (free + sponsors) use ONE canonical JSON object internally.**

- **Markdown is NOT the source of truth** - it is always derived from JSON
- Markdown is generated via: `renderReadme(profileJson) -> markdown`
- Free users only see/copy Markdown
- Sponsors can sync/export JSON to GitHub

### 2. Storage Strategy

#### Free Users & Non-Sponsors
- **LocalStorage only** - profile data stored in browser
- No cloud storage
- No GitHub integration

#### Sponsors
- **GitHub is the source of truth** - profile stored in `.profile/profile.json`
- **LocalStorage is a cache** - used for fast UI hydration
- Auto-sync on login with background stale-checking

### 3. Authentication

- **Supabase** is used **ONLY for authentication**
- **No profile data stored in Supabase** - no custom database tables
- GitHub OAuth via Supabase provider
- Long-persistent login sessions

### 4. Sponsor Entitlement

- Determined via **GitHub Sponsors GraphQL API**
- Query: `viewer { isSponsoredBy(accountLogin: "...") }`
- **No DB tables for entitlements**
- `DEV_SPONSOR_OVERRIDE=true` for development

### 5. GitHub Integration (Sponsors Only)

#### Repository Structure
```
username/username/          # Profile repository (must match GitHub username)
├── .profile/
│   ├── profile.json       # Canonical profile JSON
│   └── assets/
│       ├── avatar.webp
│       └── icons/*.svg
├── README.md              # Generated from profile.json
└── portfolio.html         # Optional portfolio (GitHub Pages)
```

#### File Operations
- **Read**: Fetch `.profile/profile.json` with SHA/ETag tracking
- **Write**: Commit `.profile/profile.json` + `README.md` + assets
- **Sync**: Validate JSON → Generate README → Commit to GitHub
- **Restore**: Fetch JSON → Validate → Update UI + LocalStorage cache

## Data Flow

### Profile Creation/Editing
```
User Input → React State → Profile JSON (canonical) → Markdown Preview
                                    ↓
                            LocalStorage (cache)
```

### Sponsor Sync Flow
```
Profile JSON → Validate (Zod) → Generate README → GitHub API → Commit
                                    ↓
                            Update LocalStorage SHA
```

### Sponsor Restore Flow
```
GitHub API → Fetch .profile/profile.json → Validate → Migrate → Update State
                                    ↓
                            Update LocalStorage cache
```

### Auto-Restore on Login
1. **Immediate**: Hydrate UI from LocalStorage (fast)
2. **Background**: Check GitHub SHA/ETag (throttled to 5 minutes)
3. **If changed**: Fetch and update UI + cache
4. **Manual**: "Refresh from GitHub" button for force check

## File Structure

### Profile JSON Schema

```typescript
{
  schemaVersion: number;        // Schema version for migrations
  updatedAt: string;            // ISO 8601 timestamp
  generator: {
    name: "ProfileMe.dev";
    version?: string;
  };
  profile: {
    introduction: IntroductionData;
    skills: SkillsData;
    socials: SocialsData;
    badges: BadgesData;
    support: SupportData;
    sectionOrder: string[];
    socialOrder: string[];
    skillsOrder: string[];
  };
  render: {
    readmeTemplate: string;
    readmeOptions: Record<string, any>;
  };
  portfolio?: {
    template?: string;
    options?: Record<string, any>;
  };
}
```

### LocalStorage Keys

- `profileme.profileJson` - Canonical profile JSON
- `profileme.lastKnownSha` - Last known SHA of `.profile/profile.json`
- `profileme.lastKnownEtag` - Last known ETag (alternative to SHA)
- `profileme.lastGitHubCheckAt` - Timestamp of last GitHub check (for throttling)

## API Routes

### Authentication
- `POST /api/auth/login` - Initiate GitHub OAuth via Supabase
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/session` - Get current session + GitHub token
- `GET /api/auth/callback` - Handle OAuth callback

### GitHub Operations (Sponsors Only)
- `POST /api/github/sync` - Sync profile JSON + README to GitHub
- `POST /api/github/restore` - Restore profile from GitHub
- `GET /api/github/sponsor-status` - Check if user is a sponsor
- `GET /api/github/file-meta` - Get file metadata (SHA/ETag)
- `POST /api/github/portfolio` - Generate portfolio HTML

## Error Handling

All API routes use centralized error formatting (`lib/utils/errors.ts`):

- **Rate Limits**: User-friendly message with retry suggestion
- **Permissions**: Clear action (re-login)
- **Not Found**: Specific guidance (create repo, sync first, etc.)
- **SHA Mismatch**: Retry with refresh instruction
- **Validation**: Field-level error details

## Migration Strategy

### Legacy State → Profile JSON
- Automatic migration on first load
- Preserves all existing data
- Updates schema version

### Schema Versions
- Version 1: Initial JSON schema
- Future versions: Incremental migrations via `migrateProfileJson()`

## Portfolio

- Generated from the **same Profile JSON**
- GitHub Pages compatible HTML output
- Minimal v1 implementation
- No hosting on our side - users deploy to GitHub Pages

## Development

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Sponsor Verification
GITHUB_SPONSOR_ACCOUNT=your_github_username_or_org
DEV_SPONSOR_OVERRIDE=true  # Bypass sponsor checks in dev
```

### Testing Sponsor Features

1. Set `DEV_SPONSOR_OVERRIDE=true` in `.env.local`
2. Login with GitHub OAuth
3. Create profile repository: `username/username`
4. Test sync/restore/portfolio features

## Security Considerations

- **GitHub tokens**: Stored server-side only (Supabase session)
- **No client-side token exposure**
- **Sponsor checks**: Enforced on both client and server
- **JSON validation**: Zod schemas on all inputs
- **XSS prevention**: HTML escaping in portfolio renderer

## Future Enhancements

- Portfolio templates (multiple options)
- Asset upload/sync
- Multi-repository support
- Profile versioning/history
- Collaborative editing
