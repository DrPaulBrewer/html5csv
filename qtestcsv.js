// qunit tests for html5csv.js
// (C) Copyright 2013 Dr Paul Brewer
// License:  GNU GPL v3
// see file html5csv.js for additional license details

localStorage.clear();
sessionStorage.clear();

test("CSV exists", 1, function(){
    ok(!!CSV, "CSV exists");
});

test("CSV has begin, extend methods",2,function(){
    ok( (typeof CSV.begin ==="function"), "CSV.begin");
    ok( (typeof CSV.extend ==="function"), "CSV.extend");
});

test("CSV.begin() requires valid parameter(s)",1,function(){
    throws(function(){CSV.begin()}, "no parameters");
});

test("CSV.extend() requires valid parameter(s)",5,function(){
    throws(function(){CSV.extend()}, "no parameters");
    throws(function(){CSV.extend(function(){}, null)}, "CSV.extend(func,null)");
    throws(function(){CSV.extend(null, function(){})}, "CSV.extend(null,func)");
    throws(function(){CSV.extend("hello")}, "CSV.extend(string)");
    throws(function(){CSV.extend(34)}, "CSV.extend(number)");
});

function randomData(n,m){
    var h = 'abcdefghijklmnopqrstuvwxyz'.split('');
    var data = [];
    var i,j,row;
    data.push(h.slice(0,m));
    for(i=0;i<n;++i){
	row=[];
	for(j=0;j<m;++j){
	    row.push(Math.random());
	}
	data.push(row);
    }
    return data;
}

function totallyRandomData(){
    var n = 100 + Math.floor(Math.random()*400);
    var m = 5 + Math.floor(Math.random()*10);
    return randomData(n,m);
}

asyncTest("session CSV create", 7, function(){
    var csvName = "session/qtest1";
    var csvdata = totallyRandomData();
    window.sessionStorage.clear();
    CSV.begin(csvdata).save(csvName).go(
	function(e,D){
	    ok(!e, "errors: "+e);
	    ok(!!D, "data non-null");
	    ok(!!csvdata, "csvdata input non-null");
	    ok(!!D.rows, "data.rows non-null");
	    equal(D.rows.length, csvdata.length, "same # of rows");
	    deepEqual(D.rows, csvdata, "go -- data.rows matches input");
	}
    );
    setTimeout(
	function(){ 
	    ok(!!window.sessionStorage[csvName], "session storage entry exists");
	    start();
	},
	2000);
});


asyncTest("%U creates uniformRandomMatrix",13,function(){
    CSV.begin('%U',{}).go(function(e,D){
	ok(e,"should give error: "+e);
	equal(D,null,"D should be null");
    });
    CSV.begin('%U',{dim:[1,100000]}).go(function(e,D){
	var sum=0.0, sumsq=0.0;
	ok(!e, "error: "+e);
	ok(!!D, "D exists");
	ok(!!D.rows, "D.rows exists");
	equal(D.rows.length, 1, "1 row");
	equal(D.rows[0].length, 100000, "100,000 cols");
	ok(Math.min.apply(Math,D.rows[0])>0.0, "smallest of 100,000 > 0.0");
	ok(Math.min.apply(Math,D.rows[0])<0.001, "smallest of 100,000 < 0.01");
	ok(Math.max.apply(Math,D.rows[0])<1.0, "largest of 100,000 < 1.0");
	ok(Math.max.apply(Math,D.rows[0])>0.999, "largest of 100,000 > 0.99");
	for(var i=0;i<100000;++i){
	    sum += D.rows[0][i];
	    sumsq += Math.pow(D.rows[0][i],2);
	}
	ok(Math.abs(sum-50000)<1000, "sum of 100,000 is 50,000 +/- 1,000");
	ok(Math.abs(sumsq-33333)<1000, "sumsq of 100,000 is 33,333 +/- 1,000");
	start();
    });
});

