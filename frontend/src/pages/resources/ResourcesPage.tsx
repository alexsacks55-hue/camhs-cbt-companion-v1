import { AppLayout } from "@/layouts/AppLayout";
import { CategoryCard } from "@/components/resources/CategoryCard";
import { ResourceCategory, UserRole } from "shared/types/enums";
import { useAuth } from "@/app/AuthContext";

const ALL_CATEGORIES = [
  ResourceCategory.Anxiety,
  ResourceCategory.LowMood,
  ResourceCategory.BehaviouralChallenges,
  ResourceCategory.Sleep,
];

const RESTRICTED_ROLES: string[] = [UserRole.YoungPerson, UserRole.ParentCarer];

function getAllowedCategories(role: string, manualType: string | null): ResourceCategory[] {
  if (!RESTRICTED_ROLES.includes(role)) return ALL_CATEGORIES;
  if (!manualType) return [ResourceCategory.Sleep];
  const treatment = manualType as ResourceCategory;
  return treatment === ResourceCategory.Sleep ? [ResourceCategory.Sleep] : [treatment, ResourceCategory.Sleep];
}

export default function ResourcesPage() {
  const { user } = useAuth();
  const categories = user
    ? getAllowedCategories(user.role, user.manual_type)
    : ALL_CATEGORIES;

  return (
    <AppLayout>
      <header className="mb-xl">
        <h1 className="text-h2 text-foreground">Resources</h1>
        <p className="mt-sm text-body text-muted-foreground">
          Explore guides, activities, and worksheets organised by topic.
        </p>
      </header>

      <div className="grid gap-md sm:grid-cols-2">
        {categories.map((cat) => (
          <CategoryCard key={cat} category={cat} />
        ))}
      </div>
    </AppLayout>
  );
}
