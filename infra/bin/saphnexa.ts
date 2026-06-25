#!/usr/bin/env node
import { App, Validations } from 'aws-cdk-lib'
import { AwsSolutionsChecks } from 'cdk-nag'
import { SaphnexaStack } from '../lib/saphnexa-stack.js'

const app = new App()

const env = {
  ...(process.env['CDK_DEFAULT_ACCOUNT'] ? { account: process.env['CDK_DEFAULT_ACCOUNT'] } : {}),
  region: process.env['CDK_DEFAULT_REGION'] ?? 'us-east-1',
}

new SaphnexaStack(app, 'SaphnexaStack', { env })

Validations.of(app).addPlugins(
  new AwsSolutionsChecks(app, {
    verbose: true,
    writeSuppressionsToCloudFormation: true,
  }),
)

app.synth()