asyncTest("%N creates normalRandomMatrix",13,function(){
    CSV.begin('%N',{}).go(function(e,D){
	ok(e,"should give error: "+e);
	equal(D,null,"D should be null");
    });
    CSV.begin('%N',{dim:[1,100000]}).go(function(e,D){
	var sum=0.0, sumsq=0.0;
	ok(!e, "error: "+e);
	ok(!!D, "D exists");
	ok(!!D.rows, "D.rows exists");
	equal(D.rows.length, 1, "1 row");
	equal(D.rows[0].length, 100000, "100,000 cols");
	ok(Math.min.apply(Math,D.rows[0])>-6.0, "smallest of 100,000 > -6.0");
	ok(Math.min.apply(Math,D.rows[0])<-3.5, "smallest of 100,000 < -3.5");
	ok(Math.max.apply(Math,D.rows[0])>3,5, "largest of 100,000 > 3.5");
	ok(Math.max.apply(Math,D.rows[0])<6.0, "largest of 100,000 < 6.0");
	for(var i=0;i<100000;++i){
	    sum += D.rows[0][i];
	    sumsq += Math.pow(D.rows[0][i],2);
	}
	ok(Math.abs(sum)<1000, "sum of 100,000 is 0 +/- 1000");
	ok(Math.abs(sumsq-100000)<5000, "sumsq of 100,000 is 100,000 +/- 5,000");
	start();
    });
});

asyncTest("%I creates identityMatrix",6,function(){
    CSV.begin('%I',{}).go(function(e,D){
	ok(e,"should give error: "+e);
	equal(D,null,"D should be null");
    });
    CSV.begin('%I', {dim:[3,3]}).go(
	function(e,D){
	    ok(!e, "error: "+e);
	    ok(!!D, "D exists");
	    ok(!!D.rows, "D.rows exists");
	    deepEqual(D.rows,[[1,0,0],[0,1,0],[0,0,1]],"correct matrix");
	    start();
	}
    );
});

asyncTest("%D creates diagonalMatrix",6,function(){
    CSV.begin('%D',{}).go(function(e,D){
	ok(e,"should give error: "+e);
	equal(D,null,"D should be null");
    });
    CSV.begin('%D', {diag:[-7,3,0.5]}).go(
	function(e,D){
	    ok(!e, "error: "+e);
	    ok(!!D, "D exists");
	    ok(!!D.rows, "D.rows exists");
	    deepEqual(D.rows,[[-7,0,0],[0,3,0],[0,0,0.5]],"correct matrix");
	    start();
	}
    );
});


asyncTest("%F creates matrix from func(i,j)",4,function(){
    CSV.begin('%F',{}).go(function(e,D){
	ok(e,"should give error: "+e);
	equal(D,null,"D should be null");
    });
    CSV.begin('%F', {dim:[3,4], func: function(i,j){ return i*j }}).
	go(
	    function(e,D){
		ok(!e, "error: "+e);
		deepEqual(D.rows,
			  [
			      [0,0,0,0],
			      [0,1,2,3],
			      [0,2,4,6]
			  ],
			  "correct matrix"
			 );
		start();
	    }
	);
});


asyncTest("local CSV create", 3, function(){
    var csvname = "local/qtest1";
    var csvdata = totallyRandomData();
    window.localStorage.clear();
    CSV.begin(csvdata).save(csvname).go(
	function(e,D){
	    ok(!e, "errors: "+e); 
	    deepEqual(D.rows, csvdata, "go -- this.data.rows matches input");
	}
    );
    setTimeout(
	function(){
	    ok(!!window.localStorage[csvname], "local storage entry exists");
	    window.localStorage.clear();
	    start();
	},
	2000);
});

function postCreate(func, csvname, csvdata){
    return function(){
	var csvn = csvname || "session/qtest";
	var csvd = csvdata || totallyRandomData();
	window.sessionStorage.clear();
	CSV.begin(csvd).save(csvn).go(
	    function(e,unused){ 
		if (e) throw "onCreate:"+e;
		func.apply({}, [csvn,csvd] ) }
	);
    }
}

