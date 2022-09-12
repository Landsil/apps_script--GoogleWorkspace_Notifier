/******************
This code will deal with "Chrome Enterprise Licence" for ChromeOS devices.

We will use build in library for it. You will need to enable "AdminDirectory" service.
https://developers.google.com/apps-script/advanced/admin-sdk-directory
https://developers.google.com/admin-sdk/directory/reference/rest/v1/chromeosdevices/list
*/

function getChromeOS() {
  var pageToken;
  var page;
  let data = [];
  let userSummary = [];

  do {
    page = AdminDirectory.Chromeosdevices.list('my_customer', {
      maxResults: 50,
      projection: 'BASIC',
      pageToken: pageToken,
      query: "status:provisioned",
    });

    var params = JSON.stringify(page.chromeosdevices);
    var params = JSON.parse(params)
    params.forEach(device => {
      data.push(device.status)
    })

    pageToken = page.nextPageToken;
  } while (pageToken);

  for (const i of data) {
    userSummary[i] = userSummary[i] ? userSummary[i] + 1 : 1;
  }
  return userSummary
}

function notifyChrome(userSummary) {

  let notice = []
  /** Add your licences here */
  const bought = {
    "ACTIVE": 246,
  }

  /** Notification if spare licences will go under X */
  const trigger = {
    "ACTIVE": 2,
  }

  for (const key of Object.keys(userSummary)) {
    if (Object.hasOwnProperty.bind((trigger), (key))) {
      if (bought[key] - userSummary[key] <= trigger[key]) {
        notice.push({
          "Chrome Enterprise upgrade": {
            "licenceName": "Chrome Enterprise upgrade",
            "owned": bought[key],
            "current": userSummary[key],
            "trigger": trigger[key],
            "url": license_hook
          }
        })
      }
    }
  }
  return notice
}

function fullForChrome() {
  const userSummary = getChromeOS()
  const notice = notifyChrome(userSummary)
  toSlack_Licence(notice)
}
