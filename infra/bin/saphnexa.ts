#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { SaphnexaStack } from '../lib/saphnexa-stack.js'

const app = new cdk.App()

new SaphnexaStack(app, 'SaphnexaStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1'
  }
})
