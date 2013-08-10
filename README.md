html5csv
========

####License: GPLv3

**Quickly create apps that generate, "upload", "download", slice, analyze, plot, edit and store CSV tabular data...**

... **all without a server** .  Or with a server, too.  Extendable.

Dependencies:  jQuery

Optional:  LZString (for compression), numeric.js (for analysis), qunit (for unit testing)

The optional libraries are authored by others and distributed under the MIT-License.  Verbatim copies recent as of
August 2013 are included in the external-free subdirectory.  

##Example 1: "Hello World"  

<a href="http://jsfiddle.net/DrPaulBrewer/zHN7g/">JSFiddle for Example 1: Hello World in html5csv</a>

In every introductory language class there is usually a "Hello World" program
that teaches the basics of how to get the language to do something by having
it print "Hello World".

Usually in a "Hello World" example one shows the boilerplate code that is common to most applications and the procedures
for getting the code to run.  Usually, the "Hello World" example merely prints "Hello World".

Here, we want to work with tabular or matrix data, so we need to go a little further.  

Example 1 will:

1. create some data
     * Hello and World as the column headings
     * Various names and their planets as the values. 
1. show how to get this data into CSV.begin()
2. Create and display an HTML table from the data.
3. Save the data in browser local storage, so it will still be there tomorrow, or at least for Example 2.

For HTML Boilerplate you would need to load at least jQuery and html5csv.js.  Optionally you could load
LZString for automatic (de)compression of objects being stored into local storage.

example1.html
```html
<!DOCTYPE html5>
<html>
<head>
  <title>html5csv Example 1: Hello World</title>
</head>
<body>
  <div id='output'></div>
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
  <script src="./external-free/lz-string-1.3.0.js"></script>
  <script src="./html5csv.js"></script>
  <script src="./example1.js"></script>
</body>
</html>
```

example1.js

```javascript
CSV.
  begin([
   ["Hello","World"],
   ["Paul","Earth"],
   ["Marvin","Mars"],
   ["Spock","Vulcan"]
         ]).
  table("output",{header:1,caption:"My First html5csv program"}).
  save("local/helloWorld").
  go();
```
  
#### How Example 1 works
1. CSV. accesses the CSV object created by html5csv.js  CSV. is the only global object
created by html5csv, on `window`. 
1. begin selects data to fetch into the CSV engine.  The chain of methods starting with begin and ending with go or finalize is queued internally as a CSV workflow.   
1. table will generates a table in the div named "output". If the div does not exist, it is appended to document.body
1. save will save the table data (and some meta data) in HTML 5 browser localStorage with key "local/helloWorld", 
using LZString compression if available; 
1. go() starts the chain of methods, or CSV workflow, executing.  Execution of each step is asynchronous
and involves a brief delay in setTimeout before going to the next step.  

----------------

## Example 2: Serverless browser-based "download" of HelloWorld.csv

<a href="http://jsfiddle.net/DrPaulBrewer/dzPZP/">JSFiddle Example 2 Downloading HelloWorld.csv</a>

Prerequisite:  Example 1 loads data that will be used by Example 2.  Do Example 1 first.

Also, Example #2 may not work on all browsers, but recent Chrome and Firefox seem ok.

In HTML, load jQuery, LZstring if you used it in example 1, and html5csv.js, and then generating a download
is a Javascript one-liner (and can also be tried from the console):

```javascript
CSV.begin("local/helloWorld").download("HelloWorld.csv").go();
```

Here, we access the data created in example 1.  

It was stored away in the  browser, and it will stay there until explicitly deleted.  

We are going to take that data, and generate a CSV file called "HelloWorld.csv" and output
it to the user. The data downloads directly from the browser.  No server is involved. 
 
The user will not have to click on a link, it is pushed at him.

### Being less pushy
For a better user experience, this code could be triggered by a click in the 
usual way, such as `$('#someButtton').on('click', function(){ CSV.begin.....go(); });`

### Clearing local storage
If you are working with the jsFiddle example, 
you could execute a  `localStorage.clear()` within the `jsFiddle javascript window` to clear the `local storage`.
Local Storage is stored by site, so if you go to another website, it will not be accessible, but it will become
available again when the browser is pointed at the site that stored it.  Otherwise, to clear the data from a browser, do a general 
a "delete cookies, storage, and other site and plugin data" from the browsers control panel.

### html5csv does Session storage too
A name like `session/helloWorld` (instead of `local/helloWorld`) would delete
data when the session tab or window is closed instead of keeping it potentially
forever... because then the data will be stored in `HTML 5 session storage` instead
of `HTML 5 local storage`.  

