import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingState } from "@/components/ui/loading-state";
import { resourcesApi } from "@/services/resources.service";
import {
  ResourceCategory, ResourceSection, ResourceStatus,
  ExportType, JourneyStep, ContentType, UserRole,
} from "shared/types/enums";

// ── Form validation ───────────────────────────────────────────────────────────

const schema = z.object({
  title:           z.string().min(1, "Title is required.").max(200),
  description:     z.string().min(1, "Description is required.").max(2000),
  category:        z.nativeEnum(ResourceCategory),
  section:         z.nativeEnum(ResourceSection),
  status:          z.nativeEnum(ResourceStatus).default(ResourceStatus.Draft),
  export_type:     z.nativeEnum(ExportType).default(ExportType.None),
  journey_step:    z.nativeEnum(JourneyStep).nullable().optional(),
  content_type:    z.nativeEnum(ContentType).default(ContentType.Text),
  file_url:        z.string().url("Must be a valid URL.").nullable().optional().or(z.literal("")),
  typical_session: z.coerce.number().int().positive().nullable().optional(),
  sort_order:      z.coerce.number().int().min(0).default(0),
  video_url:       z.string().url("Must be a valid URL.").nullable().optional().or(z.literal("")),
  video_label:     z.string().max(300).nullable().optional(),
  video_placement: z.enum(["top", "below"]).nullable().optional(),
  visibility:      z.array(z.nativeEnum(UserRole)).min(1, "Select at least one role."),
});

type FormValues = z.infer<typeof schema>;

// ── Label maps ────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  [ResourceCategory.Anxiety]:               "Anxiety",
  [ResourceCategory.LowMood]:               "Low Mood",
  [ResourceCategory.BehaviouralChallenges]: "Behavioural Challenges",
  [ResourceCategory.Sleep]:                 "Sleep",
};