asyncTest("session CSV retrieve", 2, postCreate(function(csvname, csvdata){
    CSV.begin(csvname).go(
	function(e,D){
	    ok(!e, "errors: "+e); 
	    deepEqual(D.rows, csvdata, "retrieved data matches");
	    start();
	}
    );
},null,null));

     
     
asyncTest("local CSV to HTML table display and retrieve", 3, postCreate(function(csvname,csvdata){
    CSV.begin(csvname).table("tab1",{header:1, caption: 'CSV/HTML display-retrieve test data'}).go(
	function(e,D){
	    ok(!e, "errors: "+e); 
	    CSV.begin('#tab1').go(
		function(ee,DD){
		    ok(!ee,"errors: "+ee);
		    equal(JSON.stringify(D.rows), JSON.stringify(DD.rows), "data matches");
		}
	    );
	}
    );
    setTimeout(
	function(){
	    start();
	    $('#tab1').remove();
	}, 
	3000);
},null,null));


asyncTest("HTML table data retrieve -- check that new lines and white space are trimmed",3, function(){
    var newHTML = "<div id='tab1'><table>\n<tr>\n<th>      A    \n</th><th>  B    \n            \n</th><th>\n\nC</th></tr><tr><td>1</td><td>2\n\n\n\n\n      \n</td><td>3\n\n</td></tr><tr><td>     9            \n</td><td>       \n   8     \n</td><td>\n               7           \n</td>\n\n\n</tr>        \n       </table>       \n</div>";
    $(document.body).append(newHTML);
    setTimeout(function(){
	ok($('#tab1').html().split("\n").length>10, "jQuery retrieved html contains newlines");
    }, 200);
    setTimeout(function(){
	CSV.begin('#tab1').go(function(e,D){
	    ok(!e, "error: "+e);
	    deepEqual(D.rows, [['A','B','C'],[1,2,3],[9,8,7]], "retrieved correct data");
	}
			     );
    }, 300);
    setTimeout(function(){
	$('#tab1').remove();
	start();
    }, 500);
});


asyncTest("appendCol -- even/odd", 2, postCreate(function(csvname,csvdata){
    CSV.begin(csvname).
	appendCol("parity", [1,0]).
	go(function(e,D){
	    var checkdata = JSON.parse(JSON.stringify(csvdata)); // deep copy
	    var i,l;
	    for(i=1,l=checkdata.length; i<l; ++i) checkdata[i].push(i%2);
	    checkdata[0].push('parity');
	    ok(!e, "errors: "+e);
	    deepEqual(D.rows, checkdata, "data matches alternate calculation");
	    start();
	});
	    
}));

asyncTest("appendCol -- sum function, !rowprops", 3, postCreate(function(csvname,csvdata){
    CSV.begin(csvname).
	appendCol("sum", function(index,row){
	    for(var i=0,l=row.length,s=0;i<l;++i)
		s+=row[i];
	    return s;
	}, false).
	go(function(e,D){
	    var i,j,l,ll,s=0;
	    console.log(e);
	    console.log(D);
	    console.log(csvdata);
	    ok(!e, "errors: "+e);
	    ok(D.rows[0][csvdata[0].length]==='sum', "sets new colname 'sum'");
	    for(i=1,l=D.rows.length;i<l;++i){
		for(j=0,ll=D.rows[i].length-1;j<ll;++j)
		    s+=D.rows[i][j];
		s-=D.rows[i][ll]
	    }
	    ok(s===0, "bad test sum, should be zero, got: "+s);
	    start();
	});
}));

asyncTest("appendCol -- detect length mismatch", 2, postCreate(function(csvname,csvdata){
    CSV.begin(csvname).
	appendCol("parity", [1,0], "strict").
	go(function(e,D){
	    ok(e, "should report error: "+e);
	    equal(D, null, "null data expected");
	    start();
	});
	    
}));

