import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { Citation } from '~/composables/useRagChat'
import CitationList from './CitationList.vue'

/**
 * 仕様の正: .workspace/relay-ui/Chat.jsx の SourceCard。
 * 引用元を連番バッジ + 出典名 + 抜粋クオート + 「原典を開く」導線のカードで提示する。
 */
const citations: Citation[] = [
  { id: 'c1', documentId: 'd1', title: '就業規則.pdf', excerpt: '年次有給休暇を10日付与', page: 3 },
  { id: 'c2', documentId: 'd2', title: '給与規程.docx', excerpt: '賞与は年2回支給する' },
]

function at<T>(items: readonly T[], index: number): T {
  const value = items[index]
  if (value === undefined) throw new Error(`要素 ${index} が存在しません`)
  return value
}

function mountList(items: Citation[]) {
  // FileTypeBadge は auto-import 前提のため stub で代替する。
  return mount(CitationList, {
    props: { citations: items },
    global: { stubs: { FileTypeBadge: true } },
  })
}

describe('CitationList', () => {
  it('引用元が無い場合は何も描画しない', () => {
    const wrapper = mountList([])
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('引用元の件数を見出しに表示する', () => {
    const wrapper = mountList(citations)
    expect(wrapper.text()).toContain('引用元 2 件')
  })

  it('引用元ごとにカードを1枚描画する', () => {
    const wrapper = mountList(citations)
    expect(wrapper.findAll('button')).toHaveLength(2)
  })

  it('連番(index+1)・出典名・抜粋・原典導線を表示する', () => {
    const wrapper = mountList(citations)
    const first = at(wrapper.findAll('button'), 0)
    expect(first.text()).toContain('1')
    expect(first.text()).toContain('就業規則.pdf')
    // 抜粋は鉤括弧で囲む
    expect(first.text()).toContain('「年次有給休暇を10日付与」')
    expect(first.text()).toContain('原典を開く')
  })

  it('page があればページ番号を表示し、無ければ表示しない', () => {
    const wrapper = mountList(citations)
    const buttons = wrapper.findAll('button')
    expect(at(buttons, 0).text()).toContain('p.3')
    expect(at(buttons, 1).text()).not.toContain('p.')
  })

  it('カードクリックで preview イベントに当該 citation を渡す', async () => {
    const wrapper = mountList(citations)
    await at(wrapper.findAll('button'), 1).trigger('click')
    const emitted = wrapper.emitted('preview')
    expect(emitted).toHaveLength(1)
    expect(at(at(emitted ?? [], 0), 0)).toEqual(citations[1])
  })
})
