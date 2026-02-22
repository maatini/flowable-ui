export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const path = event.path.replace(/^\/api\/flowable/, '')
    const method = event.method
    const body = method !== 'GET' ? await readBody(event).catch(() => undefined) : undefined
    const query = getQuery(event)

    // Use Basic Auth from config for Flowable
    const auth = Buffer.from(`${config.flowableAuthUser}:${config.flowableAuthPassword}`).toString('base64')

    try {
        const response = await $fetch(`${config.flowableRestUrl}${path}`, {
            method,
            body,
            query,
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json',
            },
        })
        return response
    } catch (error: any) {
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage: error.response?.statusText || 'Flowable API Error',
            data: error.data,
        })
    }
})