asyncTest("editor -- do nothing", 6, postCreate(function(csvname,csvdata){
    CSV.begin(csvname).
	editor("ed1",true).
	go(function(e,D){
	    ok(!e, "errors: "+e); 
	    ok(!!D, "D not null");
	    ok(!!D.rows, "D.rows not null");
	    ok(D.rows.length, "D.rows.length not zero");
	    equal(D.rows.length, csvdata.length, "D.rows.length == csvdata.length");
	    equal(JSON.stringify(csvdata), 
		  JSON.stringify(D.rows),
		  'data unchanged');
	    start();
	});
    setTimeout(
	function(){
	    $('.editorDoneButton').click();
	},
	1000);
}));

asyncTest("editor -- change 2nd b to 8.5", 3, postCreate(function(csvname,csvdata){
    var old = csvdata[2][1];
    CSV.begin(csvname).
	editor("ed1",true).
	go(function(e,D){
	    ok(!e, "errors: "+e); 
	    equal(D.rows[2][1], 8.5, "new value set correctly");
	    D.rows[2][1] = old;
	    equal(JSON.stringify(csvdata), 
		  JSON.stringify(D.rows),
		  'data otherwise unchanged');
	    start();
	});
    setTimeout(
	function(){
	    // when forcing input into the editor, be sure to call change()
	    // which triggers the onchange() handler bound to that editor cell
	    $('#ed1 input[data-row="2"][data-col="1"]').val('8.5').change();
	}, 1000);
    setTimeout(
	function(){
	    $('.editorDoneButton').click();
	}, 1200);
    
}));

asyncTest("start editor from button using finalize -- then change 2nd b to 8.5", 4, postCreate(function(csvname,csvdata){
    var old = csvdata[2][1];
    $(document.body).append('<div id="testFinalizeDiv"></div>');
    $('#testFinalizeDiv').html("<button id='startEditorButton'>start</button>");
    var workflow = 
	CSV.begin(csvname).
	    editor("ed1",true).
	    finalize(function(e,D){
		ok(!e, "errors: "+e); 
		equal(D.rows[2][1], 8.5, "new value set correctly");
		D.rows[2][1] = old;
		equal(JSON.stringify(csvdata), 
		      JSON.stringify(D.rows),
		      'data otherwise unchanged');
		start();
		$('#testFinalizeDiv').remove();
	    });
    $('#startEditorButton').click(workflow);
    setTimeout(
	function(){
	    $('#startEditorButton').click();
	},
	1000);
    // click it twice to be annoying and make sure finalize only fires it once
    // check console log for the warning message
    setTimeout(
	function(){
	    equal(workflow(), null, "handler returns null when work in progress");
	},
	1050);    
    setTimeout(
	function(){
	    // when forcing input into the editor, be sure to call change()
	    // which triggers the onchange() handler bound to that editor cell
	    $('#ed1 input[data-row="2"][data-col="1"]').val('8.5').change();
	}, 3000);
    setTimeout(
	function(){
	    $('.editorDoneButton').click();
	}, 3500);
    
}));

asyncTest("editor -- change 52nd b to 8.5 with b=50,e=60", 3, postCreate(function(csvname,csvdata){
    var old = csvdata[52][1];
    CSV.begin(csvname).
	editor("ed1",true,50,60).
	go(function(e,D){
	    ok(!e, "errors: "+e); 
	    equal(D.rows[52][1], 8.5, "new value set correctly");
	    D.rows[52][1] = old;
	    equal(JSON.stringify(csvdata), 
		  JSON.stringify(D.rows),
		  'data otherwise unchanged');
	    start();
	});
    setTimeout(
	function(){
	    // when forcing input into the editor, be sure to call change()
	    // which triggers the onchange() handler bound to that editor cell
	    $('#ed1 input[data-row="52"][data-col="1"]').val('8.5').change();
	}, 1000);
    setTimeout(
	function(){
	    $('.editorDoneButton').click();
	}, 1200);
    
}));


