app-flow-pages-and-roles.md
Purpose
This document defines the page structure, role visibility, and main user journeys for V1 of the privacy-first CAMHS CBT companion. It translates the approved product brief into a clear navigation and permissions blueprint for Claude Code, so routing, visibility, and user flows are consistent from the start.

Product Roles
V1 supports five practical role types.

1. Young Person
Usually ages 11–18.
Purpose: complete structured check-ins
review recent patterns
access CBT resources
join temporary Session Companion sessions

2. Parent / Carer
Supports younger users and may lead use for children under 11.
Purpose: access parent-facing resources
print worksheets
support child work outside sessions

3. Practitioner
CAMHS clinician.
Purpose: access resources
start Session Companion
view anonymous service insights

4. Trainee Practitioner
Clinician in training.
Purpose: use most practitioner tools
access resources
view service insights where permitted

5. Admin
Operational/content management role.
Purpose: manage resources
manage visibility and ordering
maintain content without code changes
This role may overlap with practitioner or founder/admin usage.

Top-Level Site Map
These are the main V1 pages.
Home / Dashboard
Mood Check-In
Review of the Past 7 Days
Patterns
Resources
Session Companion
Help and Support
Service Insights
Admin / Content Management
Authentication / Onboarding
This matches the core information architecture in the brief.

Page List and Purpose
1. Authentication / Onboarding
Purpose
Handle sign up, sign in, role selection, age-aware onboarding, and consent/awareness flows.
Includes
sign in
sign up
role selection
age band step
parental awareness step where required
post-onboarding routing
Notes
This is the gatekeeper for permissions and must be completed before role-specific pages are shown.

2. Home / Dashboard
Purpose
Provide a calm landing page tailored to the user’s role.
Young person dashboard may include
quick access to Mood Check-In
recent activity status
shortcut to Review of the Past 7 Days
shortcut to Resources
supportive reminder content
Parent dashboard may include
parent-facing resources
printable materials
support guidance
child-support suggestions
Practitioner dashboard may include
start Session Companion
access resources
service insights summary
recent content updates
Admin dashboard may include
content actions
draft/published status overview
resource management shortcuts

3. Mood Check-In
Purpose
Allow structured emotional check-ins using fixed inputs only.
Includes
mood slider
anxiety slider
emotion selection
context selection
coping strategy selection
completion confirmation
Notes
This is a core young person feature. Parent-led use may apply in specific cases, but this is not a practitioner-facing workflow.

4. Review of the Past 7 Days
Purpose
Show a supportive summary of recent structured data.
Includes
number of check-ins
number of activities completed
common emotions
common coping strategies
potential discussion areas
supportive empty state when insufficient data exists
Notes
This is primarily for young people, with parent visibility only where appropriate.

5. Patterns
Purpose
Show careful trends based on repeated structured inputs.
Includes
repeated low mood patterns
repeated high anxiety patterns
repeated distress emotion patterns
help-seeking prompts
links to support guidance
Notes
Language must remain proportionate and non-diagnostic.

6. Resources
Purpose
Provide access to the content library.
Includes
category overview
Learn section
Activities section
resource detail pages
export actions where relevant
Core categories
Anxiety
Low Mood
Behavioural Challenges
Sleep
Notes
Resources are content, not app tools. Mood Check-In, Patterns, Review, and Session Companion do not live inside the resource library.

7. Session Companion
Purpose
Support temporary collaborative work in a therapy session.
Includes
practitioner start screen
code generation
young person join screen
temporary shared activity state
inactivity expiry handling
end-session cleanup
Notes
No permanent linking. No saved therapeutic free text. Session activity is temporary and deleted after expiry or session end.

8. Help and Support
Purpose
Provide static signposting, support reminders, and clear guidance.
Includes
help-seeking guidance
urgent support reminder
explanation of app limits
reassurance about privacy boundaries
Notes
The page must make clear the app is not an emergency service.

9. Service Insights
Purpose
Show anonymous, aggregated usage trends at service level.
Includes
most viewed resources
most used categories
export activity
activity completion trends
check-in frequency trends
Notes
No individual young person data should appear here.

10. Admin / Content Management
Purpose
Allow non-developer content maintenance.
Includes
add resource
edit resource
hide/archive/delete resource
reorder resources
update visibility
upload or replace templates/files
manage status: draft, published, hidden, archived
Notes
This is essential to V1 and should not require code changes for normal content updates.

Navigation Structure
Navigation should be simple, stable, and role-aware.

Core navigation for young person
Home
Check-In
Review
Patterns
Resources
Support

Core navigation for parent / carer
Home
Resources
Support
Optional: Review or child-support areas only if product rules allow parent-led visibility

Core navigation for practitioner
Home
Resources
Session Companion
Service Insights
Support

Core navigation for trainee practitioner
Home
Resources
Session Companion
Service Insights
Support
With limited access if configured.

Core navigation for admin
Home
Resources
Admin
Service Insights
Support
Admin may also see practitioner pages if the same user has both permissions.

