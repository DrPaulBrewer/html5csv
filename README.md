html5csv
========

Quickly create apps that generate, accept, analyze, plot, edit and store CSV tabular data all without a server.  Or with a server, too.  Extendable.

License: GPLv3

August 8, 2013. This is the first version of the README file.  

This is a work in progress and there is very limited documentation available
at this time.  

For now, the "docs" are this file, and the unit tests in qtestcsv.js

Example 1:

"Hello World"  

<a href="http://jsfiddle.net/DrPaulBrewer/zHN7g/">JSFiddle for Example 1: Hello World in html5csv</a>

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

0. CSV. accesses the CSV object created by html5csv.js  This is the only object
created in window. Every CSV workflow starts with begin, but nothing is called
until we hit go(). Steps may be asynchronous. 
1. begin Loads the data into the CSV engine;
2. table generates a table in the div named "output", or creates such a div;
3. save saves the table HTML 5 browser localStorage, key local/helloWorld, 
using LZString compression if available; 
4. go() starts the chain executing.  Execution of each step is asynchronous
and involves a brief delay in setTimeout before going to the next step.

<hr />

Example 2: Downloading HelloWorld.csv

<a href="http://jsfiddle.net/DrPaulBrewer/dzPZP/">JSFiddle Example 2 Downloading HelloWorld.csv</a>

Please do Example 1 before trying this one, or it won't work.

CSV.begin("local/helloWorld").download("HelloWorld.csv").go();

Downloads directly from the browser.  No server is involved. 

You should be able to send the CSV file to OpenOffice Spreadsheet or Excel
without a problem.

May not work on all browsers, but recent Chrome and Firefox seem ok.

Finally, to clear the data from your browser, you will need to do a general 
"delete cookies and other site and plugin data" from chrome's control panel.
I expect IE and Netscape have something similar.  Executing localStorage.clear()
in a console will only clear the local Storage for the current site, and it is
stored by site.

<hr />

Possibly, you want to do something a little more serious now,
like generate or upload numerical data, run a regression, or plot data. 

For more examples, read through the unit tests in qtestcsv.js

Documentation in some form will be forthcoming as I get time.

