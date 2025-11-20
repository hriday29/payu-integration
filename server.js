require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function generatePayUHash({ key, salt, txnid, amount, productinfo, firstname, email, udf = [] }) {
  const udfArr = Array.from({ length: 10 }, (_, i) => udf[i] || "");
  const hashString = [key, txnid, amount, productinfo, firstname, email, ...udfArr, salt].join("|");
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");
  return { hash, hashString };
}

app.get("/payu-test-form", (req, res) => {
  const key = process.env.PAYU_KEY;
  const salt = process.env.PAYU_SALT;
  const txnid = "txn_" + Date.now();
  const amount = "10.00";
  const productinfo = "Test Product";
  const firstname = "Harvey";
  const email = "hriday.vig@bluoryn.com";
  const phone = "9999999999";

  const udf = Array(10).fill("");
  const baseURL = process.env.NGROK_URL ? process.env.NGROK_URL.replace(/\/$/, "") : `http://localhost:${process.env.PORT || 5000}`;
  const surl = `${baseURL}/payu-success`;
  const furl = `${baseURL}/payu-failure`;

  // build hashString and hash (debug prints salt only locally)
  const udfArr = Array.from({ length: 10 }, (_, i) => udf[i] || "");
  const hashString = [key, txnid, amount, productinfo, firstname, email, ...udfArr, salt].join("|");
  const hash = require("crypto").createHash("sha512").update(hashString).digest("hex");

  // DEBUG: print the important values to terminal
  console.log("---- /payu-test-form ----");
  console.log("NGROK_URL:", process.env.NGROK_URL);
  console.log("baseURL:", baseURL);
  console.log("surl:", surl);
  console.log("furl:", furl);
  console.log("txnid:", txnid);
  console.log("hashString:", hashString);
  console.log("hash (first 16 chars):", hash.slice(0,16), "...");

  // if ?preview=1 then don't auto-submit (useful to inspect HTML)
  const autoSubmit = req.query.preview ? "" : 'onload="document.forms[\\\'payuForm\\\'].submit()"';

  res.send(`<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>PayU Redirect</title></head>
<body ${autoSubmit}>
  <h3>Redirecting to PayU (test)...</h3>
  <form name="payuForm" method="POST" action="https://test.payubiz.in/_payment">
    <input type="hidden" name="key" value="${key}" />
    <input type="hidden" name="txnid" value="${txnid}" />
    <input type="hidden" name="amount" value="${amount}" />
    <input type="hidden" name="productinfo" value="${productinfo}" />
    <input type="hidden" name="firstname" value="${firstname}" />
    <input type="hidden" name="email" value="${email}" />
    <input type="hidden" name="phone" value="${phone}" />
    <input type="hidden" name="surl" value="${surl}" />
    <input type="hidden" name="furl" value="${furl}" />
    ${Array.from({ length: 10 }, (_, i) => `<input type="hidden" name="udf${i+1}" value="" />`).join("\n    ")}
    <input type="hidden" name="hash" value="${hash}" />
    <input type="hidden" name="service_provider" value="payu_paisa" />
    <noscript><button type="submit">Pay Now</button></noscript>
  </form>
</body></html>`);
});

app.post("/payu-success", (req, res) => {
  console.log("🎉 Payment Success Redirect Received");
  console.log(req.body);
  res.send("Payment Success! Redirect received.");
});

app.post("/payu-failure", (req, res) => {
  console.log("❌ Payment Failure Redirect Received");
  console.log(req.body);
  res.send("Payment Failure received.");
});

app.post("/payu-webhook", (req, res) => {
  console.log("🔔 PayU Webhook Received");
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).send("OK");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 PayU Test Server running on http://localhost:${PORT}`);
});