asyncTest("editor -- change last a to 23, scrollable", 4, postCreate(function(csvname,csvdata){
    var lastRow = csvdata.length-1;
    var old = csvdata[lastRow][0];
    CSV.begin(csvname).
	editor("edscrollable",true).
	go(function(e,D){
	    ok(!e, "errors: "+e); 
	    equal(D.rows.length, lastRow+1, "lengths equal");
	    equal(D.rows[lastRow][0], 23, "new value set correctly");
	    D.rows[lastRow][0] = old;
	    equal(JSON.stringify(csvdata), 
		  JSON.stringify(D.rows),
		  'data otherwise unchanged');
	    start();
	});
    setTimeout(
	function(){
	    // when forcing input into the editor, be sure to call change()
	    // which triggers the onchange() handler bound to that editor cell
	    $('#edscrollable input[data-row="'+lastRow+'"][data-col="0"]').val('23').change();
	}, 1000);
    setTimeout(
	function(){
	    $('.editorDoneButton').click();
	}, 1200);
    
}));

asyncTest("editor -- change last a to 23 -- header off", 3, postCreate(function(csvname,csvdata){
    var lastRow = csvdata.length-1;
    var old = csvdata[lastRow][0];
    CSV.begin(csvname).
	editor("ed1",false).
	go(function(e,D){
	    ok(!e, "errors: "+e); 
	    equal(D.rows[lastRow][0], 23, "new value set correctly");
	    D.rows[lastRow][0] = old;
	    equal(JSON.stringify(csvdata), 
		  JSON.stringify(D.rows),
		  'data otherwise unchanged');
	    start();
	});
    setTimeout(
	function(){
	    // when forcing input into the editor, be sure to call change()
	    // which triggers the onchange() handler bound to that editor cell
	    $('#ed1 input[data-row="'+lastRow+'"][data-col="0"]').val('23').change();
	}, 1000);
    setTimeout(
	function(){
	    $('.editorDoneButton').click();
	}, 1200);
    
}));

var postLMlength = 4000;

function postLM(coeff, func){
    var M = randomData(postLMlength, 4);
    var i,l;
    M[0][4] = 'z';
    for(i=1,l=M.length;i<l;++i) M[i][4] = coeff[0]*M[i][0]+coeff[1]*M[i][1]+coeff[2]*M[i][2]+coeff[3]*M[i][3]+((coeff[4])? coeff[4]: 0)+((coeff[5])? coeff[5]*(Math.random()-0.5): 0.0);
    return postCreate(func, null, M);
}

asyncTest("appendCol, function with rowprop, compare with postLM",
	  postLMlength+1,
	  postLM([100,200,300,-400], function(csvname, csvdata){ 
	      CSV.begin(csvname).
		  appendCol("y", 
			    function(i,r){ 
				return 100*r.a+200*r.b+300*r.c-400*r.d;
			    },
			    true).
		  go(function(e,D){
		      var i,l;
		      ok(!e, "errors: "+e);
		      for(i=1,l=D.rows.length;i<l;++i) 
			  equal(D.rows[i][4],D.rows[i][5],"z===y row"+i);
		      start();
		  }
		    );
	  }));



asyncTest("ols, no intercept", 10, postLM([100,200,300,-400], function(csvname, csvdata){
    CSV.begin(csvname).
	ols([["fit1","z",["a","b","c","d"]]]).
	go(function(e,D){
	    ok(!e, "errors: "+e);
	    ok(!!D.fit, "D.fit exists");
	    ok(!!D.fit.fit1, "D.fit.fit1 exists");
	    equal(D.fit.fit1.dep, 'z', "D.fit.fit1.dep set to z");
	    deepEqual(D.fit.fit1.indep, ['a','b','c','d'], "D.fit.fit1.indep correct");
	    ok(!!D.fit.fit1.beta, "beta exists ["+D.fit.fit1.beta.join(',')+"]");
	    ok(Math.abs(D.fit.fit1.beta[0]-100)<1, "beta[0] between 99,101");
	    ok(Math.abs(D.fit.fit1.beta[1]-200)<2, "beta[1] between 198,202");
	    ok(Math.abs(D.fit.fit1.beta[2]-300)<3, "beta[2] between 297,303");
	    ok(Math.abs(D.fit.fit1.beta[3]+400)<4, "beta[3] between -404,-396");
	    start();
	});
}));

