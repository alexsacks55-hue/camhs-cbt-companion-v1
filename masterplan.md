30-Second Elevator Pitch
A privacy-first digital CBT companion for CAMHS that helps young people reflect, learn, and track progress between therapy sessions while supporting parents, practitioners, and trainees. The app provides structured mood check-ins, patterns insights, CBT learning resources, and a temporary in-session collaboration tool called Session Companion. It avoids storing therapeutic free text and instead relies on structured inputs, safe summaries, and pattern-based prompts to protect privacy while still supporting meaningful therapeutic reflection. The result is a calm, supportive digital layer that strengthens therapy engagement without adding clinician admin burden.

Problem & Mission
The problem
Young people in CAMHS often struggle to:
remember what happened between sessions
track emotional patterns
apply CBT techniques outside appointments
stay engaged with therapy work between sessions

Practitioners face different challenges:
limited time in sessions
difficulty reviewing the previous week accurately
concerns about privacy in digital tools
reluctance to adopt systems that increase admin burden

Most existing digital mental health tools either:
collect large amounts of sensitive free-text personal data, or
behave like generic wellness apps with heavy gamification and little clinical credibility.

Neither approach fits well with CAMHS.

Mission
Create a calm, privacy-first digital companion that:
helps young people notice patterns and progress
reinforces CBT learning between sessions
supports collaborative work during sessions
protects privacy by design
requires no additional admin workload for clinicians

The system should support therapy without trying to replace it.

Target Audience
1. Young People
Typical age range: 11–18
Primary needs: understand emotions and patterns
track mood and anxiety
complete CBT activities
access helpful resources
review the past week before therapy
Special considerations: younger users may require parental awareness
interface must be simple, calm, and non-judgmental

2. Parents / Carers
Use cases: supporting younger children
understanding CBT concepts
accessing printable worksheets
guiding home practice
For children under 11, usage is primarily parent-led.

3. Practitioners (CAMHS Clinicians)
Use cases: collaborative in-session work
quick review of structured patterns
access to resource library
service-level anonymous engagement insights
Critical requirement: No additional administrative burden.

4. Trainee Practitioners
Use cases: access resources
practice structured CBT activities
observe engagement trends

Core Features
Role-Based Onboarding
young person accounts
parent/carer accounts
practitioner accounts
trainee practitioner accounts
age-aware onboarding logic
parental awareness flow where required

Mood Check-In
Structured emotional check-ins using:
mood slider (0–10)
anxiety slider (0–10)
emotion selection from fixed list
context selections (school, friends, family, sleep etc.)
coping strategies selected from predefined list
No free text is stored.

Review of the Past 7 Days
A weekly reflection page that shows:
check-ins completed
activities completed
most selected emotions
most used coping strategies
discussion prompts
Output is generated from structured data only.

Patterns
The system identifies gentle trends, such as:
repeated low mood
repeated high anxiety
repeated distress emotions
It generates careful prompts encouraging:
reflection
discussion
help-seeking when appropriate
The system must avoid making clinical claims or diagnoses.

Resource Library
Four core categories:
Anxiety
Low Mood
Behavioural Challenges
Sleep
Each category contains two sections:
Learn psychoeducation
CBT explanations
short supportive guidance
Activities worksheets
structured exercises
printable templates
Resources are ordered in typical therapy progression but never locked to sessions.

Printable Resources
Two types of exports:
Blank template
Printable worksheet with no user data.
Structured summary
Generated summary using:
counts
labels
ratings
generalised wording
No personal text is exported.

Session Companion
A temporary shared workspace used during therapy sessions.
Flow:
Practitioner starts a session
System generates a temporary code
Young person joins using the code
Activities can be completed together
Outputs are temporary
Data automatically deletes after inactivity
Nothing is permanently saved from the shared session.
This preserves collaboration without creating a monitoring relationship.

