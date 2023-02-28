export async function onRequest(context) {
  context.passThroughOnException()

  const {request} = context
  const { pathname } = new URL(request.url)
  const cf = request.cf !== undefined ? request.cf : {}
  const headers = new Map(request.headers)

  let eventData = {
    req_method: request.method,
    req_pathname: pathname,
    req_lat: cf.latitude,
    req_lon: cf.longitude,
    req_continent: cf.continent,
    req_country: cf.country,
    req_region: cf.region,
    req_city: cf.city,
    req_timezone: cf.timezone,
    req_region_code: cf.regionCode,
    req_metro_code: cf.metroCode,
    req_postal_code: cf.postalCode,
    req_colo: cf.colo,
    req_cf_ray: headers.get('cf-ray'),
    req_referer: headers.get('referer'),
  }

  context.waitUntil(postLog(context, eventData))

  return await context.next()
}

function postLog (context, data) {
  return fetch('https://api.honeycomb.io/1/events/' + encodeURIComponent(context.env.HONEYCOMB_DATASET), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers([['X-Honeycomb-Team', context.env.HONEYCOMB_KEY]]) 
  })
}