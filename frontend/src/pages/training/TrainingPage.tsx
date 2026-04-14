import { useState } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Assignment data ───────────────────────────────────────────────────────────

interface Assignment {
  title: string;
  module: string;
  due: string;
  status: "upcoming" | "due-soon" | "overdue";
  notes?: string;
}

const ASSIGNMENTS: Assignment[] = [
  {
    title: "Case Conceptualisation Write-Up",
    module: "Module 4 — Low-Intensity CBT Interventions",
    due: "End of Week 6",
    status: "upcoming",
    notes: "Include a full formulation using the five-areas model. Reference at least three peer-reviewed sources.",
  },
  {
    title: "Reflective Practice Log",
    module: "Module 5 — Supervision and Reflective Practice",
    due: "End of Term 1",
    status: "upcoming",
    notes: "Three reflective entries minimum. Use the Gibbs reflective cycle. Include one entry from a supervision session.",
  },
  {
    title: "Clinical Skills Assessment — Session Recording",
    module: "Module 3 — Assessment and Engagement",
    due: "Week 8",
    status: "due-soon",
    notes: "Submit a 20-minute recorded session with consent forms. Include a written self-evaluation.",
  },
  {
    title: "Practice Placement Report",
    module: "Placement — Clinical Practice",
    due: "End of Placement",
    status: "upcoming",
    notes: "Complete the placement competency sign-off form with your supervisor before submission.",
  },
  {
    title: "Literature Review — Evidence Base for Low-Intensity CBT",
    module: "Module 2 — Research and Evidence",
    due: "Week 10",
    status: "upcoming",
    notes: "2,500 words. Focus on one presenting problem (e.g. anxiety or low mood in young people).",
  },
];

// ── Top tips data ─────────────────────────────────────────────────────────────

interface TopTip {
  title: string;
  body: string;
  tag: string;
}

const TOP_TIPS: TopTip[] = [
  {
    title: "Complete supervision notes within 48 hours",
    body: "Notes are more accurate and useful when completed promptly. Use your supervision template and record both what was discussed and what you plan to do differently.",
    tag: "Supervision",
  },
  {
    title: "Review risk at the start of every session",
    body: "Always check your client's risk status before starting. If anything has changed since the last session, address it before moving on to the intervention.",
    tag: "Safety",
  },
  {
    title: "Use the five-areas model to structure formulations",
    body: "Thoughts, feelings, physical sensations, behaviours, and environment. A clear formulation helps both you and the young person understand what keeps the problem going.",
    tag: "Clinical skills",
  },
  {
    title: "Keep your learning log up to date weekly",
    body: "A brief weekly entry is easier than trying to reconstruct three months at the end of term. Reflect on what went well, what was challenging, and what you'd do differently.",
    tag: "Reflective practice",
  },
  {
    title: "Consent must be obtained and documented before every intervention",
    body: "Check that consent forms are signed and on file. For under-16s, ensure parental or carer awareness is documented. Never assume consent carries over from a previous contact.",
    tag: "Ethics & governance",
  },
  {
    title: "Use the resource library to plan sessions",
    body: "Browse the worksheets in advance and select ones appropriate to the client's current session. Having the right materials ready supports a smooth, structured session.",
    tag: "Preparation",
  },
  {
    title: "Stay within your scope of practice",
    body: "If a presentation feels too complex or outside your training, raise it in supervision promptly. It's a strength to recognise the limits of your competence, not a weakness.",
    tag: "Professional practice",
  },
  {
    title: "Debrief after difficult sessions",
    body: "If a session was emotionally challenging, speak to your supervisor or a trusted colleague the same day where possible. Reflecting promptly helps you process and protects your wellbeing.",
    tag: "Self-care",
  },
];

// ── Scripts data ─────────────────────────────────────────────────────────────

interface Script {
  title: string;
  context: string;
  tag: string;
  lines: Array<{ speaker: "trainee" | "note"; text: string }>;
}

