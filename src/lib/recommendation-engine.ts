import type { QuestionnaireData, RecommendedService, CostEstimation, RoadmapStep } from '@/types/database';

const PROVIDERS = ['aws', 'azure', 'gcp'] as const;

function estimateCost(data: QuestionnaireData): { provider: string; total: number; services: RecommendedService[] } {
  const users = data.monthly_users ?? 1000;
  const storage = data.storage_gb ?? 50;
  const workload = (data.compute_workload ?? 'medium') as string;

  const computeCost = workload === 'high' ? 80 : workload === 'medium' ? 40 : 20;
  const storageCost = Math.ceil(storage / 10) * 2.5;
  const userScale = Math.min(users / 10000, 10) * 15;

  const total = Math.round(computeCost + storageCost + userScale);
  const services: RecommendedService[] = [
    { name: workload === 'high' ? 'EC2 / VM (4 vCPU)' : 'EC2 t3.medium', tier: 'Standard', estimated_cost_monthly: computeCost, description: 'Compute' },
    { name: 'S3 / Blob Storage', tier: 'Standard', estimated_cost_monthly: storageCost, description: 'Object storage' },
    { name: 'RDS / Managed DB', tier: 'Single-AZ', estimated_cost_monthly: Math.round(userScale * 0.6), description: 'Database' },
  ];
  return { provider: 'aws', total, services };
}

function buildRoadmap(provider: string): RoadmapStep[] {
  const steps: Record<string, RoadmapStep[]> = {
    aws: [
      { step: 1, title: 'Create AWS account', description: 'Sign up at aws.amazon.com and enable MFA.' },
      { step: 2, title: 'Configure VPC', description: 'Create a VPC with public/private subnets in your region.' },
      { step: 3, title: 'Deploy compute instances', description: 'Launch EC2 instances or use ECS for containers.' },
      { step: 4, title: 'Setup database', description: 'Create RDS instance or use Aurora for managed PostgreSQL/MySQL.' },
      { step: 5, title: 'Configure monitoring', description: 'Enable CloudWatch and set up alarms and dashboards.' },
    ],
    azure: [
      { step: 1, title: 'Create Azure account', description: 'Sign up at azure.microsoft.com and configure billing.' },
      { step: 2, title: 'Create resource group and VNet', description: 'Organize resources and define network topology.' },
      { step: 3, title: 'Deploy VMs or AKS', description: 'Launch virtual machines or Kubernetes cluster.' },
      { step: 4, title: 'Setup Azure SQL or Cosmos DB', description: 'Provision managed database services.' },
      { step: 5, title: 'Configure monitoring', description: 'Use Azure Monitor and Application Insights.' },
    ],
    gcp: [
      { step: 1, title: 'Create GCP project', description: 'Sign up at cloud.google.com and create a project.' },
      { step: 2, title: 'Configure VPC network', description: 'Set up VPC with subnets and firewall rules.' },
      { step: 3, title: 'Deploy Compute Engine or GKE', description: 'Launch VMs or Kubernetes cluster.' },
      { step: 4, title: 'Setup Cloud SQL or Firestore', description: 'Provision managed database.' },
      { step: 5, title: 'Configure monitoring', description: 'Use Cloud Monitoring and Logging.' },
    ],
  };
  return steps[provider] ?? steps.aws;
}

export function generateRecommendation(questionnaireData: QuestionnaireData): {
  provider: string;
  services: RecommendedService[];
  cost_estimation: CostEstimation;
  roadmap: RoadmapStep[];
  architecture_suggestion: string;
} {
  const { provider, total, services } = estimateCost(questionnaireData);
  const roadmap = buildRoadmap(provider);
  const cost_estimation: CostEstimation = {
    total_monthly: total,
    currency: 'USD',
    breakdown: services.map((s) => ({ service: s.name, cost: s.estimated_cost_monthly ?? 0 })),
  };
  const architecture_suggestion =
    'Recommended: Use a three-tier architecture with compute in public/private subnets, managed database, and object storage. Enable auto-scaling and multi-AZ for production.';
  return {
    provider: provider.toUpperCase(),
    services,
    cost_estimation,
    roadmap,
    architecture_suggestion,
  };
}

export function compareProviders(data: QuestionnaireData): { provider: string; estimated_monthly: number }[] {
  return PROVIDERS.map((p) => {
    const { total } = estimateCost(data);
    const modifier = p === 'azure' ? 1.05 : p === 'gcp' ? 0.98 : 1;
    return { provider: p.toUpperCase(), estimated_monthly: Math.round(total * modifier) };
  });
}
