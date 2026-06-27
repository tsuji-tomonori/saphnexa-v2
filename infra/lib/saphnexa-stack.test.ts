import { App } from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { describe, expect, it } from 'vitest'

import { SaphnexaStack } from './saphnexa-stack.js'

describe('SaphnexaStack', () => {
  it('CloudFormation テンプレートへ synth できる', () => {
    const app = new App()
    const stack = new SaphnexaStack(app, 'TestStack')

    const template = Template.fromStack(stack)

    expect(template.toJSON()).toHaveProperty('Parameters.BootstrapVersion.Type')
    expect(Object.keys(template.findResources('AWS::CDK::Metadata'))).toHaveLength(0)
  })
})
