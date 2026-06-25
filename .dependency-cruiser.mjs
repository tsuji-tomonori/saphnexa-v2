export default {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'web-must-not-import-api-or-infra',
      severity: 'error',
      from: { path: '^apps/web/' },
      to: { path: '^(apps/api|infra)/' },
    },
    {
      name: 'api-must-not-import-web',
      severity: 'error',
      from: { path: '^apps/api/' },
      to: { path: '^apps/web/' },
    },
  ],
  options: {
    tsConfig: { fileName: 'tsconfig.base.json' },
    doNotFollow: { path: 'node_modules' },
    exclude: '(^|/)(\\.nuxt|\\.output|dist|coverage|cdk\\.out)/',
  },
}
