import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FormRenderer from '../../app/components/flowable/FormRenderer.vue'

describe('FormRenderer', () => {
    const globalOptions = {
        stubs: {
            UFormGroup: {
                template: '<div><label>{{ $attrs.label }}</label><slot /></div>'
            },
            UInput: {
                props: ['modelValue'],
                template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
                emits: ['update:modelValue']
            },
            UCheckbox: {
                props: ['modelValue'],
                template: '<input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />',
                emits: ['update:modelValue']
            }
        }
    }

    it('renders a simple text field', async () => {
        const form = {
            fields: [
                { id: 'firstName', name: 'First Name', type: 'text', placeholder: 'Enter name' }
            ]
        }
        const modelValue = { firstName: '' }

        const wrapper = mount(FormRenderer as any, {
            props: {
                form,
                modelValue
            },
            global: globalOptions as any
        })

        expect(wrapper.text()).toContain('First Name')
        expect(wrapper.find('input').exists()).toBe(true)
    })

    it('updates modelValue when input changes', async () => {
        const form = {
            fields: [
                { id: 'firstName', name: 'First Name', type: 'text' }
            ]
        }
        const modelValue = { firstName: 'initial' }

        const wrapper = mount(FormRenderer as any, {
            props: {
                form,
                modelValue
            },
            global: globalOptions as any
        })

        const input = wrapper.find('input')
        await input.setValue('John')

        // With mount, emitted events should be captured immediately or on next tick
        expect(wrapper.emitted('update:modelValue')).toBeDefined()
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ firstName: 'John' }])
    })
})