Anonymous Service Insights
Practitioners can view service-level trends such as:
most viewed resources
most exported templates
activity completion rates
mood check-in frequency trends
No individual user data is exposed.

High-Level Tech Stack
Frontend
React
TypeScript
Tailwind CSS
shadcn/ui
Why: fast modern web stack
highly compatible with AI-assisted development
accessible component library

Backend
Hosting
Azure App Service
Azure UK South region
Why: fully managed infrastructure
strong compliance story for UK healthcare contexts
minimal operational overhead

Database
Azure Database for PostgreSQL
Why: reliable relational structure
predictable schema for AI-assisted development
scalable but simple for V1

Analytics
Separate analytics schema or store.
Purpose: capture anonymous usage events
keep analytics isolated from therapeutic data.

Conceptual Data Model
Main data entities:
Users
Stores: role
age band
consent flags
Minimal account data only.

Resources
Stores: category
section (Learn / Activities)
visibility rules
sort order
export type
status

Mood Check-Ins
Stores: mood rating
anxiety rating
emotion selections
context selections
coping strategies
No free text fields.

Activity Completions
Stores: activity ID
before rating
after rating
reflection selections

Structured Summaries
Generated outputs derived from structured data.
Stored as safe generalised JSON.

Session Companion
Temporary session records including:
session code
start time
expiry time
Associated activity outputs are temporary.

Analytics Events
Anonymous events such as:
resource viewed
activity completed
check-in submitted
session companion started

UI Design Principles
The interface should feel:
calm
supportive
clear
non-judgmental
Avoid: gamification
heavy notifications
clutter
clinical database aesthetics
Design choices should reflect kindness in interaction design:
supportive empty states
gentle encouragement
forgiving workflows
emotionally safe language
The product should help users feel supported rather than evaluated.

Security & Privacy Principles
Privacy is the central design constraint.
Key rules:
no stored therapeutic free text
structured inputs only
minimal user identity data
temporary session collaboration
analytics separated from therapeutic data
strict role-based access
The system should prevent users from entering identifiable information inside therapeutic workflows wherever possible.

Phased Roadmap
V1 — Full Core Product
Includes: onboarding
mood check-in
weekly review
patterns insights
resource library
printable exports
session companion
safeguarding prompts
service analytics
admin content system

V1.5 — Refinement Phase
Possible additions: improved pattern visualisation
more CBT resource modules
enhanced practitioner insight dashboards
improved onboarding guidance

V2 — Expansion
Possible future features: optional journaling stored locally on device
additional therapy frameworks
clinician dashboards
service configuration tools
richer activity formats

Risks & Mitigations
Risk: privacy concerns
Mitigation: no free text storage
structured data only
minimal identifiers

Risk: clinician adoption
Mitigation: no extra admin workload
session companion designed for quick use
strong privacy design

Risk: low engagement
Mitigation: calm UX
lightweight interactions
supportive feedback loops

Risk: feature creep
Mitigation: strict V1 scope
flexible content system for future expansion

Future Expansion Ideas
Possible longer-term directions:
clinician training modules
school-based versions
group therapy adaptations
additional CBT pathways
integration with service education materials
These should only be considered after validating V1 engagement and clinical usefulness.

Summary
This product is designed to be a privacy-first digital therapy companion, not a clinical database or self-help app. By combining:
structured emotional tracking
CBT resources
safe collaboration
anonymous service insights
the platform strengthens CAMHS work between sessions while protecting privacy and reducing clinician burden.

Purpose
This document turns the approved product brief into a clear build sequence for Claude Code. The goal is to produce a full V1 web app that matches the brief from day one, while still being built in a safe order that reduces rework and protects the privacy model.

Build Goal
Build a privacy-first CBT companion for CAMHS that supports:
young people
parents/carers
practitioners
trainee practitioners

V1 must include:
role-based onboarding
age-aware access logic
resource library
mood check-in
review of the past 7 days
patterns
structured exports
Session Companion
safeguarding prompts
anonymous service insights
admin content management

