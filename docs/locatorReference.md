### Locator Reference
---

#### Defining a Locator Type in a step

Locator type helps the platform to understand what kind of locator strategy you are going to use to find the element. You can either define locator within the identifier tags or use locator repository.

#### LocatorType reference :

|	LocatorType		|	Description					|	supported keywords	|	Syntax	|
|-------------------|-------------------------------|-----------------------|-----------|
|id|The id strategy looks for an element in the page having an id attribute corresponding to the specified pattern.|`id`|id:Locator|
|cssSelector|The cssSelector locator strategy uses CSS selectors to find the elements in the page.|`cssSelector`, `css selector`, `css`|css:Locator|
|name|	Like the Id strategy, but on the name attribute. You can also specify a filter to refine your locator.|`name`|name:Locator|
|className	|The className strategy looks for an element in the page having a class name corresponding to the specified pattern.|`className`, `class`|class:Locator|
|linkText|This strategy is intended to select links only and selects the anchor element containing the specified text: linkText =The text of the link	|`linkText`, `link text`, `link`|linkText:Locator|
|xpath	|The xpath strategy works by locating elements that matches the javascript expression refering to an element in the DOM of the page.|`xpath`|xpath:Locator|
|partialLinkText| This strategy is intended to select links only and selects the anchor element containing the specified partial text using partialLinkText|`partialLinkText`, `partial link text` , `plt`|partialLinkText:Locator|
|tagName	| The tagName strategy looks for an element in the page having a tag attribute corresponding to the specified pattern.|`tagName`, `tag name`, `tag` |tagName:Locator|