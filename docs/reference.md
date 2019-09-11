#### Reference Doc
---

##### Defining an action in a step

Svatah action definition tells the platform what to do. Within the expression tag each action has specific task assigned. Please refer the below table.

> A typical steps looks like: `+type+ the username as *user@svatah.com* in field ~id:username~`

> or if you are using locator repository: `+type+ the ~username~ as *user@svatah.com*`

> where your locator repository stores, `username` as `id:username` 

##### Action reference :

|   sl  |   Action  |   Description     |       Syntax      |   Locator Required    |   Input Required    |
|-------|-----------|-------------------|-------------------|-----------------------|---------------------|
|1|click|click allows you to interact with UI elements such as buttons|+click+|Required|Not Required|
|2|clear|clear removes any existing data at the specified text elements.|+clear+|Required|Not Required|
|3|get text|get text fetches the data being displayed by the specified locator. This data is stored in a map and can be later reused for verification.(*future)|+get text+|Required|Not Required|
|4|type|type feeds the defined data in the specified text field.|+type+|Required|Required|
|5|submit|submit performs form submit action.|+submit+|Required|Not Required|
|6|dismiss alert|dismissAlert closes the showing alert on the current page.|+dismiss alert+|Required|Not Required|
|7|accept alert|acceptAlert performs accept action on the showing alert on the current page.|+accept alert+|Required|Not Required|
|8|wait|wait makes the execution wait for the specified time in seconds.|+wait+|Required|Required|
|9|is selected| is selected marks the step as failed if the specified element is not selected. Useful for Checkboxes.|+is selected+|Required|Not Required|
|10|is not selected|    is not selected marks the step as failed if the specified element is Selected. Useful for checkboxes.|+is not selected+|Required|Not Required|
|11|is displayed|is displayed marks the step as failed if the specified element is not displayed on the UI.|+assertDisplayed+|Required|Not Required|
|12|is not displayed|is not displayed marks the step as failed if the specified element is displayed on the UI.|+is not displayed+|Required|Not Required|
|13|is enabled|is enabled marks the step as failed if the specified element is not enabled on the UI.|+is enabled+|Required|Not Required|
|14|is disabled|is disabled marks the step as failed if the specified element is not disabled on the UI.|+is disabled+|Required|Not Required|
|15|is element present|is element present marks the step as failed if the specified element is not present.|+is element present+|Required|Not Required|
|16|is alert present|is alert present marks the step as failed if no alert is found at this instance.|+is alert present+|Required|Not Required|
|17|is alert not present|is alert not present marks the step as failed if any alert is found at this instance.|+is alert not present+|Required|Not Required|
|18|validates text|validates text validates the text displayed by specified locator with the defined text in data field.|+validates text+|Required|Required|
|19|contains text|contains text validates whether the text displayed by specified locator contains the defined text in data field.|+contains text+|Required|Required|
|20|validate tag name|validate tag name validates the tag name of the specified locator with the defined text in data field. Requires two input, viz tag name, value|+validate tag name+|Required|Required|
|21|validate attribute value|validate attribute value validates the value of the attribute of the specified locator with the defined text in data field. Requires two input, viz attribute name, value|+validate attribute value+|Required|Not Required|
|22|validate location|validate location validates the location of specified locator with the defined location info in the data field.|+validate location+|Required|Required|
|23|validate dimension|validate dimension validates the dimensions of the specified locator with the defined dimensions info in the data field.|+validate dimension+|Required|Required|
|24|validate rectangle|validate rectangle validates the rectangle structure of the specified locator with the defined dimensions in the data field.|+validate rectangle+|Required|Required|
|25|accept and validate alert text|accept the alert and validate alert text accepts the alert and then validates the displayed alert confirmation text with the defined text in the data field.|+accept the alert and validate alert text+|Required|Required|
|26|reject the alert and validate alert text|reject the alert and validate alert text rejects the alert and then validates the displayed alert confirmation text with the defined text in the data field.|+reject the alert and validate alert text+|Required|Required|
|27|invoke|invoke This call is used to invoke the api specified with the given name between identity tags viz ~api_name~. Please make sure that the API is mapped with the given name in the API Repository. Note : this action utilizes the current session cookies.|+invoke+|Required|Not Required|
|28|invoke without cookies|invoke without cookies is used to invoke the api specified with the given name between identity tags viz ~api_name~. Please make sure that the API is mapped with the given name in the API Repository. Note : this action doesn't use the current session cookies with the API call.|+invoke without cookies+|Required|Not Required|
|29|select by visible text|select by visible text selects the option using the text displayed to the user passed as input.|+select by visible text+|Required|Required|
|30|select by index|select by index selects the option using the index of the option shown to the user. You need to inspect the index and pass that in input.|+select by index+|Required|Required|
|31|select by value|select by value selects the option using the value of the option shown to the user. You need to inspect the value and pass that in input.|+select by value+|Required|Required|
|32|deselect all|deselect all deselects all the selected option by the user.|+deselect all+|Required|Not Required|
|33|deselect by visible text| deselect by visible text deselects the option using the text displayed to the user passed as input. |+deselect by visible text+|Required|Required|
|34|deselect by index| deselect by index deselects the option using the index of the option shown to the user. You need to inspect the index and pass that in input.|+deselect by index+|Required|Required|
|35|deselect by value|deselect by value deselects the option using the value of the option shown to the user. You need to inspect the value and pass that in input.|+deselect by value+|Required|Required|
|36|assert multiple selection is supported|assert multiple selection is supported asserts whether multiple selection of the given option is supported. It expects the output to be true and fails the step if it is false. |+assert multiple selection is supported+|Required|Required|
|37|assert multiple selection is not supported|assert multiple selection is not supported This asserts whether multiple selection of the given option is supported. It expects the output to be false and fails the step if it is true. |+assert multiple selection is not supported+|Required|Not Required|
|38|scroll into view|scroll into view scrolls till the element given as identifier comes into view.     |+scroll into view+|Required|Not Required|
|39|scroll to bottom|scroll to bottom scrolls to the bottom of the page. No need to pass any identifier. |+scroll to bottom+|Not Required|Not Required|
|40|scroll to top| scroll to top scrolls to the top of the page. No need to pass any identifier.        |+scroll to top+|Not Required|Not Required|
|41|wait for the presence|wait for the presence of the given identifier waits until the identifier becomes present or the max time out is reached. By default the timeout is 30 sec but you can increase the timeout by passing integer number as input in seconds.     |+wait for the presence+|Required|Not Required|
|42|wait for the visibility|wait for the visibility of the given identifier waits until the identifier becomes visible or the max time out is reached. By default the timeout is 30 sec but you can increase the timeout by passing integer number as input in seconds.|        +wait for the visibility+|Required|Not Required|
|43| open | opens the given url in the input in the current view |+open+|Not Required|Required|
|44| forward | performs forward button click of a browser | +forward+ | Not Required|Not Required|
|45| back | performs back button click of the browser | +back+ |Not Required|
|46| refresh | refreshes the current page | +refresh+ |Not Required|Not Required|
|47| switch to new window | switches to new window or tab which was opened |+switch to new window+|Not Required|Not Required|
|48| switch to main window |switches back to main windowor tab from the current child tab window|+switch to main window+|Not Required|Not Required|
|49| switch to frame | switches to frame highlighted by the element| +switch to frame+|Required|Not Required|
|50| close other windows| close all other windows or tabs except the main window| +close other windows+|Not Required|Not Required|
|51| clicks and holds| clicks and holds the given element at the center. This is equivalent to mouse down |+clicks and holds+|Required|Not Required|
|52| release | releases the held element. This should be used after click and hold. This is equivalent to mouse up |+release+|Not Required|Not Required|
|53| context click | performs context click on the given element | +context click+|Required|Not Required|
|54| double click | performs double click on the given element|+double click+|Required|Not Required|
|55| key up | performs keyboard press up event for the specified keys in input |+key up+|Required|Required|
|56| key down | performs keyboard press down event for the specified keys in input | +key down+ |Required|Required|
|57| move to element | move to element moves the cursor to the specified elements center | +move to element+ |Required|Not Required|
|58| move to element and click | move to element and click moves the cursor to the specified elements center and then performs click on the element. It is useful for elements which are currently not visible in view but are present | +move to element and click+ |Required|Not Required|
|59| validate title | validates title of the page| +validate title+|Not Required|Not Required|