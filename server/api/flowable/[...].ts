import { proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const path = event.path.replace(/^\/api\/flowable/, '')
    const target = `${config.flowableRestUrl}${path}`

    // Inject the internal Flowable credentials into the outgoing request
    const auth = Buffer.from(`${config.flowableAuthUser}:${config.flowableAuthPassword}`).toString('base64')

    // Nitro's proxyRequest handles streams, headers, and methods correctly
    return proxyRequest(event, target, {
        headers: {
            Authorization: `Basic ${auth}`
        }
    })
})
