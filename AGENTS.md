# Agent Context

> Universal project context file. Works with: Antigravity, Codex, Claude Code, Cursor, Gemini CLI.
> Place in your project root. Update sections marked with [UPDATE] for each new project.
> Delete sections that don't apply to the current project.

---

## How You Operate

1. Check Filesystem MCP for existing code before writing anything new
2. Use Sequential Thinking for complex tasks — plan first, code second
3. When something breaks — fix it, test it, tell me what you learned
4. Build incrementally — don't build everything at once
5. Update your approach based on what works in this project

---

## Project Info

**Project Name:** Webitof gym
**Type:** Web app
**Status:** In development

---

## Tech Stack

**Frontend:** Next.js 14 (App Router)
**Styling:** Tailwind CSS + Ant Design (antd)
**Backend:** Node.js + Express (TypeScript)
**Database:** MongoDB (Mongoose)
**Auth:** JWT
**Other:** Socket.io, AWS SDK (S3), Recharts, Framer Motion

---

## Project Structure [UPDATE PER PROJECT]

```
/
└── Source Code/
    ├── backend/     # Node.js/Express (TypeScript)
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   └── utils/ (SMTP, S3, Socket)
    └── frontend/    # Next.js 14 (App Router)
        ├── app/
        ├── components/
        └── styles/
```

---

## Available MCP Tools

Use these tools when relevant — don't rely on training data when a tool can get current info:

| Tool                    | When to Use                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| **Context7**            | Before writing any library-specific code — fetch latest docs          |
| **Figma MCP**           | When a Figma URL is provided — read design, extract tokens, implement |
| **Stitch MCP**          | When UI generation from prompt is needed                              |
| **Filesystem**          | Always check existing code before writing new code                    |
| **Sequential Thinking** | Complex multi-step features — plan before coding                      |

---

## Available Skills

These activate automatically based on task — no need to mention them explicitly:

| Skill                           | Activates When                                        |
| ------------------------------- | ----------------------------------------------------- |
| `ui-designer`                   | Any design, UI, Figma, Stitch, layout, or visual task |
| `backend-engineer`              | Any API, database, auth, route, or server task        |
| `stitch-design`                 | Generating UI screens with Stitch                     |
| `react:components`              | Converting designs to React components                |
| `stitch-loop`                   | Building multiple screens automatically               |
| `vercel-react-best-practices`   | Writing or reviewing React code                       |
| `web-design-guidelines`         | UI review or accessibility audit                      |
| `vercel-composition-patterns`   | Refactoring or structuring React components           |
| `openai/figma`                  | Fetching design context and assets from Figma         |
| `openai/figma-implement-design` | Translating Figma designs to pixel-perfect code       |
| `find-skills`                   | Always active — suggests relevant skills              |

---

## Coding Standards

### General Rules

- Read existing code with Filesystem MCP before writing anything new
- Ask before adding new dependencies — check if a native solution exists first
- Write for readability — code is read more than it's written
- No hardcoded secrets — use environment variables for everything sensitive
- Always provide a `.env.example` with dummy values

### Frontend

- Functional components + hooks only (React) — no class components
- Mobile-first responsive design always
- Handle all states: loading, error, empty, success
- Minimum touch target: 44px for interactive elements
- Use the project's existing component patterns — don't introduce new ones without asking

### Backend

- `async/await` only — no `.then()` chains
- Always validate input before hitting the database
- Consistent API response format:
  ```json
  { "success": true, "data": {}, "message": "" }
  { "success": false, "error": "message", "code": "ERROR_CODE" }
  ```
- try/catch on all async functions — pass errors to error middleware
- Never log passwords, tokens, or sensitive user data

### Database

- Always paginate list endpoints — never return unlimited results
- Use `.lean()` for read-only queries (MongoDB/Mongoose)
- Index fields that are frequently queried
- Never return password or sensitive fields in responses

### Git

- Commit format: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`
- Never commit `.env` files
- Write commit messages that explain WHY, not just what

### Project Specifics

- **SMTP Setup**: Configuration is database-driven (see `mailCredential.model.ts` and `marketing-setting.model.ts`). Do NOT hardcode SMTP credentials in `.env`.
- **Frontend Performance**: Always ensure heavy libraries (antd, recharts, icons) are included in `optimizePackageImports` within `next.config.js`.
- **Environment**: Backend requires `.env` with `DATABASE_URL`, `SECRET`, and `PORT`.

---

## Design Standards

- Mobile-first always — test at 375px, 768px, 1280px minimum
- Consistent spacing — use a scale (4, 8, 16, 24, 32, 48, 64px)
- Maximum 2 font families per project
- Color contrast minimum 4.5:1 for normal text
- Every interactive element needs: default, hover, focus, disabled states
- Always include: loading state, empty state, error state for every data-driven component

---

## Deployment Preferences [UPDATE PER PROJECT]

- **Don't auto-deploy** — prepare deployment scripts/commands for me to review and run manually
- Provide a clear step-by-step deploy checklist
- Always include environment variable documentation
- Test builds locally before providing deploy instructions

---

## What I Don't Want

- Don't over-engineer — simplest solution that works is best
- Don't add libraries without asking
- Don't generate tests unless I specifically ask
- Don't use deprecated APIs — check Context7 for current patterns
- Don't make UI that looks generic or AI-generated — aim for premium quality
- Don't build everything at once — show progress incrementally

---

## How to Start Every Task

1. **Check existing code first** — use Filesystem MCP to understand what's already there
2. **Identify task type:**
   - UI/design task → `ui-designer` skill activates
   - Backend/API task → `backend-engineer` skill activates
   - Complex task → use Sequential Thinking to plan first
3. **Check library docs** — use Context7 for any framework-specific code
4. **Build incrementally** — show me what you built, get confirmation, then continue
5. **Never assume** — if something is unclear about requirements, ask one focused question

## When My Prompt is Vague

If my request is missing key details (which file, which component,
which endpoint, what data), don't guess — ask me ONE focused question
before starting. Example:

Me: "add authentication"
You: "Which part — the login route, the JWT middleware,
the React login form, or all three?"

Me: "make it look better"  
You: "Which screen or component? And what specifically —
spacing, colors, layout, or overall style?"

One question only. Then proceed once I answer.

## Planning & Token Efficiency

Before starting ANY task:

1. State what you understood from my request in 2-3 lines
2. List what you plan to do (max 5 bullet points)
3. Ask ONE question if anything is unclear
4. Wait for my confirmation before writing code

If my prompt is vague, ask ONE focused question before proceeding:

- "build auth" → "Which part — login route, JWT middleware, or React form?"
- "make it look better" → "Which screen, and what — spacing, colors, or layout?"
- "fix the bug" → "Which file and what error are you seeing?"

Keep responses focused:

- Don't show code for files I didn't ask about
- Don't refactor things I didn't mention
- Don't add features I didn't request
- One task at a time — confirm before moving to the next