All therapeutic workflows must use structured inputs only. No stored free text is allowed in V1.

Core Build Rules for Claude Code
Product rules
Do not add features not listed in the brief.
Do not introduce chat, journaling, or messaging.
Do not add stored clinician notes.
Do not create permanent practitioner-young person account linking.
Do not treat the product like an emergency service.

Privacy rules
No stored therapeutic free text.
No saved text boxes in therapeutic workflows.
No identifiable personal data inside activities or summaries.
Session Companion activity data must expire and be deleted.
Analytics must be separated from core therapeutic data.

UX rules
The interface must feel calm, clear, supportive, and non-judgmental.
Empty states must be supportive, not clinical or blank.
Error messages must be plain-language and calm.
The app must work well on mobile and desktop.

Technical rules
Frontend: React + TypeScript + Tailwind + shadcn/ui
Hosting: Azure App Service in UK South
Database: Azure Database for PostgreSQL in UK South
Architecture: fully managed V1, low infrastructure complexity
Keep schema strict and explicit for reliable AI-assisted development.

Delivery Structure
Claude Code should build in this order:
project foundation
data model
authentication and roles
global layout and navigation
resource library and CMS
mood check-in
review of the past 7 days
patterns and safeguarding prompts
exports
Session Companion
analytics and service insights
QA, accessibility, and launch hardening

This order matters because later features depend on earlier permissions, data, and privacy rules.

Phase 1 — Project Foundation
Goal
Create the base project and shared conventions.

Tasks
Initialise project repository.
Create /docs folder and store blueprint files.
Scaffold React + TypeScript app.
Add Tailwind.
Add shadcn/ui.
Create shared design tokens and layout primitives.
Create environment variable structure.
Create staging and production config pattern.
Set up linting and formatting.
Create base folder structure.

Recommended app structure
/src
  /app
  /components
  /features
  /layouts
  /pages
  /lib
  /hooks
  /styles
  /types
  /services
  /config

Definition of done
App runs locally.
Shared UI primitives are installed.
Folder structure is clear.
Environment config exists.
No product features built yet.

Phase 2 — Database and Data Contracts
Goal
Create the strict relational schema before feature work begins.

Required tables
users
resources
resource_visibility
mood_checkins
activity_completions
structured_summaries
session_companions
session_companion_activities
analytics_events
safeguarding_prompts

These tables are directly required by the brief.

Tasks
Define table schemas.
Define enums for roles, statuses, categories, sections, export types.
Add timestamps and audit-friendly fields where appropriate.
Keep therapeutic data and analytics logically separated.
Add indexes for likely query paths.
Create migration files.
Create TypeScript types that mirror database entities.

Suggested enum set
user_role: young_person, parent_carer, practitioner, trainee_practitioner, admin
resource_category: anxiety, low_mood, behavioural_challenges, sleep
resource_section: learn, activities
resource_status: draft, published, hidden, archived
export_type: none, blank_template, structured_summary
journey_step: understand, try, practise, review
summary_type: weekly_review, activity_summary
prompt_type: low_mood, high_anxiety, distress_emotions, urgent_support

Definition of done
Schema is created.
Migrations run cleanly.
Types are generated or written.
No free-text therapeutic columns exist.

Phase 3 — Authentication, Roles, and Onboarding
Goal
Build identity and access control before feature screens.

Required user flows
Young person
choose role
confirm age band
apply age-aware onboarding logic
allow independent access for ages 16–18
show parental awareness flow for ages 11–15

Parent/carer
create own account
access parent-facing content
support under-11 use

Practitioner
create account
access practitioner resources
access service insights
start Session Companion

Trainee practitioner
similar to practitioner
allow limited differences in access if configured

Tasks
Build sign up flow.
Build sign in flow.
Build session persistence.
Build role selection step.
Build age-band logic.
Build consent/awareness flags.
Build role-based redirects after onboarding.
Build permission middleware/helpers.

