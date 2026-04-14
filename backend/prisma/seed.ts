/**
 * Resource library seed — CAMHS CBT Companion
 *
 * Source of truth: /RESOURCE_LIBRARY_CONTENT.md
 * Run with: npx tsx prisma/seed.ts  (or via `npm run seed`)
 *
 * This script is idempotent: it deletes all existing resources first,
 * then re-creates them from the content file above.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Types ─────────────────────────────────────────────────────────────────────

type Role = "young_person" | "parent_carer" | "practitioner" | "trainee_practitioner";

interface ExternalLink {
  label: string;
  url: string;
}

interface ResourceSeed {
  title: string;
  description: string;
  body_text?: string;
  external_links?: ExternalLink[];
  category: "anxiety" | "low_mood" | "behavioural_challenges" | "sleep";
  section: "learn" | "activities";
  status: "published";
  export_type: "none" | "blank_template";
  journey_step?: "understand" | "try_it" | "practise" | "review" | null;
  content_type: "text" | "pdf";
  file_url?: string | null;
  typical_session?: number | null;
  sort_order: number;
  visibility: Role[];
}

// ── Visibility sets ───────────────────────────────────────────────────────────

const ANXIETY_VISIBILITY: Role[] = ["young_person", "practitioner", "trainee_practitioner"];
const LOW_MOOD_VISIBILITY: Role[] = ["young_person", "practitioner", "trainee_practitioner"];
const BC_VISIBILITY: Role[] = ["parent_carer", "practitioner", "trainee_practitioner"];
const SLEEP_VISIBILITY: Role[] = ["young_person", "parent_carer", "practitioner", "trainee_practitioner"];

// ── Resources ─────────────────────────────────────────────────────────────────

const resources: ResourceSeed[] = [

  // ════════════════════════════════════════════════════════════════════════════
  // ANXIETY — Learn
  // ════════════════════════════════════════════════════════════════════════════

  {
    title: "What is the Anxiety Programme?",
    description: "An introduction to the Facing Fears and Challenges programme — what it covers and how it works.",
    body_text: `Anxiety is a completely normal part of life — it's the body's way of keeping us safe. But sometimes anxiety can start to feel overwhelming, causing us to avoid situations, worry constantly, or feel like our body is going into overdrive even when there's no real danger.

This programme, called Facing Fears and Challenges, is a guided self-help approach that helps young people understand what keeps their anxiety going and take gradual steps to face the things they've been avoiding. Rather than trying to get rid of anxiety altogether, the focus is on learning that anxiety is manageable — and that facing fears step by step, at your own pace, is the most effective way to get back to doing the things that matter to you.

Sessions typically run for around 5 to 8 appointments, with some possible by phone.`,
    category: "anxiety",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 0,
    sort_order: 0,
    visibility: ANXIETY_VISIBILITY,
  },

  {
    title: "Session 0 — Identifying the Problem",
    description: "What happens in your first session — understanding the problem and starting to build a picture of what's going on.",
    body_text: `In this session you'll talk about what's been difficult and how it's affecting your life. You'll start to explore what might be keeping the problem going, and begin thinking about ways you can overcome it. Some questionnaires may be completed to help understand things in more detail.`,
    external_links: [
      { label: "Young Minds — Anxiety", url: "https://www.youngminds.org.uk/young-person/mental-health-conditions/anxiety/" },
      { label: "AnxietyCanada — Anxiety in Youth", url: "https://www.anxietycanada.com/learn-about-anxiety/anxiety-in-youth/" },
    ],
    category: "anxiety",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 0,
    sort_order: 1,
    visibility: ANXIETY_VISIBILITY,
  },

  {
    title: "Session 1 — Understanding Anxiety and How It Affects You",
    description: "Learning about what anxiety is, how it affects the body, and what keeps it going.",
    body_text: `In this session you'll learn about what anxiety actually is and why everyone experiences it — it's a completely normal alarm system that can sometimes go off when it doesn't need to. You'll explore how anxiety affects your body (the fight, flight, freeze response), look at the thoughts and behaviours that keep it going, start building a coping toolkit, and set some goals you'd like to work towards. You'll also think about who can support you — your back-up team.`,
    external_links: [
      { label: "Fight, Flight, Freeze — A Guide to Anxiety for Kids (YouTube)", url: "https://www.youtube.com/watch?v=pWp6kkz-pnQ" },
      { label: "AnxietyCanada — Youth anxiety information", url: "https://www.anxietycanada.com/learn-about-anxiety/anxiety-in-youth/" },
      { label: "Beacon House — Survival Animals Display Pack", url: "https://beaconhouse.org.uk/resources/" },
    ],
    category: "anxiety",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 1,
    sort_order: 10,
    visibility: ANXIETY_VISIBILITY,
  },

  {
    title: "Session 2 — Trying Out New Things",
    description: "Introducing the fear ladder — a step-by-step plan for gradually facing fears.",
    body_text: `This session introduces the core idea behind the programme: that avoiding things we're anxious about keeps fear going, while gradually approaching them helps it reduce. You'll build your personal fear ladder — a step-by-step plan of situations to face, from least to most anxiety-provoking — and plan your very first step.`,
    external_links: [
      { label: "AnxietyCanada — Facing Your Fears (for teens)", url: "https://www.anxietycanada.com/articles/facing-your-fears-exposure-for-teens/" },
    ],
    category: "anxiety",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 2,
    sort_order: 20,
    visibility: ANXIETY_VISIBILITY,
  },

  {
    title: "Sessions 3–6 — Facing Your Fears",
    description: "How the middle sessions work — reviewing exposure steps and working up the fear ladder.",
    body_text: `Each of these sessions follows the same shape: you review how the previous week's exposure step went, discuss what you learned from it, complete or plan the next step on your fear ladder, and keep building. Over these sessions you'll work steadily up your ladder, dropping unhelpful habits along the way and building real confidence that you can face the things that have been holding you back.

If worry, panic, or difficult thoughts are getting in the way of exposure, your practitioner may use some additional techniques alongside the main approach.`,
    external_links: [
      { label: "AnxietyCanada — Facing Your Fears", url: "https://www.anxietycanada.com/articles/facing-your-fears-exposure-for-teens/" },
      { label: "Kings CYP — Secondary anxiety manuals and supplements", url: "https://www.kings-cyp.com" },
    ],
    category: "anxiety",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 3,
    sort_order: 30,
    visibility: ANXIETY_VISIBILITY,
  },

  {
    title: "Session 7 — Progress Review and Problem Solving",
    description: "Reviewing how far you've come and learning a structured approach to real-life problems.",
    body_text: `In this session you'll look back at how far you've come by reviewing your questionnaires and goals. If there are any remaining areas to work on, you'll plan further steps. You'll also learn a structured problem-solving technique — a useful tool for tackling real-life challenges (as distinct from fears), which you can use long after the programme ends.`,
    external_links: [
      { label: "Young Minds — Coping with anxiety", url: "https://www.youngminds.org.uk/young-person/coping-with-life/anxiety/" },
    ],
    category: "anxiety",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 7,
    sort_order: 70,
    visibility: ANXIETY_VISIBILITY,
  },

  {
    title: "Session 8 — Staying Well",
    description: "The final session — making sure the progress you've made sticks.",
    body_text: `This final session is about making sure the progress you've made sticks long-term. You'll put together a staying well plan that captures what worked, what to watch out for, and how to keep facing challenges in the future on your own terms. The aim is to finish the programme feeling like you have real tools you can use independently.`,
    external_links: [
      { label: "NHS — Every Mind Matters", url: "https://www.nhs.uk/every-mind-matters/" },
    ],
    category: "anxiety",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 8,
    sort_order: 80,
    visibility: ANXIETY_VISIBILITY,
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ANXIETY — Activities
  // ════════════════════════════════════════════════════════════════════════════

  {
    title: "A1 — My Thoughts, Feelings and Behaviour Cycle",
    description: "Map out a recent anxious moment — what you thought, felt, and did — to start understanding what keeps anxiety going.",
    category: "anxiety",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "try_it",
    content_type: "pdf",
    file_url: "/resources/A1_Thoughts_Feelings_Behaviour_Cycle.pdf",
    typical_session: 0,
    sort_order: 5,
    visibility: ANXIETY_VISIBILITY,
  },

  {
    title: "A2 — My Anxiety Profile",
    description: "Identify your own anxiety symptoms, thoughts and habits — helpful and unhelpful — to build a personal picture.",
    category: "anxiety",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "understand",
    content_type: "pdf",
    file_url: "/resources/A2_My_Anxiety_Profile.pdf",
    typical_session: 1,
    sort_order: 15,
    visibility: ANXIETY_VISIBILITY,
  },

  {
    title: "A3 — My Coping Toolkit",
    description: "Choose and rank your top coping strategies to use before or after facing fears.",
    category: "anxiety",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "try_it",
    content_type: "pdf",
    file_url: "/resources/A3_My_Coping_Toolkit.pdf",
    typical_session: 1,
    sort_order: 16,
    visibility: ANXIETY_VISIBILITY,
  },

  {
    title: "A4 — My Fear Thermometer",
    description: "Create your personal anxiety scale — three anchor points to help you rate how scary each step on your ladder will feel.",
    category: "anxiety",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "try_it",
    content_type: "pdf",
    file_url: "/resources/A4_Fear_Thermometer.pdf",
    typical_session: 2,
    sort_order: 25,
    visibility: ANXIETY_VISIBILITY,
  },

  {
    title: "A5 — My Step-by-Step Fear Ladder",
    description: "Build your personal fear ladder — a step-by-step plan of situations to face, from easiest to hardest.",
    category: "anxiety",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "try_it",
    content_type: "pdf",
    file_url: "/resources/A5_Step_by_Step_Fear_Ladder.pdf",
    typical_session: 2,
    sort_order: 26,
    visibility: ANXIETY_VISIBILITY,
  },

  {
    title: "A6 — Facing My Fear: Plan and Review",
    description: "Plan each exposure step in advance and review what you learned afterwards. Use this for every step on your ladder.",
    category: "anxiety",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "try_it",
    content_type: "pdf",
    file_url: "/resources/A6_Facing_My_Fear_Plan_and_Review.pdf",
    typical_session: 3,
    sort_order: 35,
    visibility: ANXIETY_VISIBILITY,
  },

  {
    title: "A7 — Problems vs Fears",
    description: "Sort your current worries into problems (needing action) and fears (needing exposure) — two different things that need different approaches.",
    category: "anxiety",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "understand",
    content_type: "pdf",
    file_url: "/resources/A7_Problems_vs_Fears.pdf",
    typical_session: 3,
    sort_order: 36,
    visibility: ANXIETY_VISIBILITY,
  },

  {
    title: "Problem-Solving Plan",
    description: "A six-step structured approach for working through real-life challenges that feel stuck.",
    category: "anxiety",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "try_it",
    content_type: "pdf",
    file_url: "/resources/SHARED_Problem_Solving_Plan.pdf",
    typical_session: 7,
    sort_order: 75,
    visibility: ANXIETY_VISIBILITY,
  },

  {
    title: "A8 — My Staying Well Plan",
    description: "Capture everything that helped and make a personal plan for staying well after the programme ends.",
    category: "anxiety",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "review",
    content_type: "pdf",
    file_url: "/resources/A8_My_Staying_Well_Plan_Anxiety.pdf",
    typical_session: 8,
    sort_order: 85,
    visibility: ANXIETY_VISIBILITY,
  },

  // ════════════════════════════════════════════════════════════════════════════
  // LOW MOOD — Learn
  // ════════════════════════════════════════════════════════════════════════════

  {
    title: "What is the Low Mood Programme?",
    description: "An introduction to the Low Mood programme — what it covers and how Behavioural Activation works.",
    body_text: `Feeling low sometimes is a normal part of life, but when low mood sticks around for weeks, starts to get in the way of everyday things, or makes it hard to enjoy activities that once felt good, it can become something worth getting support with.

This programme is based on Behavioural Activation (BA) — a guided self-help approach that helps young people understand the connection between what they do and how they feel. Rather than waiting to feel better before doing things, the idea is that gradually doing more of the activities that matter to you — even when motivation is low — can actually help lift your mood over time.

The programme also looks at rumination (the habit of getting stuck in unhelpful thoughts) and problem-solving. It runs for around 8 sessions.`,
    category: "low_mood",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 0,
    sort_order: 0,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "Session 0 — Introductions and Understanding the Problem",
    description: "What happens in your first session — building a picture of what's going on and what support might help.",
    body_text: `In this session you'll talk about what's been going on, how long things have been difficult, and what impact low mood has had on your life. Some questionnaires will be completed to help build a clearer picture and decide what support might be most helpful.`,
    external_links: [
      { label: "Young Minds — Depression and low mood", url: "https://www.youngminds.org.uk/young-person/mental-health-conditions/depression/" },
      { label: "Healthtalk — Young people's experiences of depression", url: "https://healthtalk.org/experiences/depression-and-low-mood/" },
    ],
    category: "low_mood",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 0,
    sort_order: 1,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "Session 1 — What is Low Mood and How Does It Affect Me?",
    description: "Learning about low mood, what causes it, and setting personal goals for the programme.",
    body_text: `In this session you'll learn about what low mood and depression actually are, how common they are, and what tends to cause or maintain them. You'll map out how your mood has changed over time, explore what might have contributed to things feeling difficult, and set some personal goals you'd like to work towards during the programme.`,
    external_links: [
      { label: "Young Minds — What is depression?", url: "https://www.youngminds.org.uk/young-person/mental-health-conditions/depression/" },
      { label: "NHS — Low mood and depression", url: "https://www.nhs.uk/mental-health/conditions/low-mood-and-depression/" },
      { label: "Healthtalk — What does depression feel like?", url: "https://healthtalk.org/experiences/depression-and-low-mood/what-does-depression-feel-like-emotional-cognitive-experiences/" },
    ],
    category: "low_mood",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 1,
    sort_order: 10,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "Session 2 — Behavioural Activation",
    description: "Understanding the connection between what we do and how we feel — the core idea of the programme.",
    body_text: `This session introduces the key idea of the programme: when we feel low, we tend to do less — and doing less keeps our mood low. You'll look at what your day-to-day life looks like at the moment and start keeping an activity diary to track what you do and how it makes you feel, using ratings for Achievement, Connection and Enjoyment (ACE).`,
    external_links: [
      { label: "Mind — What is Behavioural Activation?", url: "https://www.mind.org.uk/information-support/drugs-and-treatments/cognitive-behavioural-therapy-cbt/types-of-cbt/" },
    ],
    category: "low_mood",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 2,
    sort_order: 20,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "Session 3 — The Importance of Routines and Values",
    description: "How routine affects mood and how your values can guide which activities to build back in.",
    body_text: `In this session you'll look at how having a daily routine affects mood, and begin thinking about your values — the things that matter most to you across different areas of life. You'll use these to guide which activities to start building back in, so that what you do connects to what genuinely matters, rather than just filling time.`,
    external_links: [
      { label: "NHS — Exercise and mental health", url: "https://www.nhs.uk/mental-health/self-help/tips-and-support/exercise/" },
      { label: "Young Minds — Looking after yourself", url: "https://www.youngminds.org.uk/young-person/coping-with-life/looking-after-yourself/" },
    ],
    category: "low_mood",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 3,
    sort_order: 30,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "Session 4 — Turning Values into Activities",
    description: "Making concrete plans to do activities linked to your values, and problem-solving what might get in the way.",
    body_text: `Building on your values from last session, you'll make concrete plans to do specific activities that link to what matters to you. You'll break these down into manageable steps and think through anything that might get in the way — and how to tackle it.`,
    external_links: [
      { label: "Action for Happiness — 10 Keys to Happier Living", url: "https://www.actionforhappiness.org/10-keys-to-happier-living" },
    ],
    category: "low_mood",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 4,
    sort_order: 40,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "Session 5 — Valued Activities and Introduction to Rumination",
    description: "Continuing to build activities while introducing the concept of rumination and how to spot it.",
    body_text: `You'll review how your planned activities went and keep building your plan. You'll also be introduced to the idea of rumination — the habit of going over and over difficult thoughts in your head without getting anywhere — and start noticing when and where this tends to happen for you.`,
    external_links: [
      { label: "Mind — Rumination and depression", url: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/depression/treatment/" },
    ],
    category: "low_mood",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 5,
    sort_order: 50,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "Session 6 — Reducing Rumination",
    description: "Learning practical strategies to interrupt rumination and shift your attention.",
    body_text: `In this session you'll learn practical strategies to interrupt rumination and shift attention away from unhelpful thinking spirals. Different strategies work for different people — this session is about finding what works for you. Strategies might include scheduled worry time, grounding, absorbing activities, or attention training.`,
    external_links: [
      { label: "NHS — Raising low mood", url: "https://www.nhs.uk/mental-health/self-help/tips-and-support/raise-low-mood/" },
    ],
    category: "low_mood",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 6,
    sort_order: 60,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "Session 7 — Problem Solving",
    description: "A structured six-step method for working through real-life problems that feel stuck.",
    body_text: `Some of what keeps low mood going is real-life problems that feel stuck or overwhelming. In this session you'll learn a structured, step-by-step problem-solving approach to work through challenges — breaking them down into manageable pieces rather than letting them pile up.`,
    external_links: [
      { label: "NHS — Problem-solving technique", url: "https://www.nhs.uk/mental-health/self-help/tips-and-support/problem-solving/" },
    ],
    category: "low_mood",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 7,
    sort_order: 70,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "Session 8 — Keeping Things Going",
    description: "The final session — consolidating progress and planning for the future.",
    body_text: `The final session is about consolidating your progress and planning for the future. You'll review what worked, what to look out for, and make a plan for maintaining your mood and staying well independently. The aim is to leave with a real sense of the tools you now have and the progress you've made.`,
    external_links: [
      { label: "NHS — Every Mind Matters", url: "https://www.nhs.uk/every-mind-matters/" },
      { label: "Young Minds — Getting help", url: "https://www.youngminds.org.uk/young-person/find-help/" },
    ],
    category: "low_mood",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 8,
    sort_order: 80,
    visibility: LOW_MOOD_VISIBILITY,
  },

  // ════════════════════════════════════════════════════════════════════════════
  // LOW MOOD — Activities
  // ════════════════════════════════════════════════════════════════════════════

  {
    title: "LM1 — How Has My Mood Been?",
    description: "A two-week mood mapping grid — rate your mood each day and identify your most common feelings and the area most affected.",
    category: "low_mood",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "review",
    content_type: "pdf",
    file_url: "/resources/LM1_Mood_Mapping_Grid.pdf",
    typical_session: 0,
    sort_order: 5,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "LM2 — My Low Mood Map",
    description: "Identify the thoughts, feelings and behaviours that tend to happen when your mood is low — building a personal picture.",
    category: "low_mood",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "understand",
    content_type: "pdf",
    file_url: "/resources/LM2_My_Low_Mood_Map.pdf",
    typical_session: 1,
    sort_order: 15,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "LM3 — My Timeline",
    description: "Map how your mood has changed across different periods of your life — from early memories to now.",
    category: "low_mood",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "review",
    content_type: "pdf",
    file_url: "/resources/LM3_My_Timeline.pdf",
    typical_session: 1,
    sort_order: 16,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "LM4 — My Goals",
    description: "Set 2–3 personal SMART goals for what you'd like to be different by the end of the programme.",
    category: "low_mood",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "practise",
    content_type: "pdf",
    file_url: "/resources/LM4_My_Goals_Low_Mood.pdf",
    typical_session: 1,
    sort_order: 17,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "LM5 — My Activity Diary",
    description: "Track what you do each day and rate how each activity makes you feel — Achievement, Connection and Enjoyment (ACE). Use every day throughout the programme.",
    category: "low_mood",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "try_it",
    content_type: "pdf",
    file_url: "/resources/LM5_Activity_Diary.pdf",
    typical_session: 2,
    sort_order: 25,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "LM6 — Breaking the Cycle",
    description: "Understand the vicious cycle that keeps low mood going — and see how small actions can start to create a virtuous cycle instead.",
    category: "low_mood",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "understand",
    content_type: "pdf",
    file_url: "/resources/LM6_Breaking_the_Cycle.pdf",
    typical_session: 2,
    sort_order: 26,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "LM7 — What Matters to Me",
    description: "Explore your values across six areas of life to help guide which activities are worth building back in.",
    category: "low_mood",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "review",
    content_type: "pdf",
    file_url: "/resources/LM7_What_Matters_to_Me.pdf",
    typical_session: 3,
    sort_order: 35,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "LM8 — My Weekly Routine",
    description: "Plan a balanced weekly routine that includes valued activities — structure supports mood even when motivation is low.",
    category: "low_mood",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "practise",
    content_type: "pdf",
    file_url: "/resources/LM8_My_Weekly_Routine.pdf",
    typical_session: 3,
    sort_order: 36,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "LM9 — Planning a Valued Activity",
    description: "Plan and review one valued activity at a time — who, when, where, what might get in the way, and how it went.",
    category: "low_mood",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "try_it",
    content_type: "pdf",
    file_url: "/resources/LM9_Activity_Planning_Sheet.pdf",
    typical_session: 4,
    sort_order: 45,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "LM10 — Spotting Rumination",
    description: "Learn to tell the difference between rumination and helpful thinking, and start noticing when and where rumination happens for you.",
    category: "low_mood",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "understand",
    content_type: "pdf",
    file_url: "/resources/LM10_Spotting_Rumination.pdf",
    typical_session: 5,
    sort_order: 55,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "LM11 — Breaking Out of Rumination",
    description: "Choose a strategy for interrupting rumination, plan how to use it, and review how well it worked.",
    category: "low_mood",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "try_it",
    content_type: "pdf",
    file_url: "/resources/LM11_Breaking_Out_of_Rumination.pdf",
    typical_session: 6,
    sort_order: 65,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "Problem-Solving Plan",
    description: "A six-step structured approach for working through real-life challenges that feel stuck.",
    category: "low_mood",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "try_it",
    content_type: "pdf",
    file_url: "/resources/SHARED_Problem_Solving_Plan.pdf",
    typical_session: 7,
    sort_order: 75,
    visibility: LOW_MOOD_VISIBILITY,
  },

  {
    title: "LM12 — My Staying Well Plan",
    description: "Capture what helped most and make a personal plan for maintaining mood and staying well after the programme.",
    category: "low_mood",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "review",
    content_type: "pdf",
    file_url: "/resources/LM12_My_Staying_Well_Plan_Low_Mood.pdf",
    typical_session: 8,
    sort_order: 85,
    visibility: LOW_MOOD_VISIBILITY,
  },

  // ════════════════════════════════════════════════════════════════════════════
  // BEHAVIOURAL CHALLENGES — Learn
  // ════════════════════════════════════════════════════════════════════════════

  {
    title: "What is the Behavioural Challenges Programme?",
    description: "An introduction to the programme — what it covers and how the approach works.",
    body_text: `All children have times when they struggle to manage their behaviour — it's a completely normal part of growing up. But when challenging behaviour becomes frequent, intense, or starts affecting family life and school, it can be exhausting for parents and carers too.

This parent-led programme uses an approach called contingency management, which is based on the science of how children learn behaviour. Put simply, children are more likely to repeat behaviours that get them attention or rewards, and less likely to repeat behaviours that don't. The sessions focus on strengthening your relationship with your child, noticing and encouraging the behaviour you want to see more of, and learning how to respond to difficult behaviour in ways that are calm, consistent and effective.

The programme runs for around 5 to 6 sessions.`,
    category: "behavioural_challenges",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 0,
    sort_order: 0,
    visibility: BC_VISIBILITY,
  },

  {
    title: "Session 0 — Assessment and Formulation",
    description: "Your first session — building a shared picture of what's happening and what you'd like to change.",
    body_text: `This session is about building a clear shared picture of what the challenges are, when they tend to happen, what might be maintaining them, and what your goals are. This forms the basis for tailoring the approach to your child and family.`,
    external_links: [
      { label: "NHS — Behavioural problems in children", url: "https://www.nhs.uk/conditions/behavioural-problems-in-children/" },
      { label: "Young Minds — For parents: understanding behaviour", url: "https://www.youngminds.org.uk/parent/parents-a-z-mental-health-guide/behaviour/" },
    ],
    category: "behavioural_challenges",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 0,
    sort_order: 1,
    visibility: BC_VISIBILITY,
  },

  {
    title: "Session 1 — Enhancing the Relationship Through Play",
    description: "How child-led play can powerfully strengthen your relationship — the foundation of everything that follows.",
    body_text: `Before changing behaviour, the foundation is the relationship between parent and child. In this session you'll learn how using child-led play — following your child's lead without directing or correcting — can powerfully strengthen your connection and set the stage for everything that follows. Even 5–15 minutes a day makes a real difference.`,
    external_links: [
      { label: "NSPCC — Play and learning", url: "https://www.nspcc.org.uk/keeping-children-safe/support-for-parents/play/" },
      { label: "Action for Children — Why quality time matters", url: "https://parents.actionforchildren.org.uk/behaviour/general-behaviour/why-is-quality-time-important/" },
    ],
    category: "behavioural_challenges",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 1,
    sort_order: 10,
    visibility: BC_VISIBILITY,
  },

  {
    title: "Session 2 — Praise and Rewards",
    description: "Using specific praise and simple reward systems to notice and reinforce the behaviour you want to see more of.",
    body_text: `Children thrive on attention — especially from the people they love most. This session covers how to use specific, enthusiastic praise and simple reward systems to notice and reinforce the behaviour you want to see more of. The key is shifting the balance of attention away from difficult moments and towards positive ones.`,
    external_links: [
      { label: "NHS — Positive parenting", url: "https://www.nhs.uk/conditions/baby/babys-development/play-and-learning/positive-parenting/" },
      { label: "Young Minds — Reward charts and behaviour", url: "https://www.youngminds.org.uk/parent/parents-a-z-mental-health-guide/behaviour/" },
    ],
    category: "behavioural_challenges",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 2,
    sort_order: 20,
    visibility: BC_VISIBILITY,
  },

  {
    title: "Session 3 — Supporting Children's Emotional Regulation",
    description: "Helping your child identify and cope with big feelings using calm co-regulation strategies.",
    body_text: `Children often behave in challenging ways because they haven't yet developed the skills to manage big feelings. This session explores how you can help your child identify and cope with their emotions — using calm co-regulation strategies that you use together rather than asking your child to manage alone.`,
    external_links: [
      { label: "Anna Freud — Emotional regulation resources for parents", url: "https://www.annafreud.org/parents-and-carers/" },
      { label: "NHS — Helping children manage emotions", url: "https://www.nhs.uk/mental-health/children-and-young-adults/advice-for-parents/help-your-child-manage-their-emotions/" },
    ],
    category: "behavioural_challenges",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 3,
    sort_order: 30,
    visibility: BC_VISIBILITY,
  },

  {
    title: "Session 4 — Reducing Undesirable Behaviour",
    description: "How to respond to behaviour you'd like to see less of — including planned ignoring and calm, consistent consequences.",
    body_text: `Once a strong foundation of positive attention is in place, this session looks at how to respond to behaviour you'd like to see less of. This includes planned ignoring of attention-seeking behaviour — deliberately withdrawing attention rather than engaging — and setting calm, consistent consequences when needed.`,
    external_links: [
      { label: "NHS — Disciplining your child", url: "https://www.nhs.uk/conditions/baby/babys-development/behaviour/disciplining-your-child/" },
      { label: "NSPCC — Boundaries and discipline", url: "https://www.nspcc.org.uk/keeping-children-safe/support-for-parents/positive-parenting/" },
    ],
    category: "behavioural_challenges",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 4,
    sort_order: 40,
    visibility: BC_VISIBILITY,
  },

  {
    title: "Session 5 — Helping Children Follow Instructions",
    description: "How to give instructions in a way children are more likely to respond to — and reviewing progress across the programme.",
    body_text: `The final session focuses on giving instructions in a way that children are more likely to follow — clear, calm, close, and consistent. You'll also review progress across the whole programme and make a plan for keeping things on track after the sessions end.`,
    external_links: [
      { label: "Young Minds — Managing challenging behaviour", url: "https://www.youngminds.org.uk/parent/parents-a-z-mental-health-guide/behaviour/" },
      { label: "NHS — Every Mind Matters", url: "https://www.nhs.uk/every-mind-matters/" },
    ],
    category: "behavioural_challenges",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: 5,
    sort_order: 50,
    visibility: BC_VISIBILITY,
  },

  // ════════════════════════════════════════════════════════════════════════════
  // BEHAVIOURAL CHALLENGES — Activities
  // ════════════════════════════════════════════════════════════════════════════

  {
    title: "BC0 — My Goals",
    description: "Set 2–3 specific, realistic goals for what you'd like to be different by the end of the programme.",
    category: "behavioural_challenges",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "practise",
    content_type: "pdf",
    file_url: "/resources/BC0_My_Goals_Behaviour.pdf",
    typical_session: 0,
    sort_order: 5,
    visibility: BC_VISIBILITY,
  },

  {
    title: "BC1 — ABC Chart",
    description: "Map out a typical difficult situation using the ABC approach — Antecedent, Behaviour, Consequence — to understand what might be keeping the behaviour going.",
    category: "behavioural_challenges",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "understand",
    content_type: "pdf",
    file_url: "/resources/BC1_ABC_Chart.pdf",
    typical_session: 0,
    sort_order: 6,
    visibility: BC_VISIBILITY,
  },

  {
    title: "BC2 — Special Play Time Log",
    description: "Plan and log your daily Special Play Time sessions — a powerful tool for strengthening your relationship with your child.",
    category: "behavioural_challenges",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "try_it",
    content_type: "pdf",
    file_url: "/resources/BC2_Special_Play_Time_Log.pdf",
    typical_session: 1,
    sort_order: 15,
    visibility: BC_VISIBILITY,
  },

  {
    title: "BC3 — Catch Them Being Good",
    description: "A daily tracker for noticing positive behaviour and recording the specific praise you gave — and how your child responded.",
    category: "behavioural_challenges",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "try_it",
    content_type: "pdf",
    file_url: "/resources/BC3_Catch_Them_Being_Good.pdf",
    typical_session: 2,
    sort_order: 25,
    visibility: BC_VISIBILITY,
  },

  {
    title: "BC4 — Reward Chart",
    description: "A simple printable reward chart to encourage up to three target behaviours — design it together with your child.",
    category: "behavioural_challenges",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "try_it",
    content_type: "pdf",
    file_url: "/resources/BC4_Reward_Chart.pdf",
    typical_session: 2,
    sort_order: 26,
    visibility: BC_VISIBILITY,
  },

  {
    title: "BC5 — Our Calm-Down Plan",
    description: "Choose 2–3 calm-down strategies to use together when big feelings arise — practise them when things are calm.",
    category: "behavioural_challenges",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "practise",
    content_type: "pdf",
    file_url: "/resources/BC5_Our_Calm_Down_Plan.pdf",
    typical_session: 3,
    sort_order: 35,
    visibility: BC_VISIBILITY,
  },

  {
    title: "BC6 — Planned Ignoring Plan",
    description: "Understand planned ignoring, decide which behaviours to try it with, and log how it goes across the week.",
    category: "behavioural_challenges",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "try_it",
    content_type: "pdf",
    file_url: "/resources/BC6_Planned_Ignoring_Plan.pdf",
    typical_session: 4,
    sort_order: 45,
    visibility: BC_VISIBILITY,
  },

  {
    title: "BC7 — Giving Effective Instructions",
    description: "A practice log for tracking how you give instructions and what makes the difference to whether your child follows them.",
    category: "behavioural_challenges",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "try_it",
    content_type: "pdf",
    file_url: "/resources/BC7_Instruction_Practice_Log.pdf",
    typical_session: 5,
    sort_order: 55,
    visibility: BC_VISIBILITY,
  },

  {
    title: "BC8 — Keeping Things Going",
    description: "A plan for maintaining progress after the programme ends — what worked, what to watch for, and what to do if things get difficult again.",
    category: "behavioural_challenges",
    section: "activities",
    status: "published",
    export_type: "blank_template",
    journey_step: "review",
    content_type: "pdf",
    file_url: "/resources/BC8_Staying_Well_Plan_Parents.pdf",
    typical_session: 5,
    sort_order: 56,
    visibility: BC_VISIBILITY,
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SLEEP — Learn
  // ════════════════════════════════════════════════════════════════════════════

  {
    title: "Why Sleep Matters",
    description: "Why good sleep is so important for mental and physical health — especially during adolescence.",
    body_text: `Sleep is one of the most important things you can do for your mental and physical health — but it's often one of the first things to suffer when we're struggling. During adolescence, the brain and body are going through major changes, and sleep plays a vital role in mood, memory, concentration, growth, and emotional regulation.

Most young people need around 8–10 hours of sleep a night, though this varies. Many get far less than this — because of screens, stress, irregular routines, or simply finding it hard to switch off. The good news is that sleep is something you can improve with the right habits, and even small changes can make a meaningful difference to how you feel.

This section contains information and practical resources to help you understand your sleep and make changes that actually work.`,
    external_links: [
      { label: "NHS — Sleep tips for teenagers", url: "https://www.nhs.uk/live-well/sleep-and-tiredness/sleep-tips-for-teenagers/" },
      { label: "Young Minds — Sleep and mental health", url: "https://www.youngminds.org.uk/young-person/coping-with-life/sleep/" },
      { label: "Sleep Foundation — Teens and sleep", url: "https://www.sleepfoundation.org/teens-and-sleep" },
    ],
    category: "sleep",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: null,
    sort_order: 10,
    visibility: SLEEP_VISIBILITY,
  },

  {
    title: "Understanding Your Sleep",
    description: "How sleep works — sleep cycles, the body clock, and why screens and stress affect sleep the way they do.",
    body_text: `Sleep isn't just one state — it happens in cycles of about 90 minutes, moving between lighter and deeper stages. During deeper sleep, the brain consolidates memories and the body repairs itself. During REM (Rapid Eye Movement) sleep, we process emotions and experiences from the day.

Your body has an internal clock — the circadian rhythm — that regulates when you feel sleepy and when you feel awake. During adolescence, this clock naturally shifts later, which is why many teenagers feel most alert in the evening and struggle to wake up in the morning. This is biology, not laziness.

Several things can disrupt sleep: bright screens at night (which suppress the sleep hormone melatonin), irregular sleep times, caffeine, stress and anxiety, and sleeping in too late at weekends (which confuses the body clock further). Understanding how sleep works is the first step to improving it.`,
    external_links: [
      { label: "NHS — Why lack of sleep is bad for your health", url: "https://www.nhs.uk/live-well/sleep-and-tiredness/why-lack-of-sleep-is-bad-for-your-health/" },
      { label: "Sleep Foundation — What is REM sleep?", url: "https://www.sleepfoundation.org/stages-of-sleep/rem-sleep" },
    ],
    category: "sleep",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: null,
    sort_order: 20,
    visibility: SLEEP_VISIBILITY,
  },

  {
    title: "Sleep Hygiene — Habits That Help",
    description: "Practical evidence-based habits that support better sleep — often called sleep hygiene.",
    body_text: `Sleep hygiene refers to the habits and routines that support good sleep. These won't fix everything overnight (no pun intended), but practising them consistently can make a real difference over time.

Things that tend to help:
• Going to bed and waking up at roughly the same time every day — including weekends
• Keeping your bedroom cool, dark and quiet
• Avoiding screens for at least 30–60 minutes before bed
• Having a wind-down routine — something calm and predictable that signals to your body that it's time to sleep
• Avoiding caffeine (tea, coffee, energy drinks, some fizzy drinks) from the afternoon onwards
• Getting some daylight and physical activity during the day
• Not lying in bed awake for long periods — if you can't sleep after 20–30 minutes, getting up and doing something calm before trying again

Things that tend to make sleep worse:
• Scrolling on your phone in bed
• Staying up much later at weekends and then trying to catch up
• Napping for too long during the day (short naps of 20 minutes are usually fine)
• Using alcohol or other substances to try to sleep`,
    external_links: [
      { label: "NHS — How to get to sleep", url: "https://www.nhs.uk/live-well/sleep-and-tiredness/how-to-get-to-sleep/" },
      { label: "Young Minds — Tips for better sleep", url: "https://www.youngminds.org.uk/young-person/coping-with-life/sleep/" },
      { label: "Sleep Foundation — Sleep hygiene", url: "https://www.sleepfoundation.org/sleep-hygiene" },
    ],
    category: "sleep",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: null,
    sort_order: 30,
    visibility: SLEEP_VISIBILITY,
  },

  {
    title: "Sleep and Mental Health",
    description: "How sleep and mental health affect each other — and what to do when anxiety or low mood is getting in the way of sleep.",
    body_text: `Sleep and mental health are deeply connected — each affects the other. Anxiety can make it hard to fall asleep or stay asleep (because the mind is racing). Low mood can cause you to sleep too much, or to wake early and feel flat. And poor sleep, in turn, makes anxiety and low mood worse. This can become a cycle that's hard to break.

If anxiety or low mood is getting in the way of your sleep, it can help to:
• Address the anxiety or low mood itself (which is what the other sections of this resource library are for)
• Keep a consistent sleep schedule even when you feel low — routine is one of the most powerful tools for mood
• Avoid spending too much time in bed during the day if you're feeling low, as this can worsen sleep at night
• Use grounding or breathing techniques if your mind is racing at bedtime

If sleep difficulties are severe or have gone on for a long time, it may be worth speaking with your CAMHS practitioner or GP — there are specific evidence-based treatments for sleep problems (such as CBT for Insomnia, or CBT-I) that can help.`,
    external_links: [
      { label: "Sleep Foundation — Sleep and mental health", url: "https://www.sleepfoundation.org/mental-health" },
      { label: "NHS — Insomnia", url: "https://www.nhs.uk/conditions/insomnia/" },
    ],
    category: "sleep",
    section: "learn",
    status: "published",
    export_type: "none",
    content_type: "text",
    typical_session: null,
    sort_order: 40,
    visibility: SLEEP_VISIBILITY,
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SLEEP — Activities (in-app, no PDF)
  // ════════════════════════════════════════════════════════════════════════════

  {
    title: "My Sleep Diary",
    description: "Track your sleep across the week to spot patterns — what time you go to bed, how long it takes to fall asleep, how you feel in the morning.",
    body_text: `Use this diary to track your sleep every day for a week. Record what time you went to bed, how long it took you to fall asleep, how many times you woke up in the night, what time you woke up, and how rested you felt in the morning (0–10). After a week, look for patterns — do certain days or situations affect your sleep?`,
    category: "sleep",
    section: "activities",
    status: "published",
    export_type: "none",
    journey_step: "review",
    content_type: "text",
    file_url: null,
    typical_session: null,
    sort_order: 10,
    visibility: SLEEP_VISIBILITY,
  },

  {
    title: "My Wind-Down Routine Planner",
    description: "Design a simple wind-down routine to signal to your body that it's time to sleep — choose what works for you.",
    body_text: `A wind-down routine is a short sequence of calm activities you do in the same order each night, starting around 30–60 minutes before bed. The point is to signal to your body and mind that sleep is coming. Choose 3–5 activities from the list, decide what time you'll start, and try it for a week. Review how it went and adjust as needed.`,
    category: "sleep",
    section: "activities",
    status: "published",
    export_type: "none",
    journey_step: "practise",
    content_type: "text",
    file_url: null,
    typical_session: null,
    sort_order: 20,
    visibility: SLEEP_VISIBILITY,
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding resource library…");

  // Wipe existing resources (cascades to resource_visibility)
  await prisma.resourceVisibility.deleteMany({});
  await prisma.resource.deleteMany({});

  let created = 0;

  for (const r of resources) {
    await prisma.resource.create({
      data: {
        title:           r.title,
        description:     r.description,
        body_text:       r.body_text ?? null,
        external_links:  r.external_links ? (r.external_links as object) : undefined,
        category:        r.category,
        section:         r.section,
        status:          r.status,
        export_type:     r.export_type,
        journey_step:    r.journey_step ?? null,
        content_type:    r.content_type,
        file_url:        r.file_url ?? null,
        typical_session: r.typical_session ?? null,
        sort_order:      r.sort_order,
        visibility: {
          create: r.visibility.map((role) => ({ role })),
        },
      },
    });
    created++;
  }

  console.log(`✓ Seeded ${created} resources across 4 categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