asyncTest("ols, estimate intercept, check zero",  11, postLM([100,200,300,-400], function(csvname, csvdata){
    CSV.begin(csvname).
	ols([["fit1","z",["a","b","c","d", 1]]]).
	go(function(e,D){
	    ok(!e, "errors: "+e); 
	    ok(!!D.fit, "D.fit exists");
	    ok(!!D.fit.fit1, "D.fit.fit1 exists");
	    equal(D.fit.fit1.dep, 'z', "D.fit.fit1.dep set to z");
	    deepEqual(D.fit.fit1.indep, ['a','b','c','d', 1], "D.fit.fit1.indep correct");
	    ok(!!D.fit.fit1.beta, "beta exists ["+D.fit.fit1.beta.join(',')+"]");
	    ok(Math.abs(D.fit.fit1.beta[0]-100)<1, "beta[0] between 99,101");
	    ok(Math.abs(D.fit.fit1.beta[1]-200)<2, "beta[1] between 198,202");
	    ok(Math.abs(D.fit.fit1.beta[2]-300)<3, "beta[2] between 297,303");
	    ok(Math.abs(D.fit.fit1.beta[3]+400)<4, "beta[3] between -404,-396");
	    ok(Math.abs(D.fit.fit1.beta[4])<1.0, "beta[4] (intercept) between -1,1");
	    start();
	}
	  );
}));

asyncTest("ols, estimate intercept, check -2.5",  11, postLM([100,200,300,-400,-2.5], function(csvname, csvdata){
    CSV.begin(csvname).
	ols([["fit1","z",["a","b","c","d", 1]]]).
	go(function(e,D){
	    ok(!e, "errors: "+e); 
	    ok(!!D.fit, "D.fit exists");
	    ok(!!D.fit.fit1, "D.fit.fit1 exists");
	    equal(D.fit.fit1.dep, 'z', "D.fit.fit1.dep set to z");
	    deepEqual(D.fit.fit1.indep, ['a','b','c','d', 1], "D.fit.fit1.indep correct");
	    ok(!!D.fit.fit1.beta, "beta exists ["+D.fit.fit1.beta.join(',')+"]");
	    ok(Math.abs(D.fit.fit1.beta[0]-100)<1, "beta[0] between 99,101");
	    ok(Math.abs(D.fit.fit1.beta[1]-200)<2, "beta[1] between 198,202");
	    ok(Math.abs(D.fit.fit1.beta[2]-300)<3, "beta[2] between 297,303");
	    ok(Math.abs(D.fit.fit1.beta[3]+400)<4, "beta[3] between -404,-396");
	    ok(Math.abs(D.fit.fit1.beta[4]+2.5)<0.01, "beta[4] (intercept) between -2.51,-2.49");
	    start();
	}
	  );
}));

asyncTest("numerically invalid ols, identical columns",  7, postLM([100,200,300,-400,-2.5], function(csvname, csvdata){
    CSV.begin(csvname).
	ols([["fit1","z",["a","b","c","d", 1, 1]]]).
	go(function(e,D){
	    ok(!e, "errors: "+e); 
	    ok(!!D.fit, "D.fit exists");
	    ok(!!D.fit.fit1, "D.fit.fit1 exists");
	    equal(D.fit.fit1.dep, 'z', "D.fit.fit1.dep set to z");
	    deepEqual(D.fit.fit1.indep, ['a','b','c','d', 1, 1], "D.fit.fit1.indep correct");
	    ok(!D.fit.fit1.beta, "beta absent");
	    ok(D.fit.fit1.error, "error string present, e:"+D.fit.fit1.error);
	    start();
	}
	  );
}));

