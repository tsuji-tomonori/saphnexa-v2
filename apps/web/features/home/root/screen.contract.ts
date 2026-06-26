import { defineScreenContract } from '../../../shared/screen-contract'

export const rootScreen = defineScreenContract({
  id: 'SCR-HOME-ROOT',
  title: 'ホーム',
  summary: 'Saphnexa v2 の開発環境と API base を確認する初期画面',
  route: {
    name: 'home-root',
    path: '/',
    params: {},
    query: {},
  },
  access: {
    mode: 'public',
    permissions: [],
  },
  layout: 'default',
  apiDependencies: [],
  states: [
    {
      id: 'ready',
      summary: '初期画面を表示できる',
    },
  ],
  actions: [],
})
