/**********************************
This code will be responsible for pulling details from your Google Workspace and sending notifications to Slack via generic webhook
Please check specific pages for detailed information.
*/

// Get all tokens and codes from project properties
const scriptProperties = PropertiesService.getScriptProperties()
license_hook = scriptProperties.getProperty("license_hook")
googleCustomerDomain = scriptProperties.getProperty("googleCustomerDomain")
  ;


function fullAll() {
  fullForUser()
  fullForChrome()
}
