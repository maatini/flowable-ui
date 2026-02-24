import { proxyRequest, removeResponseHeader } from 'h3'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const path = event.path.replace(/^\/api\/flowable/, '')
    const target = `${config.flowableRestUrl}${path}`

    // Inject the internal Flowable credentials into the outgoing request
    const auth = Buffer.from(`${config.flowableAuthUser}:${config.flowableAuthPassword}`).toString('base64')

    // Nitro's proxyRequest handles streams, headers, and methods correctly.
    // Ensure we don't drop the body for POST/PUT requests
    const isFormData = event.node.req.headers['content-type']?.includes('multipart/form-data')

    return proxyRequest(event, target, {
        headers: {
            Authorization: `Basic ${auth}`
        },
        sendStream: isFormData ? true : undefined,
        onResponse(event, response) {
            // Remove WWW-Authenticate header to prevent native browser login prompt on 401s
            removeResponseHeader(event, 'www-authenticate')
        }
    })
})
