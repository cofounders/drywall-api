var paypal_api = require('paypal-rest-sdk');
var config = require('../../app/config');
var prequest = require('../../app/modules/prequest');
var paypalMode = config.paypal.mode;
var url = require('url');
var moment = require('moment');
var basicAuth = require('basic-auth-header');

paypal_api.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': config.paypal[paypalMode].clientId,
  'client_secret': config.paypal[paypalMode].secret
});

var billingPlanAttributes = {
  'name': 'Drywall Monthly Billing Plan',
  'description': 'Drywall Billing Plan Template',
  'type': 'INFINITE',
  'merchant_preferences': {
    'auto_bill_amount': 'YES',
    'return_url': 'http://drywall-api-staging.herokuapp.com',
    'cancel_url': 'http://drywall-api-staging.herokuapp.com/404'
  },
  'payment_definitions': [{
    'amount': {
      'currency': 'USD',
      'value': '18'
    },
    'cycles': '0',
    'frequency': 'MONTH',
    'frequency_interval': '1',
    'name': 'Monthly 3 users',
    'type': 'REGULAR'
  }]
};

var billingPlanUpdateAttributes = [
  {
    'op': 'replace',
    'path': '/',
    'value': {
      'state': 'ACTIVE'
    }
  }
];

var billingAgreementAttributes = {
  'name': 'Drywall Agreement',
  'description': 'Agreement for Drywall Plan',
  'start_date': moment().add(2, 'hours').format(),
  'plan': {
    'id': 'P-123'
  },
  'payer': {
    'payment_method': 'paypal'
  }
};

function createBillingPlan() {
  // Create the billing plan
  paypal_api.billing_plan.create(billingPlanAttributes,
    function (error, billingPlan) {
    if (error) {
      console.log('failed1' + error);
    } else {
      console.log('Create Billing Plan');
      console.log(billingPlan);

      // Activate the plan by changing status to Active
      paypal_api.billing_plan.update(
        billingPlan.id,
        billingPlanUpdateAttributes,
        function (error, response) {
        if (error) {
          console.log('failed', error);
        } else {
          console.log('Billing Plan state changed to ' + billingPlan.state);
          billingAgreementAttributes.plan.id = billingPlan.id;

          // Use activated billing plan to create agreement
          paypal_api.billing_agreement.create(billingAgreementAttributes,
            function (error, billingAgreement) {
            if (error) {
              console.log('Error creating agreement: ', error);
            } else {
              console.log('Create Billing Agreement', billingAgreement);
              //console.log(billingAgreement);
              for (var index = 0; index < billingAgreement.links.length;
                index = index + 1) {
                if (billingAgreement.links[index].rel === 'approval_url') {
                  var approval_url = billingAgreement.links[index].href;
                  console.log('First redirect user to');
                  console.log(approval_url);

                  console.log('Payment token is');
                  console.log(url.parse(approval_url, true).query.token);
                  // See billing_agreements/execute.js to see
                  //example for executing agreement
                  // after you have payment token
                }
              }
            }
          });
        }
      });
    }
  });
}

function executeAgreement(token) {
  var ppConfig = config.paypal[paypalMode];

  prequest({
    url: ppConfig.url + '/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': basicAuth(ppConfig.clientId, ppConfig.secret)
    },
    body: 'grant_type=client_credentials'
  }).then(function (oauth) {
    prequest('https://api.sandbox.paypal.com/v1/payments/billing-agreements/' +
        token + '/agreement-execute', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + oauth.access_token,
        'Content-Type': 'application/json'
      }
    }).then(function (data) {
      console.log(data);
    }).catch(function (err) {
      console.error('Error executing agreement', err);
    });
  }).catch(function (err) {
    console.error('Error getting token', err);
  });
}

function postAgreement(token) {
  paypal_api.billing_agreement.execute(token, {},
    function (error, data) {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  });
}

if (process.argv[2] === '1') {
  createBillingPlan();
} else {
  postAgreement(process.argv[3]);
}