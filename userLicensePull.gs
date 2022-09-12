/******************
Logs the license assignments, including the product ID and the sku ID, for the users in the domain.
Docs on https://developers.google.com/apps-script/advanced/admin-sdk-license-manager

You need to run this as an Admin user with access to see licences count.
>> You will have to enable "AdminLicenseManager" service <<
*/

// from https://developers.google.com/admin-sdk/licensing/v1/how-tos/products
function getLicenseAssignments() {
    const productIds = ['Google-Apps', '101033', '101031', '101037', 'Google-Drive-storage', 'Google-Vault', '101001', '101005', '101034']; // all
    let data = []
    let userSummary = []
  
    productIds.forEach(product => {
      var pageToken;
  
      do {
        let optionalArgs = {
          maxResults: 100,
          pageToken: pageToken
        }
  
        const page = AdminLicenseManager.LicenseAssignments.listForProduct(product, googleCustomerDomain, optionalArgs)
        const licenses = page.items
        pageToken = page.nextPageToken;
        licenses.forEach(prod => {
          data.push(prod.skuName)
        })
      } while (pageToken)
    })
  
    for (const i of data) {
      userSummary[i] = userSummary[i] ? userSummary[i] + 1 : 1;
    }
  
    return userSummary
  }
  
  function notifyUser(userSummary) {
  
    let notice = []
    /** Add your licences here, use "SKU Name" */
    const bought = {
      "Google Workspace Enterprise Plus": 100,
      "Google Voice Premier": 10,
    }
  
    /** Notification if spare licences will go under X */
    const trigger = {
      "Google Workspace Enterprise Plus": 20,
      "Google Voice Premier": -1,              // This will never trigger but it's easier then adding it again when needed.
    }
  
  for (const key of Object.keys(userSummary)){
      if (Object.hasOwnProperty.bind((trigger), (key))) {
        if (bought[key] - userSummary[key] <= trigger[key]) {
          notice.push({
            [key]: {
              "licenceName" : key,
              "owned": bought[key],
              "current": userSummary[key],
              "trigger": trigger[key],
              "url" : license_hook
            }
          })
        }
      }
    }
    return notice
  }
  
  function fullForUser() {
    const userSummary = getLicenseAssignments()
    const notice = notifyUser(userSummary)
    toSlack_Licence(notice)
  }