Important rules
Practitioners must not need to invite young people before value is unlocked.
Do not create account-linking dependency for user start.
Hide inaccessible features rather than exposing broken paths.

Definition of done
Users can sign up and sign in.
Each role lands in the correct experience.
Age-aware onboarding works.
Permissions are enforced.

Phase 4 — App Shell, Navigation, and Shared States
Goal
Create the reusable interface skeleton.

Top-level pages
Dashboard / Home
Mood Check-In
Review of the Past 7 Days
Patterns
Resources
Session Companion
Help and Support
Admin / Content Management
Service Insights

These are the required top-level structures from the brief.

Tasks
Build top navigation or mobile nav.
Build dashboard shell.
Build role-based menu visibility.
Build empty state component.
Build loading state component.
Build error state component.
Build permission-denied state.
Build calm success messages.

UX rules
Primary actions must be obvious.
Avoid clutter and dense dashboards.
Use supportive language in all states.

Definition of done
Each page route exists.
Navigation is role-aware.
Shared UI states are reusable.

Phase 5 — Resource Library and Content Management
Goal
Build the content system early because it is central to V1 and powers value across roles.

Resource library requirements
Categories: Anxiety Low Mood Behavioural Challenges Sleep
Sections: Learn Activities
Fields required: title category section description visibility typical session number journey step export type status sort order content type

These come directly from the resource spec.

User-facing tasks
Build resource category landing pages.
Build category detail views.
Build Learn and Activities views.
Build resource detail page.
Build role-based visibility filter.
Build session-order display logic.
Build export action UI where relevant.

Admin tasks
Add resource
Edit resource
Hide resource
Archive resource
Delete resource
Upload/replace file
Set category
Set section
Set visibility
Set session number
Set journey step
Reorder resources
Change status

Important rules
Resources are content, not app features.
Mood Check-In, Patterns, Review, and Session Companion are not resource entries.
Ordering can suggest session flow but must never lock access.

Definition of done
Users can browse resources by category and section.
Admin can manage content without code changes.
Visibility and ordering work correctly.

Phase 6 — Mood Check-In
Goal
Build the first core structured therapeutic workflow.

Allowed inputs
mood slider 0–10
anxiety slider 0–10
emotion selections from fixed list
context/reflection selections from fixed list
coping strategy selections from fixed list

Not allowed
open text notes
journaling box
free response reflections

Tasks
Design input screen.
Save entries to mood_checkins.
Add validation rules.
Add timestamp handling.
Add confirmation state after submission.
Add dashboard surface showing recent completion status.

Suggested fixed-choice sets
Emotions
calm
worried
sad
angry
overwhelmed
hopeful
tired
frustrated
okay
very_worried
hopeless

Contexts
school
friends
family
sleep
health
activities
home
not_sure

Strategies
breathing
going_outside
talking_to_someone
grounding
listening_to_music
taking_a_break
movement
routine

Definition of done
Check-in can be completed on mobile and desktop.
Structured data is stored safely.
No free text is possible.

Phase 7 — Review of the Past 7 Days
Goal
Turn recent structured data into a supportive summary.

Required outputs
number of check-ins completed
number of activities completed
most selected emotions
most selected strategies
potential discussion areas
gentle prompts for reflection

Tasks
Define summary generation logic.
Build weekly review page.
Pull last 7 days of structured data.
Create generalised wording rules.
Add supportive empty state when not enough data exists.
Store generated summary in structured_summaries if needed.

Important rules
Summary wording must stay general.
No diagnosis language.
No personal or identifying details.

Example output style
"Mood check-ins completed: 4"
"Most selected emotions: worried, tired"
"Potential discussion areas: school mornings, sleep pattern"

This matches the brief’s example format.

Definition of done
Weekly review is generated from structured data only.
Empty state appears when insufficient data exists.
Language is calm and useful.

