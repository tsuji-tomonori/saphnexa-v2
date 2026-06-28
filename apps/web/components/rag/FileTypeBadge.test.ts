import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import FileTypeBadge from './FileTypeBadge.vue'

/**
 * 仕様の正: .workspace/relay-ui/tokens.js の fileTypeStyle（PDF / DOC / XLS / TXT）。
 * 拡張子から種別を判定し、種別ラベルと配色クラス(ft-*)を割り当てる。
 */
describe('FileTypeBadge', () => {
  it.each([
    ['就業規則.pdf', 'PDF', 'ft-pdf'],
    ['議事録.doc', 'DOC', 'ft-doc'],
    ['提案書.docx', 'DOC', 'ft-doc'],
    ['売上.xls', 'XLS', 'ft-xls'],
    ['集計.xlsx', 'XLS', 'ft-xls'],
    ['名簿.csv', 'XLS', 'ft-xls'],
    ['memo.txt', 'TXT', 'ft-txt'],
  ])('%s を %s 種別として表示する', (fileName, label, klass) => {
    const wrapper = mount(FileTypeBadge, { props: { fileName } })
    expect(wrapper.text()).toBe(label)
    expect(wrapper.classes()).toContain(klass)
  })

  it('未知・拡張子なしは TXT 種別にフォールバックする', () => {
    expect(mount(FileTypeBadge, { props: { fileName: 'README' } }).classes()).toContain('ft-txt')
    expect(mount(FileTypeBadge, { props: { fileName: 'data.bin' } }).text()).toBe('TXT')
    expect(mount(FileTypeBadge, { props: {} }).classes()).toContain('ft-txt')
  })

  it('大文字拡張子も判定する', () => {
    const wrapper = mount(FileTypeBadge, { props: { fileName: 'REPORT.PDF' } })
    expect(wrapper.text()).toBe('PDF')
    expect(wrapper.classes()).toContain('ft-pdf')
  })

  it('size に応じて正方形の寸法を設定する', () => {
    const wrapper = mount(FileTypeBadge, { props: { fileName: 'a.pdf', size: 34 } })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('width: 34px')
    expect(style).toContain('height: 34px')
  })
})
