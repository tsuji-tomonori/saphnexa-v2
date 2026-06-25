import { Stack, type StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'

export class SaphnexaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)
  }
}
