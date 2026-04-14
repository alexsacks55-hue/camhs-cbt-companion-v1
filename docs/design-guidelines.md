design-guidelines.md
Emotional Design Thesis
Feels like a calm studio in Copenhagen — minimal, warm, deliberate, and quietly supportive. The interface should help users feel safe, capable, and guided, never judged or monitored. Every interaction should communicate clarity, patience, and emotional safety.

This is particularly important because the product supports young people engaging with mental health work. The system should behave like a kind companion, not a clinical system or performance tracker.

Core Design Principles
1. Calm Before Complexity
Every screen should feel lightweight and breathable.
Avoid:
dense dashboards
clinical tables
excessive visual hierarchy
overwhelming feature menus
Use:
generous spacing
soft visual anchors
simple choices

2. Emotional Safety
The UI must avoid creating feelings of:
judgement
evaluation
performance pressure
surveillance
Instead promote:
curiosity
reflection
gentle encouragement
Example: Instead of "Your mood has been low recently."
Use "It looks like things may have been difficult recently."

3. Predictable Navigation
Users may be anxious or rushed. Therefore:
navigation should stay consistent
primary actions should always be obvious
avoid hidden interactions
avoid unexpected modal interruptions

4. Gentle Progress Signals
Progress cues should feel supportive, not competitive.
Avoid:
streak counters
leaderboards
achievement badges
Prefer:
simple completion acknowledgement
reflective summaries
encouraging microcopy

Typography System
Typography should feel calm, readable, and human.
Font Style
Use a modern neutral sans-serif.
Good options:
Inter
Source Sans
System UI stack
These fonts are accessible and highly readable across devices.

Typographic Hierarchy
Element	Size	Weight	Purpose
H1	32px	600	Page titles
H2	24px	600	Section headings
H3	20px	500	Subsections
Body	16px	400	Primary content
Caption	14px	400	Helper text
Line height should be 1.5× or greater to improve readability.

Tone in Typography
Typography should feel:
calm
confident
friendly
neutral
Avoid:
playful novelty fonts
harsh condensed styles
overly clinical typefaces

Color System
The palette should communicate:
calm
warmth
emotional safety
neutrality
Avoid aggressive contrast or alarm-style colours.

Primary Palette
Soft neutral tones provide the foundation.
Primary background: #F7F8FA
Surface: #FFFFFF
Primary text: #1F2933
Secondary text: #4B5563

Accent Palette
Gentle accent colours can represent sections or states.
Calm blue: #4F7CAC
Soft teal: #6BAF92
Warm sand: #E9D8A6
Muted lavender: #9A8BC1
These colours should be used sparingly.

Semantic Colours
Used for system feedback.
Success: #6BAF92
Info: #4F7CAC
Warning: #E9D8A6
Error: #E07A7A
Error colours should appear soft and supportive, not alarming.

Contrast Requirements
All colour combinations must meet WCAG AA minimum contrast (4.5:1).
Important text should always remain readable in:
light environments
dark environments
smaller screens

Spacing and Layout
Use an 8-point spacing system.
Core spacing scale
Unit	Size
xs	4px
sm	8px
md	16px
lg	24px
xl	32px
xxl	48px
Spacing should feel generous and breathable.

Layout Principles
Mobile-first layouts
Single-column content flows for most screens
Avoid multi-column complexity for therapeutic tasks
Max readable width ~700px for content

Responsive Breakpoints
Device	Width
Mobile	<640px
Tablet	640–1024px
Desktop	>1024px
Mobile experience should be the primary design target.

Motion and Interaction
Motion should feel gentle and reassuring, never distracting.
Motion Timing
Use subtle durations:
150–200ms for micro interactions
200–300ms for page transitions
Motion Style
Preferred motion types:
soft fade transitions
subtle elevation on hover
gentle scale feedback for taps
Avoid:
bouncing animations
flashy transitions
large movement animations

Microinteractions Examples
Button hover: slight elevation, subtle shadow
Mood check-in slider: smooth movement, responsive feedback
Completion state: gentle confirmation message
Example: "Thanks for checking in today."

Voice and Tone
The copy voice should be:
calm
respectful
supportive
non-patronising
clear
Avoid:
clinical language
overly cheerful positivity
blame-focused language

Microcopy Examples
Onboarding: "Welcome. This space is here to help you reflect, learn, and notice patterns over time."
Success message: "Your check-in has been recorded."
Error state: "We couldn’t load this page right now. Please try again."
Pattern prompt: "It looks like things may have been difficult recently. It might help to speak with a trusted adult or your CAMHS practitioner."

System Consistency
Recurring UI patterns help reduce cognitive load.
Primary navigation
Simple top or bottom navigation with:
Dashboard
Check-In
Review
Resources
Support
Role-based features appear when relevant.

Card Components
Content should use calm card-based layouts.
Cards should have:
soft shadows
rounded corners
generous padding
This makes the interface feel approachable.

Form Inputs
Forms should use:
large tap targets
simple labels
clear selection states
Structured selections should be visually clear and accessible.

Accessibility Standards
Accessibility must be built into every interface decision.
Required behaviours
semantic HTML structure
keyboard navigation support
visible focus states
screen reader-friendly labels
alt text for images
Readability
Minimum text size: 16px body text
Avoid long dense paragraphs. Use short sections and bullet points.

Interaction Accessibility
Buttons and selectable items should be at least:
44px height
This supports mobile usability and motor accessibility.

Emotional Audit Checklist
Before finalising any interface component, ask:
Does this screen feel calm or overwhelming?
Would a young person feel supported here?
Could a stressed user understand this quickly?
Does this language avoid judgement?
Does the UI encourage reflection rather than evaluation?
If any answer is no, redesign.

Technical QA Checklist
Before shipping UI changes, verify:
typography hierarchy is consistent
spacing follows the 8-point grid
colours meet contrast standards
hover/focus states exist
keyboard navigation works
motion durations remain within guidelines

Design Snapshot
Emotional Thesis
Calm, supportive, and quietly encouraging — like a thoughtful companion sitting beside you while you reflect.

Color Palette
Background: #F7F8FA
Surface: #FFFFFF
Primary text: #1F2933
Secondary text: #4B5563
Calm blue: #4F7CAC
Soft teal: #6BAF92
Warm sand: #E9D8A6
Muted lavender: #9A8BC1

Typography Scale
Element	Size
H1	32px
H2	24px
H3	20px
Body	16px
Caption	14px

Layout System
8-point spacing grid
mobile-first layout
max readable width ~700px
single-column therapeutic flows

Design Integrity Review
The design system aligns strongly with the product’s emotional goal: calm support without judgement. The restrained palette, generous spacing, and soft motion patterns help ensure the interface feels approachable for young people while still credible for clinicians. One improvement to explore later would be adaptive emotional theming, where colour accents subtly shift depending on the user’s recent engagement patterns to reinforce a sense of personal progression while maintaining calm neutrality.