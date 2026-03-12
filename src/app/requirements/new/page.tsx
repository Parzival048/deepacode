import { RequirementForm } from './RequirementForm';

export default function NewRequirementPage() {
  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Submit your requirements</h1>
        <p className="text-muted-foreground">
          Describe your infrastructure needs. We&apos;ll recommend the best cloud provider and services.
        </p>
      </div>
      <RequirementForm />
    </div>
  );
}
