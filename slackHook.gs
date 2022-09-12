/******************
This code will take your "notice" and insert details into slack notification and send it.
*/

function toSlack_Licence(notice) {
  for (let i = 0; i < notice.length; i++) {
    let companykey = Object.keys(notice[i])[0];

    const URL = notice[i][companykey]['url'];

    let payload = {
      "blocks": [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": 'This is a warning for "' + notice[i][companykey]['licenceName'] + '" licence.',
            "emoji": true
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "You are currently using *" + notice[i][companykey]['current'] + "* out of total of *" + notice[i][companykey]['owned'] + "* licences. "
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Trigger for this warning is set to *" + notice[i][companykey]['trigger'] + "*."
          }
        },
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Please order more licences or update trigger.",
            "emoji": true
          }
        }
      ]
    }

    var options = {
      method: "POST",
      payload: JSON.stringify(payload),
      headers: headers,
      // muteHttpExceptions: true,
    };
    var headers = {
      'Content-type': 'application/json',
    };
    var request = UrlFetchApp.fetch(URL, options);
  }
}
