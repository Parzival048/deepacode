-- Seed cloud services knowledge base (run in Supabase SQL editor or via migration)
INSERT INTO public.cloud_services (provider, category, service_name, description, pricing_model) VALUES
('aws', 'compute', 'EC2', 'Elastic Compute Cloud - virtual servers', '{"model": "on-demand", "unit": "hour"}'),
('aws', 'compute', 'Lambda', 'Serverless function compute', '{"model": "per-invocation", "unit": "request"}'),
('aws', 'storage', 'S3', 'Object storage', '{"model": "per-gb", "unit": "GB"}'),
('aws', 'database', 'RDS', 'Managed relational database', '{"model": "instance-hour", "unit": "hour"}'),
('aws', 'database', 'DynamoDB', 'NoSQL key-value and document database', '{"model": "on-demand", "unit": "read-write"}'),
('azure', 'compute', 'Virtual Machines', 'Azure VMs', '{"model": "on-demand", "unit": "hour"}'),
('azure', 'compute', 'Functions', 'Serverless functions', '{"model": "per-execution", "unit": "execution"}'),
('azure', 'storage', 'Blob Storage', 'Object storage', '{"model": "per-gb", "unit": "GB"}'),
('azure', 'database', 'Azure SQL', 'Managed SQL database', '{"model": "vCore-hour", "unit": "hour"}'),
('gcp', 'compute', 'Compute Engine', 'Virtual machines', '{"model": "on-demand", "unit": "hour"}'),
('gcp', 'compute', 'Cloud Functions', 'Serverless', '{"model": "per-invocation", "unit": "invocation"}'),
('gcp', 'storage', 'Cloud Storage', 'Object storage', '{"model": "per-gb", "unit": "GB"}'),
('gcp', 'database', 'Cloud SQL', 'Managed MySQL/PostgreSQL', '{"model": "instance-hour", "unit": "hour"}')
;
