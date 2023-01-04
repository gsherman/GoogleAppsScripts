# create-cases Google Apps Scripts
Example script for creating dovetail cases from a Google Sheet. 

More details: [Dovetail knowledgebase article: Example: Using the Dovetail API to create cases from data in a Google Sheet](https://support.dovetailsoftware.com/selfservice/solutions/show/1207)

### Dependencies 
#### LongRun: allows for long-running Google Apps Scripts (over 6 minutes)
* Script: https://github.com/inclu-cat/LongRun/blob/main/generated-gs/LongRun.gs
* Repo: https://github.com/inclu-cat/LongRun
* Blog: https://inclu-cat.net/2021/12/14/an-easy-way-to-deal-with-google-apps-scripts-6-minute-limit/


### Create a new Google Sheet 

Input Columns:
* title	
* employeeId	
* caseType	
* notes	
* condition	
* queue	
* origin	

Output Columns:
* caseId	
* response	
* warnings	
* errors															

![sheet.png](/images/sheet.png)

Example: https://docs.google.com/spreadsheets/d/1s0AN4sDUtuGlqJQ2WnF_4peCt2_zoFaL_vgzqd8k8a0/edit?usp=sharing

### Populate your data in the spreadsheet

* employeeId, title, and notes are required.
* condition can be either "open" or "closed". If left blank, it will be assumed to be "open"
* queue is optional. If specified, the case will be dispatched to that queue. If a queue is specified, then the condition must not be "closed"
* caseType is optional. If not specified, the default case type will be used
* origin is optional. If not specified, the default origin will be used


### Scripts
1. From the Google Sheet menu: Extensions --> Apps Scripts
1. Add the create-cases.gs script
    * Copy the create-cases.gs script
    * Click on the + button to add a file, of type Script
    * Paste the copied script into your script editor window
1. Add the LongRun.gs script
    * Copy the LongRun.gs script
	* Click on the + button to add a file, of type Script
    * Paste the copied script into your script editor window

1. Edit the create-cases.gs script, setting your loginName, password, and caseApiUrl (using your tenant)
1. Select the "Main" function, from the "function to run" dropdown
1. Click the Run button

The script will run, and will update the result into the output columns.
The response column should contain 201, indicating success, or 400, indicating failure. If failure, the errors column should be polulated with additional details.

#### Dry Run
By default, cases will NOT be created - just the data will be verified.
Once your data all looks good, edit the script, and change the `dryRun` variable to false.
Run the function again, and the cases will get created.

#### Example after script run
Here's an example showing the sheet after a script run (with dryRun=false)
Notice that the output columns have been populated, including the newly created case IDs, response code, and any errors.

![sheet2.png](/images/sheet2.png)

### Tips
* Once the script run starts, don't close the Execution Log, as this may cause the script run to be cancelled
* Once the script starts running, you can view the Google Sheet (in its own tab), and you should see the Response/Result data dynamically be populated
* Open the Executions pane (from the left sidebar) in a separate window, separate from the Code Editor window
    * This will show you the running script. 
    * You should see the first startup of the script (Function=Main, Type=Editor)
    * If the script runs for more than 4 minutes, you should then see the re-trigger (Function=_executeLongRun, Type=Time-Driven)
    * Clicking on one of those executions will show the logs from the script

### Additional References
[Getting Started with Dovetail APIs Guide](https://support.dovetailsoftware.com/selfservice/solutions/show/1199)

### Google Apps Scripts Timeout
Google Apps Scripts are limited to a script runtime of 6 minutes ([Quotas and Limits](https://developers.google.com/apps-script/guides/services/quotas?hl=en))
In order to workaround this, a LongRun script is used. This script will run for 4 minutes, pause for 1 minute, then run again, picking up where it left off. This will repeat until everything has been processed.

### Timing Tests
Here are a few timings from running this script, which should help you estimate how long your script will run

| Number of Cases | DryRun? | Total Time (seconds) | Total Time (Minutes) | seconds/case
| --------------- | ------- | -------------------- | -------------------- | ------------
| 100 | True | 91s | 1.5 | 0.91 s/case
| 400 | False | 240s | 4 | 0.6 s/case
| 1000 | False | 727s | 12 | 0.7 s/case






