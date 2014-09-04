_Drywall API Specification_

* * *

## Endpoints
[/:owner/:repository/coordinates](#coordinates) [GET/POST]

[/billings](#billings) [GET/POST]

## Authentication & Authorization

The following table summarizes the required (:white_check_mark:) and optional (:white_circle:) information when performing a request to the drywall API.

 * __Auth Header__: `Authorization : Bearer <auth0_id_token>`
 * __Github Token__: Github `access_token` in URL query or payload data

| Description | Type | Auth Header | Github Token |
| --- | --- | --- |--- |
| Public Coordinates | `GET`| :white_circle: | :white_circle: |
| Private Coordinates | `GET`| :white_check_mark:  | :white_check_mark: |
| Public Coordinates | `POST`| :white_check_mark: | :white_check_mark: |
| Private Coordinates | `POST`| :white_check_mark: | :white_check_mark: |
| List Billings   | `GET` | :white_check_mark: | :white_check_mark: |
| Create/Change Billing      | `POST` | :white_check_mark: | :white_circle: |
| Cancel Billing  | `DELETE` | :white_check_mark: | :white_circle: |

### `Responses`
 * __200__ if all succeeds
 * __400__ if missing or failed validation of params
 * __401__ if failed authorization for private repo
 * __402__ if payment is required or plan has reached its limit
 * __404__ if no public or private repo was returned from github
 * __500__ if database actions fail

## Coordinates
### `GET  /:owner/:repo/coordinates`
##### Sample Response
Array of coordinates, empty array if no coordinates
```
[
  {
    x: 1,
    y: 2,
    number: 70
  },
  ...
]
```

### `POST  /:owner/:repo/coordinates`
##### Sample Payload
Object of one set of coordinates
```
{
  x: 100,
  y: 200,
  number: 60
}
```

## Billings
### `GET /billings`
List all github organisations and paid organisations belonging to this user
`user` is an Auth0 user id in the form `github|<7_numbers>` that is taken from the bearer token in the Authentication header.
##### Sample Response
Array of organisations for a user
```
[
  {
    "owner": "superdrywall"  // unpaid github organisation
  },
  {
    "owner": "cofounders",  // paid github organisation
    "plan": 2,  // plan number [1-8]
    "paidBy": "drywallcfsg",  // payer
    "nextBillingDate": "2014-08-31T10:00:00.000Z"
  }
]
```

### `POST /billings`
Create or change a billing plan for a user.

If an account already exists, the user's old plan will first be cancelled and a new billing plan is created. If the plan is 0, the current plan is cancelled.

Creating a billing plan for a user requires the following 3 steps.

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
