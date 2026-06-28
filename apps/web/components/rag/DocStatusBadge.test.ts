import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { DocumentSummary } from '~/composables/useDocuments'
import DocStatusBadge from './DocStatusBadge.vue'

/**
 * 仕様の正: .workspace/relay-ui/Tag.jsx の StatusBadge。
 * ドット付きバッジで状態を日本語表示し、進行中の状態はドットを点滅させる。
 */
describe('DocStatusBadge', () => {
  it.each<[DocumentSummary['status'], string]>([
    ['ready', '処理済'],
    ['processing', '処理中'],
    ['uploading', 'アップロード中'],
    ['failed', 'エラー'],
    ['deleting', '削除中'],
  ])('%s を「%s」と表示する', (status, label) => {
    const wrapper = mount(DocStatusBadge, { props: { status } })
    expect(wrapper.text()).toBe(label)
  })

  it.each<DocumentSummary['status']>(['processing', 'uploading', 'deleting'])(
    '進行中状態(%s)はドットを点滅させる',
    (status) => {
      const wrapper = mount(DocStatusBadge, { props: { status } })
      expect(wrapper.find('.animate-pulse').exists()).toBe(true)
    },
  )

  it.each<DocumentSummary['status']>(['ready', 'failed'])(
    '確定状態(%s)はドットを点滅させない',
    (status) => {
      const wrapper = mount(DocStatusBadge, { props: { status } })
      expect(wrapper.find('.animate-pulse').exists()).toBe(false)
    },
  )

  it('ドットを1つ表示する', () => {
    const wrapper = mount(DocStatusBadge, { props: { status: 'ready' } })
    expect(wrapper.findAll('span.rounded-full').length).toBeGreaterThanOrEqual(1)
  })
})
