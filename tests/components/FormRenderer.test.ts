import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FormRenderer from '~/components/flowable/FormRenderer.vue'

describe('FormRenderer', () => {
    it('renders a simple text field', async () => {
        const form = {
            fields: [
                { id: 'firstName', name: 'First Name', type: 'text', placeholder: 'Enter name' }
            ]
        }
        const modelValue = { firstName: '' }

        const wrapper = await mountSuspended(FormRenderer, {
            props: {
                form,
                modelValue
            }
        })

        expect(wrapper.text()).toContain('First Name')
        expect(wrapper.find('input').attributes('placeholder')).toBe('Enter name')
    })

    it('updates modelValue when input changes', async () => {
        const form = {
            fields: [
                { id: 'firstName', name: 'First Name', type: 'text' }
            ]
        }
        const modelValue = { firstName: '' }

        const wrapper = await mountSuspended(FormRenderer, {
            props: {
                form,
                modelValue
            }
        })

        const input = wrapper.find('input')
        await input.setValue('John')

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ firstName: 'John' }])
    })
})
