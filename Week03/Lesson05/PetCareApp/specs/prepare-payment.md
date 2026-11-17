# Feature: Prepare payment details

## 1. User goal
Pet owners need this feature to select a pet service and view its price.
They can review the service details and payment amount before making payment.

## 2. Scope
The feature allows pet owners to select a service and receive a JSON payment summary without logging in.
It will not charge money, use a payment gateway, or create new database tables or EJS pages.

## 3. Request
The system uses the GET method with the URL /payments/prepare/:serviceId.
It requires a service ID from the URL to retrieve the service name and price from the mock catalogue.
Behavior for HTTP methods other than GET is out of scope.

## 4. Service catalogue
Service ID 1: Vaccination - $35
Service ID 2: Pet Grooming - $50
Service ID 3: Boarding - $80

Each service has a unique ID and a fixed price stored on the server.
Any payment amount provided by the client is ignored; the response amount is always taken from the server-side catalogue.

## 5. Successful response
The system returns HTTP 200 OK when a valid service ID is requested.
The JSON response must contain exactly five fields:
- serviceId: number
- serviceName: string
- amount: number, representing whole SGD dollars (for example, 35 means S$35)
- currency: string, always "sgd"
- status: string, always "READY_FOR_PAYMENT"

Example for service ID 1:

{
  "serviceId": 1,
  "serviceName": "Vaccination",
  "amount": 35,
  "currency": "sgd",
  "status": "READY_FOR_PAYMENT"
}

## 6. Unsuccessful response
The system returns HTTP 404 Not Found when the requested service ID does not identify a service in the catalogue, including malformed or negative IDs.
It returns the following JSON error message:

{
  "error": "Service not found"
}

## 7. Acceptance criteria
- AC1: Service ID 1 returns HTTP 200, Vaccination and amount 35.
- AC2: Service ID 2 returns HTTP 200, Pet Grooming and amount 50.
- AC3: Service ID 3 returns HTTP 200, Boarding and amount 80.
- AC4: Service ID 999 returns HTTP 404 with {"error":"Service not found"}.
- AC5: Every successful response contains exactly five fields with the correct data types, currency "sgd" and status "READY_FOR_PAYMENT".