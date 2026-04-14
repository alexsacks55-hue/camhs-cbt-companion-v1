import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SupportPage() {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <header className="mb-xl max-w-content">
        <h1 className="text-h2 text-foreground">Help and support</h1>
        <p className="mt-xs text-body text-muted-foreground">
          You don't have to manage difficult feelings alone. Here's how to get support.
        </p>
      </header>

      <div className="max-w-content space-y-xl">

        {/* Urgent support */}
        <section
          aria-label="Urgent support"
          className="rounded-xl border border-status-error/30 bg-status-error/5 p-lg space-y-sm"
        >
          <h2 className="text-body font-semibold text-foreground">
            If you're in crisis right now
          </h2>
          <p className="text-body text-muted-foreground">
            If you or someone else is in immediate danger, please call the emergency services or
            go to your nearest Accident and Emergency.
          </p>
          <p className="text-body font-semibold text-foreground">999 — Emergency services</p>
          <p className="text-caption text-muted-foreground">
            This app is not an emergency service. If you are in immediate danger, stop and call 999.
          </p>
        </section>

        {/* Support lines */}
        <section aria-label="Support lines">
          <h2 className="text-h3 text-foreground mb-md">Support lines</h2>
          <ul className="space-y-md">
            <SupportCard
              name="Childline"
              description="Free, confidential support for children and young people."
              contact="0800 1111"
              contactNote="Free, 24 hours a day, 7 days a week"
              url="https://www.childline.org.uk"
            />
            <SupportCard
              name="Samaritans"
              description="Confidential support for anyone struggling to cope."
              contact="116 123"
              contactNote="Free, 24 hours a day, 7 days a week"
              url="https://www.samaritans.org"
            />
            <SupportCard
              name="YoungMinds Crisis Messenger"
              description="Text support for young people in crisis."
              contact="Text YM to 85258"
              contactNote="Free, 24 hours a day, 7 days a week"
              url="https://www.youngminds.org.uk/young-person/crisis-messenger"
            />
            <SupportCard
              name="PAPYRUS HopeLine UK"
              description="Support for young people at risk of suicide and those worried about them."
              contact="0800 068 4141"
              contactNote="Free, available most of the day and evening"
              url="https://papyrus-uk.org"
            />
          </ul>
        </section>

        {/* CAMHS */}
        <section aria-label="Your CAMHS support">
          <h2 className="text-h3 text-foreground mb-sm">Your CAMHS support</h2>
          <div className="rounded-xl border border-border bg-card p-lg space-y-sm">
            <p className="text-body text-muted-foreground">
              Your CAMHS worker is your main point of contact for support during your treatment.
              If something feels urgent and you can't reach them, call the main CAMHS team number
              you were given when you started treatment.
            </p>
            <p className="text-caption text-muted-foreground">
              If you don't have their number, ask a parent, carer, or trusted adult to help you
              find the right contact.
            </p>
          </div>
        </section>

        {/* About this app */}
        <section aria-label="About this app">
          <h2 className="text-h3 text-foreground mb-sm">About this app</h2>
          <div className="rounded-xl border border-border bg-card p-lg space-y-sm">
            <p className="text-caption text-muted-foreground">
              The CAMHS CBT Companion is a tool to support your therapy between sessions. It helps
              you track your mood, spot patterns, and explore resources. It is not a replacement
              for your CAMHS support, and it is not an emergency service.
            </p>
            <p className="text-caption text-muted-foreground">
              Your mood check-in and review data is stored securely and is only visible to you.
              No individual data is shared with services without your knowledge.
            </p>
          </div>
        </section>

        {/* Navigation links */}
        <div className="flex flex-wrap gap-md pt-sm">
          <Button variant="outline" onClick={() => navigate("/resources")}>
            Browse resources
          </Button>
          <Button variant="ghost" onClick={() => navigate("/home")}>
            Go to home
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

function SupportCard({
  name,
  description,
  contact,
  contactNote,
  url,
}: {
  name:        string;
  description: string;
  contact:     string;
  contactNote: string;
  url:         string;
}) {
  return (
    <li className="rounded-xl border border-border bg-card p-lg space-y-xs list-none">
      <h3 className="text-body font-semibold text-foreground">{name}</h3>
      <p className="text-caption text-muted-foreground">{description}</p>
      <p className="text-body font-medium text-foreground">{contact}</p>
      <p className="text-caption text-muted-foreground">{contactNote}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-caption text-primary underline-offset-2 hover:underline"
      >
        Visit website
      </a>
    </li>
  );
}
