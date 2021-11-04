const axios = require("axios");

const createScriptTag = async (accessToken, shop) => {
  const url = `https://${shop}/admin/api/2020-10/script_tags.json`;
  const src = "https://test.com/test.js";

  let scriptTagExist = false;

  const shopifyHeader = (token) => ({
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": token,
  });

  const scriptTagBody = JSON.stringify({
    script_tag: {
      event: "onload",
      src,
    },
  });

  const getScriptTags = await axios.get(url, {
    headers: shopifyHeader(accessToken),
  });

  getScriptTags.data.script_tags.map((script) => {
    if (script.src == src) {
      scriptTagExist = true;
    }
  });

  if (!scriptTagExist) {
    await axios
      .post(url, scriptTagBody, { headers: shopifyHeader(accessToken) })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  } else {
    //IF THE SCRIPT TAG IS ALREADY INSTALLED, HERE IS WHERE YOU WILL BE DISPLAYING THE MESSAGE:
    //YOU HAVE ALREADY INSTALLED THE SCRIPTAG
    return JSON.stringify({ scriptTagStatus: true });
  }
};

const deleteScriptTag = async (accessToken, shop, scriptTagID) => {
  const url = `https://${shop}/admin/api/2020-10/script_tags/${scriptTagID}.json`;

  const shopifyHeader = (token) => ({
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": token,
  });

  await axios
    .delete(url, { headers: shopifyHeader(accessToken) })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => console.log(error));
};

module.exports = {
  createScriptTag,
  deleteScriptTag,
};
