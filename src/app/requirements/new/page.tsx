import { RequirementForm } from './RequirementForm';

export default function NewRequirementPage() {
  return (
    <div className="container max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-bold sm:text-2xl">Submit your requirements</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Describe your infrastructure needs. We&apos;ll recommend the best cloud provider and services.
        </p>
      </div>
      <RequirementForm />
    </div>
  );
}
