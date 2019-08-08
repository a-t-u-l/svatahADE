#### Expression & Syntax
Flows constitutes the core of Svatah. It imbibes the behaviour driven approach by allowing you to verbosely express the UI flow you want to validate (which then is used in descriptive reporting) and uses expressions in steps to drive the flow. A typical expression is defined by their respective type tags.  

> Intents should be defined within pair of plus symbols : `+intent+`  
> Identities (Locator) should be defined within pair of tilda symbols : `~locator_type : locator~` or from locator repository  `~locator key~`  
> Input should be defined within pair of multiplication symbols : `*data*` or from data repository  `*$data*`

#### Step definition
A Step definition is logically one unique action which you want to perform on the web UI. A Step may specify following to work : `intent`, `identity`, `input` and `variable`.

Intent Expression :
```
+<Action_Type>+
```

Identity Declaration : 
```
~<Locator_Type> : <Locator>~
```

based on whether you want to pass locator information directly from step or from a property file.
Variable Declaration :
```
var : varName
```
(optional, if the intent generates output which needs to used later)

Input Specification :
```
*<Data>* or *<#varName#>*
```

if you want to use earlier step variable value. (optional, if the step requires data feed.)

A typical step looks like:
`+type+ the username *user@svatah.com* in field ~id:username~`

> check reference for action type and locator type mappings.

#### Scenario definition
A typical scenario consist of multiple steps definitions which are executed sequentially. A scenario is logically modular grouping of steps which makes up a business functionality. A scenario must have unique name across the project as a scenario can be reused by another flow. A typical scenario looks like:

```
scenario : I want to validate text
+type+ the username *user@svatah.com* in field ~id:username~
+type+ the password *abcd1234* in ~id:password~
+click+ on the login button using ~xpath://input[@value='Sign In']~
+click+ on the Schedule Build using ~xpath://li[4]/a/p~
+validateText+ on the Schedule Build Page using ~xpath://h1~ with *Schedule*
```