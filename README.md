# PayU Payment Integration – Test Project

This repository was created for testing and experimentation while exploring PayU’s payment gateway flow, hashing logic, and redirect handling.

Earlier, I used Ngrok to expose the local server so I could receive test redirect URLs, responses, and confirmation emails during the PayU sandbox workflow. This helped verify:
- Payment request flow
- Hash generation
- Success/failure redirection
- Response validation
- Local debugging without deployment

Now that we have to integrate PayU into the main project, this test setup acts as a reference. As per the document shared, please review it; this will help make the overall integration easier and clearer.

------------------------------------------------------------

## Project Structure

payu-test/
- server.js
- hash.js
- index.html
- .env (not committed)
- package.json
- package-lock.json
- node_modules/ (ignored)

------------------------------------------------------------

## How This Test Setup Works

1. Local Express server (server.js)
   - /pay → initiates payment
   - /success → PayU success redirect
   - /failure → PayU failure redirect

2. Hash generation (hash.js)
   - Handles required payment hashes

3. Ngrok (earlier)
   - Used to expose localhost temporarily for redirect testing
   - Allowed receiving PayU sandbox redirect emails and callback responses

------------------------------------------------------------

## Usage (Test Mode)

Install dependencies:
npm install

Run the server:
node server.js

Expose via Ngrok (optional):
ngrok http 3000

------------------------------------------------------------

## Important Notes

- .env contains the merchant key, salt, and URLs — do NOT commit it.
- This repository is meant only for testing and for understanding the flow before full integration.