const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.YoungPerson]:          "Young Person",
  [UserRole.ParentCarer]:          "Parent / Carer",
  [UserRole.Practitioner]:         "Practitioner",
  [UserRole.TraineePractitioner]:  "Trainee Practitioner",
  [UserRole.Admin]:                "Admin",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminResourceFormPage() {
  const { resourceId } = useParams<{ resourceId?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(resourceId);

  const [loadingExisting, setLoadingExisting] = useState(isEdit);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: ResourceStatus.Draft,
      export_type: ExportType.None,
      content_type: ContentType.Text,
      sort_order: 0,
      visibility: [UserRole.YoungPerson],
    },
  });

  // Load existing resource for edit
  useEffect(() => {
    if (!isEdit || !resourceId) return;
    resourcesApi.adminGet(resourceId)
      .then((r) => {
        reset({
          title:           r.title,
          description:     r.description,
          category:        r.category as ResourceCategory,
          section:         r.section as ResourceSection,
          status:          r.status as ResourceStatus,
          export_type:     r.export_type as ExportType,
          journey_step:    (r.journey_step as JourneyStep) ?? null,
          content_type:    r.content_type as ContentType,
          file_url:        r.file_url ?? "",
          typical_session: r.typical_session ?? undefined,
          sort_order:      r.sort_order,
          video_url:       r.video_url ?? "",
          video_label:     r.video_label ?? "",
          video_placement: (r.video_placement as "top" | "below") ?? null,
          visibility:      r.visibility.map((v) => v.role as UserRole),
        });
        setLoadingExisting(false);
      })
      .catch(() => {
        setServerError("We couldn't load this resource. Please try again.");
        setLoadingExisting(false);
      });
  }, [resourceId, isEdit, reset]);

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const payload = {
        ...values,
        file_url: values.file_url || null,
        typical_session: values.typical_session ?? null,
        journey_step: values.journey_step ?? null,
        video_url: values.video_url || null,
        video_label: values.video_label || null,
        video_placement: values.video_placement ?? null,
      };

      if (isEdit && resourceId) {
        await resourcesApi.update(resourceId, payload);
      } else {
        await resourcesApi.create(payload);
      }
      navigate("/admin/resources");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "We couldn't save this resource. Please try again.";
      setServerError(msg);
    }
  }

  if (loadingExisting) {
    return <AppLayout><LoadingState label="Loading resource…" /></AppLayout>;
  }

  return (
    <AppLayout>
      <nav className="mb-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/resources")}
          className="text-muted-foreground -ml-sm"
        >
          ← Content management
        </Button>
      </nav>

      <header className="mb-xl">
        <h1 className="text-h2 text-foreground">
          {isEdit ? "Edit resource" : "Add resource"}
        </h1>
        <p className="mt-xs text-caption text-muted-foreground">
          Fields marked * are required.
        </p>
      </header>

      {serverError && (
        <Alert variant="destructive" className="mb-lg">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-content space-y-lg">

        {/* Title */}
        <Field label="Title *" error={errors.title?.message}>
          <Input id="title" {...register("title")} />
        </Field>

        {/* Description */}
        <Field label="Description *" error={errors.description?.message}>
          <Textarea id="description" rows={4} {...register("description")} />
        </Field>

        {/* Category + Section row */}
        <div className="grid gap-md sm:grid-cols-2">
          <Field label="Category *" error={errors.category?.message}>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {Object.values(ResourceCategory).map((c) => (
                      <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Section *" error={errors.section?.message}>
            <Controller
              name="section"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ResourceSection.Learn}>Learn</SelectItem>
                    <SelectItem value={ResourceSection.Activities}>Activities</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>

        {/* Status + Export type row */}
        <div className="grid gap-md sm:grid-cols-2">
          <Field label="Status *" error={errors.status?.message}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ResourceStatus.Draft}>Draft</SelectItem>
                    <SelectItem value={ResourceStatus.Published}>Published</SelectItem>
                    <SelectItem value={ResourceStatus.Hidden}>Hidden</SelectItem>
                    <SelectItem value={ResourceStatus.Archived}>Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Export type" error={errors.export_type?.message}>
            <Controller
              name="export_type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ExportType.None}>None</SelectItem>
                    <SelectItem value={ExportType.BlankTemplate}>Blank template</SelectItem>
                    <SelectItem value={ExportType.StructuredSummary}>Structured summary</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>

        {/* Content type + Journey step row */}
        <div className="grid gap-md sm:grid-cols-2">
          <Field label="Content type" error={errors.content_type?.message}>
            <Controller
              name="content_type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.values(ContentType).map((t) => (
                      <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Journey step" error={errors.journey_step?.message}>
            <Controller
              name="journey_step"
              control={control}
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={(v) => field.onChange(v || null)}>
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value={JourneyStep.Understand}>Understand</SelectItem>
                    <SelectItem value={JourneyStep.TryIt}>Try it</SelectItem>
                    <SelectItem value={JourneyStep.Practise}>Practise</SelectItem>
                    <SelectItem value={JourneyStep.Review}>Review</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>

        {/* File URL */}
        <Field
          label="File URL"
          hint="Link to a PDF, audio file, or video hosted externally. Azure Blob upload can be configured separately."
          error={errors.file_url?.message}
        >
          <Input id="file_url" type="url" placeholder="https://…" {...register("file_url")} />
        </Field>

        {/* Video embed — YouTube privacy-enhanced */}
        <div className="rounded-lg border border-border bg-muted/30 p-md space-y-md">
          <p className="text-caption font-semibold text-foreground">Video embed (optional)</p>
          <p className="text-caption text-muted-foreground">
            Use YouTube's privacy-enhanced format: <code className="text-[11px]">https://www.youtube-nocookie.com/embed/VIDEO_ID</code>
          </p>

          <Field
            label="Video URL"
            hint="Leave blank if this session has no video."
            error={errors.video_url?.message}
          >
            <Input
              id="video_url"
              type="url"
              placeholder="https://www.youtube-nocookie.com/embed/…"
              {...register("video_url")}
            />
          </Field>

          <Field
            label="Video label"
            hint={'Helper text shown above the video, e.g. "Watch: What is Depression? (4 mins)"'}
            error={errors.video_label?.message}
          >
            <Input
              id="video_label"
              type="text"
              placeholder="Watch: …"
              {...register("video_label")}
            />
          </Field>

          <Field label="Video placement" error={errors.video_placement?.message}>
            <Controller
              name="video_placement"
              control={control}
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={(v) => field.onChange(v || null)}>
                  <SelectTrigger><SelectValue placeholder="Select placement" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No video</SelectItem>
                    <SelectItem value="top">Top — before session text</SelectItem>
                    <SelectItem value="below">Below — after session text</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>

        {/* Typical session + Sort order row */}
        <div className="grid gap-md sm:grid-cols-2">
          <Field
            label="Typical session number"
            hint="Suggested session — never locks access."
            error={errors.typical_session?.message}
          >
            <Input id="typical_session" type="number" min={1} {...register("typical_session")} />
          </Field>
          <Field label="Sort order" error={errors.sort_order?.message}>
            <Input id="sort_order" type="number" min={0} {...register("sort_order")} />
          </Field>
        </div>

        {/* Visibility */}
        <Field
          label="Visible to *"
          hint="Which roles can see this resource."
          error={errors.visibility?.message}
        >
          <Controller
            name="visibility"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-md rounded-lg border border-border p-md">
                {Object.values(UserRole).map((role) => (
                  <label key={role} className="flex cursor-pointer items-center gap-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-ring"
                      checked={field.value.includes(role)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange([...field.value, role]);
                        } else {
                          field.onChange(field.value.filter((r) => r !== role));
                        }
                      }}
                    />
                    <span className="text-caption text-foreground">{ROLE_LABELS[role]}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </Field>

        {/* Actions */}
        <div className="flex gap-md pt-md">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create resource"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/admin/resources")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </AppLayout>
  );
}

// ── Reusable field wrapper ────────────────────────────────────────────────────

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-sm">
      <Label>{label}</Label>
      {hint && <p className="text-caption text-muted-foreground">{hint}</p>}
      {children}
      {error && <p className="text-caption text-destructive" role="alert">{error}</p>}
    </div>
  );
}
