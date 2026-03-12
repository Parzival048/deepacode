'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createRequirement } from '@/lib/actions/requirements';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const schema = z.object({
  prompt_input: z.string().optional(),
  monthly_users: z.coerce.number().min(0).optional(),
  storage_gb: z.coerce.number().min(0).optional(),
  compute_workload: z.enum(['low', 'medium', 'high']).optional(),
  budget_range: z.string().optional(),
  region: z.string().optional(),
  security_level: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function RequirementForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      compute_workload: 'medium',
      budget_range: '',
      region: 'us-east-1',
      security_level: 'standard',
    },
  });

  async function onSubmit(data: FormData) {
    setSubmitError(null);
    const questionnaireData = {
      monthly_users: data.monthly_users,
      storage_gb: data.storage_gb,
      compute_workload: data.compute_workload,
      budget_range: data.budget_range,
      region: data.region,
      security_level: data.security_level,
    };
    const result = await createRequirement(data.prompt_input ?? null, questionnaireData);
    if (result.error) {
      setSubmitError(result.error);
      return;
    }
    if (result.id) router.push(`/recommendations/${result.id}`);
  }

  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl">Requirements</CardTitle>
        <CardDescription className="text-sm">Prompt and questionnaire. All fields optional except at least one.</CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt_input">Describe your needs (optional)</Label>
            <textarea
              id="prompt_input"
              className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-[100px]"
              placeholder="e.g. Web app with 10k monthly users, need database and file storage in EU..."
              {...register('prompt_input')}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="monthly_users">Expected monthly users</Label>
              <Input
                id="monthly_users"
                type="number"
                placeholder="e.g. 10000"
                className="min-h-[44px]"
                {...register('monthly_users')}
              />
              {errors.monthly_users && (
                <p className="text-sm text-destructive">{errors.monthly_users.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="storage_gb">Storage (GB)</Label>
              <Input
                id="storage_gb"
                type="number"
                placeholder="e.g. 100"
                className="min-h-[44px]"
                {...register('storage_gb')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Compute workload</Label>
            <select
              className="flex min-h-[44px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register('compute_workload')}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="budget_range">Budget range (USD/month)</Label>
              <Input
                id="budget_range"
                placeholder="e.g. 100-500"
                className="min-h-[44px]"
                {...register('budget_range')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Preferred region</Label>
              <Input
                id="region"
                placeholder="e.g. us-east-1"
                className="min-h-[44px]"
                {...register('region')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="security_level">Security level</Label>
            <Input
              id="security_level"
              placeholder="e.g. standard, high, compliance"
              className="min-h-[44px]"
              {...register('security_level')}
            />
          </div>

          {submitError && (
            <p className="text-sm text-destructive">{submitError}</p>
          )}

          <Button type="submit" className="h-11 w-full min-h-[44px]" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Get recommendation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