Role Access Matrix
Feature / Page	Young Person	Parent / Carer	Practitioner	Trainee	Admin
Sign in / onboarding	Yes	Yes	Yes	Yes	Yes
Home / Dashboard	Yes	Yes	Yes	Yes	Yes
Mood Check-In	Yes	Limited / if applicable	No	No	No
Review of the Past 7 Days	Yes	Limited / if applicable	No	No	No
Patterns	Yes	Limited / if applicable	No	No	No
Resources	Yes	Yes	Yes	Yes	Yes
Session Companion join	Yes	No	No	No	No
Session Companion start/manage	No	No	Yes	Yes	Optional
Help and Support	Yes	Yes	Yes	Yes	Yes
Service Insights	No	No	Yes	Limited / Yes	Yes
Admin / Content Management	No	No	Optional by permission	Optional by permission	Yes
This reflects the permission logic described in the brief.

Onboarding Flow by Role
Young Person onboarding
Steps
Choose role: young person
Confirm age band
Apply age logic
Show privacy explanation
Route to dashboard
Age logic
Under 11: redirect toward parent-led use model
11–15: allow account with parental awareness flow
16–18: allow independent use
This age logic is a core product rule.

Parent / Carer onboarding
Steps
Choose role: parent/carer
Read support purpose explanation
Create account
Route to parent dashboard

Practitioner onboarding
Steps
Choose role: practitioner
Create account
Read privacy/session companion guidance
Route to practitioner dashboard
Important principle
Practitioners should not need to create or manage patient accounts before using the platform meaningfully.

Trainee practitioner onboarding
Steps
Choose role: trainee
Create account
Route to trainee dashboard
Access can mirror practitioner with some optional restrictions.

Admin onboarding
Steps
Admin account provisioned
Sign in
Route to admin dashboard/content area

Primary User Journeys
Each journey is kept to 3 steps max.

Young person journey: daily support
Open dashboard and complete Mood Check-In
Review recent trends or the past 7 days
Open a relevant resource or activity

Young person journey: therapy session support
Receive session code from practitioner
Join Session Companion
Complete temporary shared activity during session

Parent journey
Open parent dashboard
Browse support resources or printable templates
Use material with child outside the app

Practitioner journey: in-session collaboration
Start Session Companion
Share temporary code with young person
Review temporary shared activity together

Practitioner journey: service insight
Open Service Insights
Review anonymous engagement trends
Use insight to inform content/service decisions

Admin journey
Open content management
Add, edit, reorder, or archive resources
Publish updates without code changes

Routing and Visibility Rules
Rule 1: hide what a role cannot use
Do not expose irrelevant navigation items.
Example: practitioners should not see Mood Check-In
young people should not see Service Insights

Rule 2: explain blocked access calmly
If a protected route is reached directly, show a clear explanation rather than a broken page.
Example: "This area is not available for your account."

Rule 3: empty states must be supportive
If data does not yet exist, guide the user gently.
Example: "Once you’ve completed a few check-ins, your review will appear here."

Rule 4: session companion routes are temporary
Joined sessions should always validate: active code
active session
not expired
correct join state
Expired codes should route to a calm retry page.

Rule 5: resources use role visibility filters
A user should only see resources mapped to their role.
This is especially important for parent-facing vs practitioner-facing content.

Recommended Route Map
/auth/sign-in
/auth/sign-up
/onboarding/role
/onboarding/age
/onboarding/parental-awareness
/home
/check-in
/review
/patterns
/resources
/resources/:category
/resources/:category/:section
/resources/:resourceId
/session-companion
/session-companion/start
/session-companion/join
/session-companion/:sessionCode
/support
/service-insights
/admin
/admin/resources
/admin/resources/new
/admin/resources/:resourceId/edit
Claude Code can adapt route structure slightly, but the page logic should remain the same.

Page-Level UX Rules
Home
most important action first
minimal clutter
role-relevant shortcuts only

Check-In
single clear task flow
one emotional step at a time
reassuring completion state

Review
summary first
detail second
clear empty state if not enough data

Patterns
gentle wording
no over-interpretation
clear path to support

Resources
easy scanning
category-first browsing
obvious export actions

Session Companion
temporary nature clearly explained
active session state obvious
expiry messaging calm and clear

Service Insights
aggregation only
readable charts/cards
no identifiable records

Admin
task-first layout
clear status indicators
bulk mental load kept low

Safeguarding and Support Flow Rules
The product must support, notice, remind, and signpost. It must not feel like surveillance or crisis monitoring.
Where support prompts can appear
Patterns page
Review page
Help and Support page
relevant check-in follow-up areas
Where urgent support reminder should appear
Help and Support page
persistent support areas when patterns remain high
selected safeguarding prompt states
Messaging rule
Use gentle, plain language.
Example: "It might help to speak with a trusted adult, your CAMHS practitioner, GP, or another support person."

Content Model Notes
Resources are separate from app tools
Do not model these as resources: Mood Check-In
Review of the Past 7 Days
Patterns
Session Companion
Resource structure
Every resource belongs to: one category
one section
one or more visible roles
one status
optional session number
optional journey step
This should drive browsing and admin logic.

Final Build Guidance for Claude Code
When implementing routes, layouts, and permissions:
start with role logic first
keep navigation minimal
make dashboards role-specific
keep therapeutic flows single-purpose
hide inaccessible features
use supportive empty and error states
ensure Session Companion routes expire cleanly
maintain strict separation between therapeutic tools, resources, admin, and analytics
The final app should feel clear, safe, and emotionally calm, while remaining easy for practitioners and admins to use.