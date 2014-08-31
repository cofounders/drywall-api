_DryWall API Specification_

* * *

## Endpoints
[/:owner/:repository/coordinates](#ownerrepositorycoordinates) [GET/POST]
[/billing/:user/create](#billingcreate) [POST]
[/billing/:user/execute](#billingexecute) [POST]
[/billing/:user/update](#billingupdate) [POST]
[/billing/:user/list](#billinglist) [POST]
[/paypal_callback](#paypal_callback) [POST]

## Authorization
###`GET  /:owner/:repository/coordinates`

__Public repo:__

 * No authorization required to `GET`

__Private repo:__

 * `Authorization : Bearer <auth0_id_token>` required in headers.
 *  Github `access_token` required in query param.

###`POST  /:owner/:repository/coordinates`
Same as `GET` except for:
__Private repo:__

 * Github `user` required in query param to check for paid access

### `Responses`
 * 404 if no public or private repo was returned from github
 * 401 if failed authorization for private repo
 * 400 if missing params
 * 500 if database actions fail

## Coordinates
###`GET  /:owner/:repository/coordinates`

### `Response`
Array of coordinates
```
[{
  x: 1,
  y: 2,
  number: 70
}, ...
]
```
## /billing/create

## /billing/execute

## /billing/update

## /paypal_callback