### and ajax
Names with slants that are not local/ or session/ must be mapped by a plugin,
possibly to a server.  No plugins are currently available, but one is under
development and testing.  Names beginning with a / are interpreted as local URLs, to
run through an ajax get.  The ajax get feature will be documented after some additional testing.

-------------

## CSV.begin(....)  tricks

Input capabilities include:
* prompting the user for an input file (in CSV format)
* scraping an HTML table
* reading local and session storage, which was demonstrated above
* creating special arrays of uniform or normal random variables
* arrays prefilled with zero, a number, or a diagonal,
* arrays generated by a user supplied function
* reading from URLs via ajax (same origin restriction applies unless the server sends a CORS header or supports JSONP)


####To "Upload" to the CSV app a file of CSV data from the user
```html
<input type='file' id='choose' />
```

```javascript
     CSV.begin('#choose').....go();
```

####Scraping an existing HTML table

Works the same way, but there is no HTML input element.  

The name in CSV.begin(name) can be a valid jQuery selector like \#divId, and if there are 
table rows as descendents it will gather the data.

####Examples with Basic Math

*    A 5x10 matrix of uniform [0,1] Random Variables
  `CSV.begin('%U', {dim: [5,10]}).do-stuff...go();`

*    A 1000x2 matrix of Normal (mean=0,var=1) Random Variables
naming the columns E1 and E2 in the first row
  `CSV.begin('%N', {dim: [1000,2], header:['E1','E2'}).do-stuff...go();`

*    A 5x5 matrix with 1 along the diagonal
  `CSV.begin('%I', {dim: [5,5]}).do-stuff....go();`
or
  `CSV.begin('%D', {diag: [1,1,1,1,1]}).do-stuff....go();`

*    A 100x100 matrix with values given by a function of row i, column j over [0,l-1]
  `CSV.begin('%F', {dim:[100,100], func: function(i,j){ return (1+i)/(1+j); }})......go();`

------
### Getting to the final data with `...go(finalCallbackFunction); `

go takes a Javascript `function` as a parameter.

We call this function the "final callback" function, because it is executed at the end of the workflow or when an error occurs.

If you don't supply a final callback function, a default is supplied for you:

default final callback:   `function(e,D){ if(e) console.log(e) }`


The default will log all errors to the console log.

But you can tell go() to do something useful with the data at the end of the CSV work flow... for example, you can pass the data rows to another function, or modify them and start another CSV workflow from the modified rows.

Let's say there is a dashboad function in your app that wants rows of data supplied as dashboard('draw', rows).  

If e is null, the data rows are in D.rows and the meta data (if any) is in D.meta.  

We could write an appropriate finalCallback as an anonymous function inline in the CSV workflow.  

```javascript
CSV.......go(
  function(e,D){
     if (e) return console.log(e);  //something went wrong and we return
     // if OK, then call our custom "dashboard"  function as discussed
     dashboard('draw', D.rows);  
});
```

#### Warning: CSV.....go(callback) is asynchronous, don't fall prey to the asynchronous/global-var anti-pattern

Do not set a global variable in the final callback and expect to retrieve the data immediately after go returns.

These accesses will almost always fail, because `...go(callback)` or `...go()` returns **almost immediately**, before the workflow has had
time to finish.  

The correct approach is to put all activity that depends on the final returned data in the final Callback.  

If you are a beginner and use to the imperative style of coding, (first do this, then do that) this may involve a shift
in your thinking towards a more functional style of coding (when event X happens, let function handleX handle it). The
browser environment generally favors such a shift of thinking in terms of functions that responsd to user clicks or changes
in forms.

Trying to use a callback as a way to return data into a global variable is a common AJAX anti-pattern, and questions 
appear on Stack Overflow every week about this regarding ajax calls: why the ajax doesn't work or why the return value disappears outside
of the ajax success function.  

Although CSV.....go() in many cases could have been implemented synchronously, htm5csv.js makes all workflow asynchronous to give
clear expectations and also allow the browser a pause to process other events between potentially intensive tasks.  

Asynchronous workflows can appear when involving user editing of input, supervised machine
learning, as well as ajax interactions with a server, when necessary.  


------

### Next steps

Possibly, you want to do something a little more serious now,
like generate or upload numerical data, run a regression, or plot data. 

More documentation, still a bit rough, can be found in the [wiki](https://github.com/DrPaulBrewer/html5csv/wiki).

If unsure about the wiki, look in the  [html5csv source code](https://github.com/DrPaulBrewer/html5csv/blob/master/html5csv.js)

For more examples, read through the unit tests in [qtestcsv.js](https://github.com/DrPaulBrewer/html5csv/blob/master/qtestcsv.js)

You can also [run the unit tests in my Qunit page](http://www.csvscript.com/dev/qtest.html)

