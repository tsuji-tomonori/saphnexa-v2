import js from '@eslint/js'
import sonarjs from 'eslint-plugin-sonarjs'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import vueA11y from 'eslint-plugin-vuejs-accessibility'

const nuxtGlobals = {
  defineNuxtConfig: 'readonly',
  useRuntimeConfig: 'readonly',
}
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

const typeAwareRules = {
  '@typescript-eslint/await-thenable': 'error',
  '@typescript-eslint/no-floating-promises': 'error',
  '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-unsafe-argument': 'error',
  '@typescript-eslint/no-unsafe-assignment': 'error',
  '@typescript-eslint/no-unsafe-call': 'error',
  '@typescript-eslint/no-unsafe-member-access': 'error',
  '@typescript-eslint/no-unsafe-return': 'error',
  '@typescript-eslint/no-unnecessary-type-assertion': 'error',
  '@typescript-eslint/no-unnecessary-condition': 'warn',
  '@typescript-eslint/no-non-null-assertion': 'warn',
  '@typescript-eslint/only-throw-error': 'error',
  '@typescript-eslint/consistent-type-imports': 'off',
  '@typescript-eslint/no-import-type-side-effects': 'error',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
      ignoreRestSiblings: true,
    },
  ],
  '@typescript-eslint/switch-exhaustiveness-check': [
    'error',
    {
      allowDefaultCaseForExhaustiveSwitch: false,
      considerDefaultExhaustiveForUnions: false,
      requireDefaultForNonUnion: true,
    },
  ],
  eqeqeq: ['error', 'always', { null: 'ignore' }],
  curly: ['error', 'all'],
  'no-debugger': 'error',
  'no-console': ['error', { allow: ['warn', 'error'] }],
  complexity: ['warn', 12],
  'sonarjs/cognitive-complexity': ['warn', 15],
  'max-depth': ['warn', 4],
  'max-params': ['warn', 4],
  'max-lines-per-function': ['warn', { max: 80, skipBlankLines: true, skipComments: true }],
}

export default tseslint.config(
  {
    name: 'project/ignores',
    ignores: [
      '**/.nuxt/**',
      '**/.output/**',
      '**/dist/**',
      '**/coverage/**',
      '**/cdk.out/**',
      '**/*.generated.*',
      '**/__generated__/**',
    ],
  },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  ...vueA11y.configs['flat/recommended'],
  ...tseslint.configs.recommendedTypeChecked,
  {
    name: 'project/javascript',
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  sonarjs.configs.recommended,
  {
    name: 'project/type-aware',
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: typeAwareRules,
  },
  {
    name: 'project/vue-parser',
    files: ['**/*.vue'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      globals: nuxtGlobals,
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      'vue/no-v-html': 'error',
      'vue/no-mutating-props': 'error',
      'vue/no-side-effects-in-computed-properties': 'error',
      'vue/no-ref-as-operand': 'error',
      'max-lines-per-function': ['warn', { max: 120, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    name: 'project/nuxt-config-globals',
    files: ['apps/web/nuxt.config.ts'],
    languageOptions: {
      globals: nuxtGlobals,
    },
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
    },
  },
  {
    name: 'project/cdk-entrypoint',
    files: ['infra/bin/**/*.ts'],
    rules: {
      'sonarjs/constructor-for-side-effects': 'off',
    },
  },
  {
    name: 'project/client-boundary',
    files: ['apps/web/app/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@aws-sdk/*', 'aws-cdk-lib', 'aws-cdk-lib/*'],
              message: 'NuxtからAWSへ直接依存せず、Hono APIを経由してください。',
            },
          ],
        },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message: 'NuxtのアプリコードではuseRuntimeConfig()を使用してください。',
        },
      ],
    },
  },
  prettier,
)
