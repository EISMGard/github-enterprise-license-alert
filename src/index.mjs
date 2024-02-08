import { Octokit, App } from "octokit";


//import env vars
const authToken = process.env.GITHUB_TOKEN; 
const org = process.env.GITHUB_ORG;
const webhook_url = process.env.WEBHOOK_URL;

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
    auth: authToken
  })
  
const response1 = await octokit.request('GET /enterprises/{enterprise}/consumed-licenses', {
    enterprise: org,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

//console.log(response.data);
console.log("Total Seats Consumed:", response1.data.total_seats_consumed);
console.log("Total Seats Purchased:", response1.data.total_seats_purchased);

const consumed = response1.data.total_seats_consumed;
const purchased = response1.data.total_seats_purchased;
//console.log(typeof(consumed));
console.log("Percentage used:",purchased/consumed);
let total_licenses = purchased/consumed;


//https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
async function postJSON(data) {
  try {
    const response = await fetch(webhook_url, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
  
    });

    //const result = await response.json();
    //console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

//test
//total_licenses = 96
//console.log(total_licenses);

const data = { "text": "Nothing to see here..." };
if (total_licenses >= 80 && total_licenses < 90) {
  data.text = "⚠️ Warning! GitHub Enterprise License count between 80%-89% ⚠️";
  console.log(data)
  postJSON(data);
}else if (total_licenses >= 90 && total_licenses <= 95) {
  data.text = "⛔️ Alert: GitHub Enterprise License count is between 90%-95% ⛔️";
  console.log(data)
  postJSON(data);
}else if (total_licenses > 95)  {
  data.text = "🚨 💣 Alert: SEVERE! GitHub Enterprise License count is over 95% 💣 ️️🚨";
  console.log(data)
  postJSON(data);
}else {
  data.text = "All good in the hood."
  console.log(data)
}



