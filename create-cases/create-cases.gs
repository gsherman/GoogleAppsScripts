/**************************/
/* Configurable Variables */

var dryRun=true; //If true, the data wil be validated, but the cases won't be created.

var loginName = "CHANGE_ME";
var password = "CHANGE_ME";
var caseApiUrl = 'https://CHANGE_ME.dovetailnow.com/api/v5/Cases';
/**************************/


/* Dependencies */
/* 
  LongRun: allows for long-running Google Apps Scripts (over 6 minutes)
    Script: https://github.com/inclu-cat/LongRun/blob/main/generated-gs/LongRun.gs
    Repo: https://github.com/inclu-cat/LongRun
    Blog: https://inclu-cat.net/2021/12/14/an-easy-way-to-deal-with-google-apps-scripts-6-minute-limit/
*/


var sheet = SpreadsheetApp.getActiveSheet();
var data = sheet.getDataRange().getValues();
var numberOfRows = data.length;
const params = [];

function Main(){
  executeLongRun("createCase", numberOfRows, params,"initializer","finalizer"); 
}

function createCase(i,params) {

    if (i == 0){return;} //dont process header row
    var rowNumber = i+1;
    console.log('createCase: processing item # ' + i + ' (row ' + rowNumber + ')' );

    var title = getByName('title',i); 
    var employeeId = getByName('employeeId',i); 
    var notes = getByName('notes',i); 
    var caseType = getByName('caseType',i); 
    var queue = getByName('queue',i);   
    var origin = getByName('origin',i);  
    var condition = getByName('condition',i);  
    
    var requestData = {         
      "Title": title,
      "caseType": caseType,
      "employeeId": employeeId,
      "origin": origin,
      "notes": notes,  
      "queue": queue,  
      "condition": condition,      
      "dryRun":dryRun,                                    
      "sensitive": "True",
      "createEvents": "True",
      "availableInPortal": "true",
      "severity":"",
      "concerningEmployeeId": "",
      "createDate": "",
      "portalCaseType": "",
      "priority": "",
      "labels": [],
      "status": "",
      "closeNotes": "",
      "closeDate": "",
      "alternateId": "",
      "originatorUserName": "",
      "ownerUserName": "",
      "correlationID": ""
    };
  
    var options = {
      'method' : 'post',
      'contentType': 'application/json',
      'payload' : JSON.stringify(requestData)
    };    
    options.headers = {"Authorization": "Basic " + Utilities.base64Encode(loginName + ":" + password)};
    options.muteHttpExceptions = true;    
    
    var response = UrlFetchApp.fetch(caseApiUrl, options);
    var responseBody = response.getContentText();
    var responseCode = response.getResponseCode()
    
    //console.log(responseBody);

    if (responseCode != 201 && responseCode != 400){
      setByName('response', i, responseCode);
      setByName('errors', i, responseBody)  
    }
    
    var responseData = JSON.parse(responseBody);
    
    setByName('response', i, responseCode) 
    setByName('caseId', i, responseData.identifier) 
    
    if (responseData.identifier){console.log('Created Case ' + responseData.identifier);}

    setByName('warnings', i, responseData.warnings) 
    setByName('errors', i, responseData.errors) 
    SpreadsheetApp.flush();    

}


function getByName(colName, row) {
  var col = data[0].indexOf(colName);
  if (col != -1) {
    return data[row][col];
  }
}

function setByName(colName, row, value) {
  var col = data[0].indexOf(colName);
  if (col != -1) {
    var cell= sheet.getRange(row+1, col+1, 1, 1);
    cell.setValue(value);
  }
}

// This function will be executed on first or restart. (optional)
function initializer(startIndex, params){
  console.log("initializer: startIndex=" + startIndex)
}

// This function will be called on interruption or when all processing is complete. (optional)
function finalizer(isFinished, params){
    console.log("finalizer: isFinished=" + isFinished)
}