asyncTest("multiple ols",  38, postLM([100,200,300,-400,-2.5], function(csvname, csvdata){
    // need to calculate what some reasonable (99%) tolerances should be
    // on some of these tests
    CSV.begin(csvname).
	ols([
	    ["fit1","z",["a","b","c","d", 1, 1]],
	    ["fit2","z",["a",1]],
	    ["fit3","z",["b",1]],
	    ["fit4","z",["c",1]],
	    ["fit5","z",["d",1]],
	    ["fit6","z",["a","b",1]],
	    ["fit7","z",["a","b","c",1]]
	]).
	go(function(e,D){
	    ok(!e, "errors: "+e); 
	    ok(!!D.fit, "D.fit exists");
	    ok(!!D.fit.fit1, "D.fit.fit1 exists");
	    ok(!!D.fit.fit2, "D.fit.fit2 exists");
	    ok(!!D.fit.fit3, "D.fit.fit3 exists");
	    ok(!!D.fit.fit4, "D.fit.fit4 exists");
	    ok(!!D.fit.fit5, "D.fit.fit5 exists");
	    ok(!!D.fit.fit6, "D.fit.fit6 exists");
	    ok(!!D.fit.fit7, "D.fit.fit7 exists");
	    equal(D.fit.fit1.dep, 'z', "D.fit.fit1.dep set to z");
	    equal(D.fit.fit2.dep, 'z', "D.fit.fit2.dep set to z");
	    equal(D.fit.fit3.dep, 'z', "D.fit.fit3.dep set to z");
	    equal(D.fit.fit4.dep, 'z', "D.fit.fit4.dep set to z");
	    equal(D.fit.fit5.dep, 'z', "D.fit.fit5.dep set to z");
	    equal(D.fit.fit6.dep, 'z', "D.fit.fit6.dep set to z");
	    equal(D.fit.fit7.dep, 'z', "D.fit.fit7.dep set to z");
	    deepEqual(D.fit.fit1.indep, ['a','b','c','d', 1, 1], "D.fit.fit1.indep correct");
	    deepEqual(D.fit.fit2.indep, ['a', 1], "D.fit.fit2.indep correct");
	    deepEqual(D.fit.fit3.indep, ['b', 1], "D.fit.fit3.indep correct");
	    deepEqual(D.fit.fit4.indep, ['c', 1], "D.fit.fit4.indep correct");
	    deepEqual(D.fit.fit5.indep, ['d', 1], "D.fit.fit5.indep correct");
	    deepEqual(D.fit.fit6.indep, ['a','b', 1], "D.fit.fit6.indep correct");
	    deepEqual(D.fit.fit7.indep, ['a','b','c', 1], "D.fit.fit7.indep correct");
	    ok(!D.fit.fit1.beta, "fit1.beta absent");
	    ok(D.fit.fit1.error, "fit1 error string present, e:"+D.fit.fit1.error);
	    function okfit(n,m,v,tol){
		var x = D.fit['fit'+n].beta[m];
		ok(Math.abs(x-v)<tol, 
		   "fit"+n+".beta["+m+"] "+x+" equals "+v+" +/- "+tol
		  );
	    }
	    okfit(2,0,100,20);
	    okfit(2,1,47.5,20);
	    okfit(3,0,200,40);
	    okfit(3,1,-2.5,20);
	    okfit(4,0,300,60);
	    okfit(4,1,-52.5,30);
	    okfit(5,0,-400,80);
	    okfit(5,1,297.5,60);
	    okfit(6,0,100,20);
	    okfit(6,1,200,50);
	    okfit(7,0,100,20);
	    okfit(7,1,200,40);
	    okfit(7,2,300,60);
	    start();
	}
	  );
}));