Phase 8 — Patterns and Safeguarding Prompts
Goal
Surface careful trends without overreach.

Required pattern rules
Repeated low mood
trigger when mood rating is 3 or below on 3 or more days within 7 days

Repeated high anxiety
trigger when anxiety rating is 8 or above on 3 or more days within 7 days

Repeated distress emotions
trigger when distress-linked emotions repeat within recent data

These rules are directly defined in the brief.

Required prompt goals
encourage support-seeking
encourage reflection
remind users of trusted adults and CAMHS support routes
show static urgent guidance in support areas

Tasks
Build pattern calculation service.
Build Patterns page.
Build prompt rendering rules.
Store shown prompts in safeguarding_prompts.
Add help-seeking links and static support content.
Ensure wording remains proportionate.

Important rules
Do not claim diagnosis.
Do not imply live monitoring.
Do not position the app as crisis response.
Pattern prompts must be supportive, not alarming.

Definition of done
Pattern rules trigger correctly.
Prompt history can be logged for audit/improvement.
Wording is safe and proportionate.

Phase 9 — Structured Exports and Printables
Goal
Allow safe takeaways without storing free-text personal content.

Export types
Blank template
export printable worksheet with no user data.

Structured summary
export generated from numbers, labels, counts, and generalised wording only

Tasks
Build export generation helpers.
Build print-friendly layouts.
Link exports from resources where relevant.
Link exports from weekly review and structured activity outputs where relevant.
Add clear safety note where screenshots may be used in Session Companion.

Important rules
Never export typed user notes.
Never include identifiers in exported therapeutic content.

Definition of done
Blank templates print correctly.
Structured summaries export correctly.
Exports remain within privacy rules.

Phase 10 — Session Companion
Goal
Build temporary practitioner-supported collaboration without permanent linking.

Required flow
Practitioner starts session
System creates short session code
Young person joins with code
Shared activity takes place
Temporary outputs can be viewed during session
Session expires after inactivity
Data is deleted after session end

Session rules
no permanent account linking
no free-text storage
no permanent save of session activity
session activities expire after 10 minutes of inactivity
show clear temporary-use message

These are explicit V1 rules in the brief.

Tasks
Build practitioner start flow.
Build code generation.
Build join screen for young person.
Build temporary activity state handling.
Build inactivity timer.
Build deletion job/process.
Build expired-session state.
Build end-session confirmation and cleanup.

Required user message
Use wording close to: "Activities completed in session companion mode are temporary and will not be saved. If you wish to keep a copy for discussion, you may take a screenshot. Please avoid including names or personal details."

This message is specified in the brief.

Definition of done
Practitioner can start session.
Young person can join with valid code.
Temporary state expires correctly.
No session activity persists after end.

Phase 11 — Anonymous Analytics and Service Insights
Goal
Provide service-level usefulness without exposing individual data.

Example analytics events
resource_viewed
resource_exported
activity_started
activity_completed
mood_checkin_completed
weekly_review_viewed
session_companion_started
session_companion_joined
structured_summary_generated

These event examples come directly from the brief.

Service insight views
most used resource categories this month
most viewed resources
most exported blank templates
most completed activities
overall check-in frequency trends

Tasks
Create event tracking helper.
Send events to separate analytics table/store.
Build service-level aggregation queries.
Build practitioner/service insights dashboard.
Keep results anonymous and aggregated.

Important rules
No individual identifiable tracking view for practitioners.
Do not blend analytics with therapeutic record views.

Definition of done
Events are captured.
Dashboard shows aggregated usage patterns.
No individual user data is exposed.

Phase 12 — Help and Support
Goal
Provide static guidance and signposting.

Tasks
Build Help and Support page.
Add static support guidance.
Add urgent reminder copy.
Link to support messaging from patterns where relevant.
Keep wording clear and proportionate.

Required principle
The app should support, notice, remind, and signpost. It should not diagnose or function as an emergency service.

