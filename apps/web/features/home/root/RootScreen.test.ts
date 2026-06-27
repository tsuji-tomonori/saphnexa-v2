import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import RootScreen from './RootScreen.vue'

describe('RootScreen', () => {
  it('API base URL を表示する', () => {
    const wrapper = mount(RootScreen, {
      props: { apiBase: 'http://localhost:8787' },
    })

    expect(wrapper.get('h1').text()).toBe('Saphnexa v2')
    expect(wrapper.text()).toContain('API base: http://localhost:8787')
  })
})
