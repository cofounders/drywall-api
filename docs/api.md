_Drywall API Specification_

* * *

## Endpoints
[/:owner/:repository/coordinates](#coordinates) [GET/POST]
[/billing/:user/create](#create-billings) [POST]
[/billing/:user/update](#update-billings) [POST]
[/billing/:user/list](#list-billings) [GET]

## Authentication & Authorization

The following table summarizes the required (:white_check_mark:) and optional (:white_circle:) information when performing a request to the drywall API.

 * __Auth Header__: `Authorization : Bearer <auth0_id_token>`
 * __Github Token__: Github `access_token` in URL query or payload data
 * __Github User__: Github `user` in URL query or payload data

| Description | Type | Auth Header | Github Token | Github User |
| --- | --- | --- |--- | --- |
| Public Coordinates | `GET`| :white_circle: | :white_circle: | :white_circle: |
| Private Coordinates | `GET`| :white_check_mark:  | :white_check_mark: | :white_check_mark: |
| Public Coordinates | `POST`| :white_check_mark: | :white_check_mark: | :white_circle: |
| Private Coordinates | `POST`| :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Create Billing      | `POST` | :white_check_mark: | :white_circle: | :white_circle: |
| List Billings      | `GET` | :white_check_mark: | :white_check_mark: | :white_circle: |

### `Responses`
 * __404__ if no public or private repo was returned from github
 * __401__ if failed authorization for private repo
 * __400__ if missing or failed validation of params
 * __500__ if database actions fail
 * __200__ if all succeeds

## Coordinates
### `GET  /:owner/:repository/coordinates`
##### Sample Response
Array of coordinates, empty array if no coordinates
```
[{
  x: 1,
  y: 2,
  number: 70
}, ...
]
```

### `POST  /:owner/:repository/coordinates`
##### Sample Payload
Object of one set of coordinates
```
{
  x: 100,
  y: 200,
  number: 60
}
```

## Create Billings
### `POST /billing/:user/create`
Creating a billing plan for a :user requires the following 3 steps.

1. Create a billing plan
##### Sample Payload
Object of one billing plan
```js
{
  plan: 2,  // plan number [1-8]
  owner: "cofounders",  // github organisation to be paid
  returnUrl: "http://drywall.cf.sg",  // url when payment is completed
  cancelUrl: "http://drywall.cf.sg/pricing"  // url when user clicks cancel during payment
}
```

##### Sample Response
2a. If successful, redirect the user to the returned URL in the response to proceed with the payment.
2b. If it fails, 500 is returned.
```
{
  url: 'http://paypal.com/paymentUrl'
}
```

3a. Once the user has completed the payment, the user will be redirected to the `returnUrl`.
3b. If the user cancels when they are at the payment screen, the user will be redirected to the `cancelUrl`.
3c. If the payment fails (paypal goes down or our servers go down), the user will be redirected to the `returnUrl` with `?error=1` in the URL.

## Update Billings
### `POST /billing/:user/update`

## List Billings
### `GET /billing/:user/list`
List all organisations and paid organisations for this :user
##### Sample Response
Array of organisations for user `drywallcfsg`
```
[
  {
    "owner": "superdrywall"  // unpaid github organisation
  },
  {
    "owner": "cofounders",  // paid github organisation
    "plan": 2,  // plan number [1-8]
    "paidBy": "drywallcfsg",  // payee
    "nextBillingDate": "2014-08-31T10:00:00.000Z"
  }
]
```