const SCRIPTS: Script[] = [
  {
    title: "Opening a First Session",
    context: "Use this at the very start of your first meeting. The goal is to help the young person feel at ease, explain confidentiality clearly, and set expectations for what working together will look like.",
    tag: "Session structure",
    lines: [
      { speaker: "trainee", text: "Hi, it's really good to meet you. I'm [name], and I work as part of the CAMHS team. Thanks for coming in today — I know it can feel a bit nerve-wracking the first time." },
      { speaker: "note",    text: "Pause and allow them to respond. Don't rush past this moment." },
      { speaker: "trainee", text: "Before we get started, I want to explain a bit about how these sessions work and what to expect. Is that okay?" },
      { speaker: "trainee", text: "What we talk about in here is confidential — that means I won't share it with anyone outside the team without telling you first. The only exception is if I'm worried that you or someone else might be at serious risk of harm. In that case, I'd need to let someone know, but I'd always try to talk to you about it first." },
      { speaker: "trainee", text: "These sessions are really about you. I'm not here to tell you what to do or to judge anything you share. My job is to help you understand what's been going on and work out some ways to make things feel more manageable." },
      { speaker: "note",    text: "Check understanding: 'Does that all make sense? Is there anything you'd like to ask before we start?'" },
      { speaker: "trainee", text: "So — in your own words, can you tell me a little about what's been going on for you lately, and what made you decide to come and talk to someone?" },
    ],
  },
  {
    title: "Explaining the CBT Model to a Young Person",
    context: "Introduce the cognitive-behavioural model in session one or two. Keep it concrete and collaborative — use their own example where possible rather than a generic one.",
    tag: "Psychoeducation",
    lines: [
      { speaker: "trainee", text: "I'd like to explain a bit about the way we'll be working together, because I think it can really help to understand why we do what we do. Is that okay?" },
      { speaker: "trainee", text: "So, the approach is called CBT — Cognitive Behavioural Therapy. It sounds quite technical but the idea is actually pretty simple." },
      { speaker: "trainee", text: "Basically, the way we think about things, the way we feel in our body, and the things we do are all connected — they affect each other. Sometimes those connections keep us stuck in patterns that aren't helpful." },
      { speaker: "note",    text: "Draw a simple three-circle diagram or use the whiteboard if available: Thoughts → Feelings → Behaviours → (back to Thoughts)." },
      { speaker: "trainee", text: "For example, if someone thinks 'everyone at school thinks I'm weird', they might feel really anxious. And if they feel anxious, they might avoid going in. And avoiding it makes the thought feel even more true. Does that kind of make sense?" },
      { speaker: "trainee", text: "What we'll do together is look at your own version of this cycle — what thoughts come up for you, how that affects how you feel and what you do — and start to find some ways to break that cycle." },
      { speaker: "note",    text: "Invite them to try applying it: 'Can you think of a recent time when you felt [presenting problem]? What was going through your mind?'" },
    ],
  },
  {
    title: "Introducing Mood Check-ins",
    context: "Introduce the idea of regular mood tracking early in the programme. Frame it as something that helps both of you, not as homework for its own sake.",
    tag: "Assessment",
    lines: [
      { speaker: "trainee", text: "One thing I'd like us to do each week is spend a couple of minutes at the start checking in on how you've been feeling since we last spoke. Does that sound okay?" },
      { speaker: "trainee", text: "It's not a test — there are no right or wrong answers. It just helps me understand how things have been going for you, and over time it helps us both see whether things are shifting." },
      { speaker: "trainee", text: "I'll ask you to rate your mood and anxiety on a scale of zero to ten — zero being really low or really calm, ten being really high. And I might ask you which emotions best describe how you've been feeling." },
      { speaker: "note",    text: "Demonstrate with the current session: 'So for today, what would you say your mood is on that scale?'" },
      { speaker: "trainee", text: "There's no pressure to explain every number — sometimes a number is just a number. But if something feels particularly high or low, we can talk about what's been going on." },
      { speaker: "trainee", text: "The app we use also lets you log this yourself between sessions, which some people find helpful — but it's completely optional." },
    ],
  },
  {
    title: "Explaining the Five-Areas Model",
    context: "Use this when introducing the formulation framework, typically in sessions one or two. The five-areas model maps the situation, thoughts, emotions, physical feelings, and behaviours.",
    tag: "Psychoeducation",
    lines: [
      { speaker: "trainee", text: "I want to introduce a way of making sense of what's been happening for you. It's called the five-areas model, and it's basically a map that helps us see how different parts of your experience connect." },
      { speaker: "note",    text: "Write or draw the five areas: Life situation → Thoughts → Emotions → Physical feelings → Behaviours." },
      { speaker: "trainee", text: "The five areas are: what's going on in your life — your situation; the thoughts that come up; the emotions you feel; the physical sensations in your body; and the things you do or don't do as a result." },
      { speaker: "trainee", text: "None of these areas happens in isolation — they all feed into each other. When something difficult happens, it triggers thoughts, which affect your emotions, which affect your body, which affects what you do. And what you do then feeds back into the situation." },
      { speaker: "trainee", text: "The reason this is useful is that if we can spot where the cycle is getting stuck — whether it's a particular thought pattern, or something you're doing to cope that keeps the problem going — we can start to make changes there." },
      { speaker: "note",    text: "Apply it to their experience: 'Can we try mapping out a recent difficult moment using these five areas? Where would you start?'" },
      { speaker: "trainee", text: "This isn't about blaming yourself for anything — these patterns make complete sense given what you've been through. We're just trying to understand them clearly so we can work out the best way to help." },
    ],
  },
  {
    title: "Closing a Session and Setting Homework",
    context: "Use this structure at the end of every session. A clear close reinforces what was covered, sets up between-session practice, and keeps the young person engaged in the work.",
    tag: "Session structure",
    lines: [
      { speaker: "trainee", text: "We're getting close to the end of our time today, so I'd like to take a few minutes to look back at what we've covered." },
      { speaker: "note",    text: "Briefly summarise the main points from the session — keep it to two or three key things." },
      { speaker: "trainee", text: "Before we finish, I'd like to suggest something to try between now and next time. The idea behind between-session practice is that the work we do here is most useful when you get a chance to try it out in real life." },
      { speaker: "trainee", text: "So for this week, I'd like you to [describe specific task — e.g. try the breathing exercise once a day / keep a brief activity diary / notice when the thought pattern comes up]. Does that feel manageable?" },
      { speaker: "note",    text: "Negotiate if needed — it's better to agree on something small and achievable than something ambitious they won't do." },
      { speaker: "trainee", text: "It doesn't need to be perfect. Even if you try it once and it doesn't feel like it worked, that's really useful information for us to talk about next time." },
      { speaker: "trainee", text: "Is there anything you'd like to check in about before we finish? How are you feeling at the end of today's session compared to when you came in?" },
      { speaker: "trainee", text: "Okay — same time next week. Take care of yourself, and don't hesitate to contact the service if anything feels urgent before we meet again." },
    ],
  },
  {
    title: "Responding When a Young Person Discloses Risk",
    context: "This script is for moments when a young person discloses thoughts of self-harm, suicide, or serious risk to themselves or others. Stay calm, take it seriously, and follow your service's safeguarding protocol. Do not attempt to manage this alone.",
    tag: "Safeguarding",
    lines: [
      { speaker: "note",    text: "Do not panic or change your tone abruptly. Maintain a calm, warm presence. Allow silence if needed." },
      { speaker: "trainee", text: "Thank you for telling me that — I know that can be really hard to say out loud, and I'm glad you did." },
      { speaker: "trainee", text: "I want to make sure I understand what you've shared. Can you tell me a bit more about what's been going through your mind?" },
      { speaker: "note",    text: "Listen carefully. Clarify: Are these thoughts? Plans? Has anything happened already? Do not minimise or reassure prematurely." },
      { speaker: "trainee", text: "I want to be honest with you — what you've shared is something I need to take seriously, because I care about keeping you safe. That means I'll need to let my supervisor know what you've told me." },
      { speaker: "trainee", text: "That doesn't mean you're in trouble, or that you've done anything wrong. It means we want to make sure the right support is in place for you." },
      { speaker: "note",    text: "If the risk is immediate: 'I need to speak to my supervisor right now — I'm going to step out briefly and will be back in a moment. Please stay here.' Do not leave the young person alone if risk is acute." },
      { speaker: "trainee", text: "Before I do that — is there anything else you want me to know? Is there anyone around you at home who knows how you've been feeling?" },
      { speaker: "note",    text: "After speaking to your supervisor: document the disclosure, the risk level assessed, the actions taken, and who was informed. Follow your service's safeguarding pathway." },
    ],
  },
];

