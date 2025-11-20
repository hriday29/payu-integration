require("dotenv").config();
const crypto = require("crypto");

function generateHash(txnid) {
  const key = process.env.PAYU_KEY;
  const salt = process.env.PAYU_SALT;
  const amount = "10.00";
  const productinfo = "Test Product";
  const firstname = "Harvey";
  const email = "hriday.vig@bluoryn.com";
  const udf = Array(10).fill("").join("|");
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf}|${salt}`;
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");
  console.log("hashString:", hashString);
  console.log("hash:", hash);
}

generateHash("txn_test_001");