Definition of done
Help content is visible and easy to find.
Urgent support reminder exists in the correct places.

Phase 13 — Accessibility, Performance, and Error Handling
Goal
Make the product usable for anxious, rushed, and diverse users.

Accessibility tasks
semantic headings
keyboard navigation
visible focus states
screen reader-friendly labels
readable contrast
no colour-only meaning
large tap targets on mobile

Performance tasks
fast page loads
lightweight UI
sensible loading boundaries
efficient list rendering for resources

Error-state tasks
resource failed to load
invalid or expired session code
insufficient data for Patterns or Review
hidden or inaccessible feature paths

Definition of done
Key flows are keyboard-usable.
Errors are calm and clear.
Empty states feel supportive.

Phase 14 — QA and Launch Hardening
Goal
Check that the product matches the brief before production.

Privacy QA
confirm no stored free text in therapeutic flows
confirm summaries contain no identifiers
confirm session temporary data deletes fully
confirm analytics separation

Role QA
young person permissions correct
parent permissions correct
practitioner permissions correct
trainee permissions correct
admin permissions correct

Feature QA
onboarding
resource browsing
content management
mood check-in
weekly review
patterns
exports
Session Companion
analytics
help and support

Device QA
mobile web
tablet
desktop

Content QA
core V1 resources loaded
categories correct
sections correct
statuses correct
sort order correct

User testing recommendation
Run at least one short test round with:
young person users or realistic proxies
parents/carers
practitioners

Prioritise fixes for:
unclear onboarding
misunderstood privacy model
confusing wording
friction in Session Companion

This aligns with the need for kind, emotionally clear design.

Definition of done
Critical flows pass.
Privacy model is intact.
Product is credible and launch-ready.

Suggested Timeline
Sprint 1
project foundation
schema
auth and roles

Sprint 2
app shell
navigation
resource library
CMS

Sprint 3
mood check-in
review of the past 7 days
patterns

Sprint 4
exports
Session Companion

Sprint 5
analytics
help and support
accessibility
pass QA
hardening

Sprint 6
content loading
user testing
launch fixes
production deploy

Team Roles
Founder / Product lead
approves scope
approves content
reviews flows
validates emotional tone

Claude Code
scaffolds codebase
implements features in sequence
follows schema and privacy constraints

Optional human developer
reviews architecture
checks deployment setup
handles edge-case debugging

Content/admin owner
loads resources
manages visibility
maintains content quality

Claude Code Working Method
Claude Code should be used feature-by-feature.

Good prompt pattern
Build the Mood Check-In feature using the rules in /docs.
Requirements:
- mood slider 0–10
- anxiety slider 0–10
- fixed emotion multi-select
- fixed context selections
- fixed coping strategies
- no free text
- save to mood_checkins table
- mobile-first
- calm and supportive UI
Return:
- routes created
- components created
- schema changes if needed
- test plan

Working rule
Never ask Claude to build the whole app in one prompt.
Use this sequence: scaffold auth resources mood check-in review patterns exports Session Companion analytics polish
This reduces drift and improves reliability.

Launch Checklist
Before production, confirm:
all four roles can access correct experiences
no therapeutic free text is stored
resource library is populated
weekly review works
pattern prompts work
Session Companion expires and deletes correctly
analytics are anonymous
help and support content is live
admin can manage resources without code changes

Final Instruction Summary for Claude Code
Build a full V1 privacy-first CAMHS CBT companion web app based on the approved product blueprint.
Follow these non-negotiables:
support young people, parents/carers, practitioners, and trainees
use structured therapeutic inputs only
do not store free text in therapeutic workflows
keep analytics separate and anonymous
implement temporary Session Companion collaboration with expiry and deletion
support safeguarding through pattern prompts and signposting
make the experience calm, clear, supportive, and non-judgmental
prioritise mobile-friendly usability and low clinician burden

Use the build order in this document exactly unless a dependency requires a small adjustment.