// ── Status styles ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<Assignment["status"], string> = {
  upcoming:   "bg-muted text-muted-foreground",
  "due-soon": "bg-amber-100 text-amber-800",
  overdue:    "bg-destructive/10 text-destructive",
};

const STATUS_LABELS: Record<Assignment["status"], string> = {
  upcoming:   "Upcoming",
  "due-soon": "Due soon",
  overdue:    "Overdue",
};

// ── Page component ────────────────────────────────────────────────────────────

export default function TrainingPage() {
  const [view, setView] = useState<"assignments" | "tips" | "scripts">("assignments");
  const [expandedScript, setExpandedScript] = useState<string | null>(null);

  return (
    <AppLayout>
      <div className="space-y-lg">
        <header>
          <h1 className="text-h2 text-foreground">Assignments &amp; Top Tips</h1>
          <p className="mt-xs text-body text-muted-foreground">
            Track your training assignments and keep key clinical reminders close to hand.
          </p>
        </header>

        {/* Sub-navigation */}
        <div className="flex gap-sm border-b border-border pb-md">
          <button
            type="button"
            onClick={() => setView("assignments")}
            className={`rounded-full px-md py-xs text-body transition-colors ${
              view === "assignments"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Assignments
          </button>
          <button
            type="button"
            onClick={() => setView("tips")}
            className={`rounded-full px-md py-xs text-body transition-colors ${
              view === "tips"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Top Tips
          </button>
          <button
            type="button"
            onClick={() => setView("scripts")}
            className={`rounded-full px-md py-xs text-body transition-colors ${
              view === "scripts"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Scripts
          </button>
        </div>

        {/* Assignments view */}
        {view === "assignments" && (
          <div className="space-y-md">
            <p className="text-caption text-muted-foreground">
              Upcoming and recent assignment deadlines for your training programme.
            </p>
            {ASSIGNMENTS.map((a) => (
              <div
                key={a.title}
                className="rounded-xl border border-border bg-card p-lg space-y-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-sm">
                  <h3 className="text-body font-semibold text-foreground">{a.title}</h3>
                  <span className={`rounded-full px-sm py-xs text-caption font-medium ${STATUS_STYLES[a.status]}`}>
                    {STATUS_LABELS[a.status]}
                  </span>
                </div>
                <p className="text-caption text-muted-foreground">{a.module}</p>
                <p className="text-caption text-foreground">
                  <span className="font-medium">Due:</span> {a.due}
                </p>
                {a.notes && (
                  <p className="text-caption text-muted-foreground border-t border-border pt-sm">
                    {a.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Top tips view */}
        {view === "tips" && (
          <div className="space-y-md">
            <p className="text-caption text-muted-foreground">
              Key reminders and best-practice tips for your clinical placement and training.
            </p>
            {TOP_TIPS.map((tip) => (
              <div
                key={tip.title}
                className="rounded-xl border border-border bg-card p-lg space-y-sm"
              >
                <Badge variant="secondary">{tip.tag}</Badge>
                <h3 className="text-body font-semibold text-foreground">{tip.title}</h3>
                <p className="text-caption text-muted-foreground leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        )}
        {/* Scripts view */}
        {view === "scripts" && (
          <div className="space-y-md">
            <p className="text-caption text-muted-foreground">
              Suggested scripts for common clinical situations. These are guides, not rigid scripts — adapt them to the young person in front of you.
            </p>
            {SCRIPTS.map((script) => {
              const isOpen = expandedScript === script.title;
              return (
                <div
                  key={script.title}
                  className="rounded-xl border border-border bg-card overflow-hidden"
                >
                  {/* Header — always visible */}
                  <button
                    type="button"
                    onClick={() => setExpandedScript(isOpen ? null : script.title)}
                    className="w-full p-lg text-left flex items-start justify-between gap-md"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-xs">
                      <Badge variant="secondary">{script.tag}</Badge>
                      <h3 className="text-body font-semibold text-foreground">{script.title}</h3>
                      <p className="text-caption text-muted-foreground">{script.context}</p>
                    </div>
                    <span className="mt-xs shrink-0 text-muted-foreground text-caption">
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Script lines — expanded */}
                  {isOpen && (
                    <div className="border-t border-border px-lg pb-lg pt-md space-y-sm">
                      {script.lines.map((line, i) => (
                        line.speaker === "note" ? (
                          <p
                            key={i}
                            className="text-caption text-muted-foreground italic pl-md border-l-2 border-muted"
                          >
                            {line.text}
                          </p>
                        ) : (
                          <div
                            key={i}
                            className={cn(
                              "rounded-lg px-md py-sm text-body leading-relaxed",
                              "bg-primary/8 text-foreground border border-primary/20"
                            )}
                          >
                            <span className="text-caption font-semibold text-primary mr-sm">You:</span>
                            {line.text}
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
