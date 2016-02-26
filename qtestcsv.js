// qunit tests for html5csv.js
// (C) Copyright 2013 Dr Paul Brewer
// License:  Dual Licensed choice of GPLv3 or MIT
// see file html5csv.js for additional license details

/* jshint strict:true, undef:true, browser:true, qunit:true, jquery:true, lastsemic:true  */
/* globals CSV:false */

localStorage.clear();
sessionStorage.clear();

QUnit.test("CSV exists", function(assert){
    'use strict';
    assert.expect(1);
    assert.ok(CSV, "CSV exists");
});

QUnit.test("CSV has begin, extend methods",function(assert){
    'use strict';
    assert.expect(2);
    assert.ok( (typeof CSV.begin ==="function"), "CSV.begin");
    assert.ok( (typeof CSV.extend ==="function"), "CSV.extend");
});

QUnit.test("CSV.begin() requires valid parameter(s)",function(assert){
    'use strict';
    assert.expect(1);
    assert.throws(function(){CSV.begin();}, "no parameters");
});

QUnit.test("CSV.extend() requires valid parameter(s)",function(assert){
    'use strict';
    assert.expect(5);
    assert.throws(function(){CSV.extend()}, "no parameters");
    assert.throws(function(){CSV.extend(function(){}, null)}, "CSV.extend(func,null)");
    assert.throws(function(){CSV.extend(null, function(){})}, "CSV.extend(null,func)");
    assert.throws(function(){CSV.extend("hello")}, "CSV.extend(string)");
    assert.throws(function(){CSV.extend(34)}, "CSV.extend(number)");
});

function randomData(n,m){
    'use strict';
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
    'use strict';
    var n = 100 + Math.floor(Math.random()*400);
    var m = 5 + Math.floor(Math.random()*10);
    return randomData(n,m);
}

QUnit.test("issue 13, CSV.begin() should not have a method named literally 'undefined'", function(assert){
    'use strict';
    assert.expect(1);
    var csvdata = totallyRandomData();
    assert.ok(!CSV.begin(csvdata).hasOwnProperty('undefined'), "github tracker issue 13 absent");
});

QUnit.test("session CSV create", function(assert){
    'use strict';
    assert.expect(7);
    var done = assert.async();
    var csvName = "session/qtest1";
    var csvdata = totallyRandomData();
    window.sessionStorage.clear();
    CSV.begin(csvdata).save(csvName).go(
	function(e,D){
	    assert.ok(!e, "errors: "+e);
	    assert.ok(D, "data non-null");
	    assert.ok(csvdata, "csvdata input non-null");
	    assert.ok(D.rows, "data.rows non-null");
	    assert.equal(D.rows.length, csvdata.length, "same # of rows");
	    assert.deepEqual(D.rows, csvdata, "go -- data.rows matches input");
	}
    );
    setTimeout(
	function(){ 
	    assert.ok(window.sessionStorage[csvName], "session storage entry exists");
	    done();
	},
	2000);
});


QUnit.test("%U creates uniformRandomMatrix",function(assert){
    'use strict';
    assert.expect(13);
    var done = assert.async();
    CSV.begin('%U',{}).go(function(e,D){
	assert.ok(e,"should give error: "+e);
	assert.equal(D,null,"D should be null");
    });
    CSV.begin('%U',{dim:[1,100000]}).go(function(e,D){
	var sum=0.0, sumsq=0.0;
	assert.ok(!e, "error: "+e);
	assert.ok(D, "D exists");
	assert.ok(D.rows, "D.rows exists");
	assert.equal(D.rows.length, 1, "1 row");
	assert.equal(D.rows[0].length, 100000, "100,000 cols");
	assert.ok(Math.min.apply(Math,D.rows[0])>0.0, "smallest of 100,000 > 0.0");
	assert.ok(Math.min.apply(Math,D.rows[0])<0.001, "smallest of 100,000 < 0.01");
	assert.ok(Math.max.apply(Math,D.rows[0])<1.0, "largest of 100,000 < 1.0");
	assert.ok(Math.max.apply(Math,D.rows[0])>0.999, "largest of 100,000 > 0.99");
	for(var i=0;i<100000;++i){
	    sum += D.rows[0][i];
	    sumsq += Math.pow(D.rows[0][i],2);
	}
	assert.ok(Math.abs(sum-50000)<1000, "sum of 100,000 is 50,000 +/- 1,000");
	assert.ok(Math.abs(sumsq-33333)<1000, "sumsq of 100,000 is 33,333 +/- 1,000");
	done();
    });
});

QUnit.test("%N creates normalRandomMatrix",function(assert){
    'use strict';
    assert.expect(13);
    var done = assert.async();
    CSV.begin('%N',{}).go(function(e,D){
	assert.ok(e,"should give error: "+e);
	assert.equal(D,null,"D should be null");
    });
    CSV.begin('%N',{dim:[1,100000]}).go(function(e,D){
	var sum=0.0, sumsq=0.0;
	assert.ok(!e, "error: "+e);
	assert.ok(D, "D exists");
	assert.ok(D.rows, "D.rows exists");
	assert.equal(D.rows.length, 1, "1 row");
	assert.equal(D.rows[0].length, 100000, "100,000 cols");
	assert.ok(Math.min.apply(Math,D.rows[0])>-6.0, "smallest of 100,000 > -6.0");
	assert.ok(Math.min.apply(Math,D.rows[0])<-3.5, "smallest of 100,000 < -3.5");
	assert.ok(Math.max.apply(Math,D.rows[0])>3,5, "largest of 100,000 > 3.5");
	assert.ok(Math.max.apply(Math,D.rows[0])<6.0, "largest of 100,000 < 6.0");
	for(var i=0;i<100000;++i){
	    sum += D.rows[0][i];
	    sumsq += Math.pow(D.rows[0][i],2);
	}
	assert.ok(Math.abs(sum)<1000, "sum of 100,000 is 0 +/- 1000");
	assert.ok(Math.abs(sumsq-100000)<5000, "sumsq of 100,000 is 100,000 +/- 5,000");
	done();
    });
});

QUnit.test("%I creates identityMatrix",function(assert){
    'use strict';
    assert.expect(6);
    var done = assert.async();
    CSV.begin('%I',{}).go(function(e,D){
	assert.ok(e,"should give error: "+e);
	assert.equal(D,null,"D should be null");
    });
    CSV.begin('%I', {dim:[3,3]}).go(
	function(e,D){
	    assert.ok(!e, "error: "+e);
	    assert.ok(D, "D exists");
	    assert.ok(D.rows, "D.rows exists");
	    assert.deepEqual(D.rows,[[1,0,0],[0,1,0],[0,0,1]],"correct matrix");
	    done();
	}
    );
});

QUnit.test("%D creates diagonalMatrix",function(assert){
    'use strict';
    assert.expect(6);
    var done = assert.async();
    CSV.begin('%D',{}).go(function(e,D){
	assert.ok(e,"should give error: "+e);
	assert.equal(D,null,"D should be null");
    });
    CSV.begin('%D', {diag:[-7,3,0.5]}).go(
	function(e,D){
	    assert.ok(!e, "error: "+e);
	    assert.ok(D, "D exists");
	    assert.ok(D.rows, "D.rows exists");
	    assert.deepEqual(D.rows,[[-7,0,0],[0,3,0],[0,0,0.5]],"correct matrix");
	    done();
	}
    );
});


QUnit.test("%F creates matrix from func(i,j)",function(assert){
    'use strict';
    assert.expect(4);
    var done = assert.async();
    CSV.begin('%F',{}).go(function(e,D){
	assert.ok(e,"should give error: "+e);
	assert.equal(D,null,"D should be null");
    });
    CSV.begin('%F', {dim:[3,4], func: function(i,j){ return i*j }}).
	go(
	    function(e,D){
		assert.ok(!e, "error: "+e);
		assert.deepEqual(D.rows,
			  [
			      [0,0,0,0],
			      [0,1,2,3],
			      [0,2,4,6]
			  ],
			  "correct matrix"
			 );
		done();
	    }
	);
});


QUnit.test("local CSV create", function(assert){
    'use strict';
    assert.expect(3);
    var done = assert.async();
    var csvname = "local/qtest1";
    var csvdata = totallyRandomData();
    window.localStorage.clear();
    CSV.begin(csvdata).save(csvname).go(
	function(e,D){
	    assert.ok(!e, "errors: "+e); 
	    assert.deepEqual(D.rows, csvdata, "go -- this.data.rows matches input");
	}
    );
    setTimeout(
	function(){
	    assert.ok(window.localStorage[csvname], "local storage entry exists");
	    window.localStorage.clear();
	    done();
	},
	2000);
});

function postCreate(n, func, csvname, csvdata){
    'use strict';
    return function(assert){
	assert.expect(n);
	var done = assert.async();
	var csvn = csvname || "session/qtest";
	var csvd = csvdata || totallyRandomData();
	window.sessionStorage.clear();
	CSV.begin(csvd).save(csvn).go(
	    function(e,unused){ 
		if (e) throw "onCreate:"+e;
		func.apply({}, [assert,done,csvn,csvd] ) }
	);
    };
}

QUnit.test("session CSV retrieve", postCreate(2, function(assert, done, csvname, csvdata){
    'use strict';
    CSV.begin(csvname).go(
	function(e,D){
	    assert.ok(!e, "errors: "+e); 
	    assert.deepEqual(D.rows, csvdata, "retrieved data matches");
	    done();
	}
    );
},null,null));

     
     
QUnit.test("local CSV to HTML table display and retrieve", postCreate(3, function(assert,done,csvname,csvdata){
    'use strict';
    CSV.begin(csvname).table("tab1",{header:1, caption: 'CSV/HTML display-retrieve test data'}).go(
	function(e,D){
	    assert.ok(!e, "errors: "+e); 
	    CSV.begin('#tab1').go(
		function(ee,DD){
		    assert.ok(!ee,"errors: "+ee);
		    equal(JSON.stringify(D.rows), JSON.stringify(DD.rows), "data matches");
		}
	    );
	}
    );
    setTimeout(
	function(){
	    done();
	    $('#tab1').remove();
	}, 
	3000);
},null,null));


QUnit.test("HTML table data retrieve -- check that new lines and white space are trimmed",function(assert){
    'use strict';
    assert.expect(3);
    var done = assert.async();
    var newHTML = "<div id='tab1'><table>\n<tr>\n<th>      A    \n</th><th>  B    \n            \n</th><th>\n\nC</th></tr><tr><td>1</td><td>2\n\n\n\n\n      \n</td><td>3\n\n</td></tr><tr><td>     9            \n</td><td>       \n   8     \n</td><td>\n               7           \n</td>\n\n\n</tr>        \n       </table>       \n</div>";
    $(document.body).append(newHTML);
    setTimeout(function(){
	assert.ok($('#tab1').html().split("\n").length>10, "jQuery retrieved html contains newlines");
    }, 200);
    setTimeout(function(){
	CSV.begin('#tab1').go(function(e,D){
	    assert.ok(!e, "error: "+e);
	    assert.deepEqual(D.rows, [['A','B','C'],[1,2,3],[9,8,7]], "retrieved correct data");
	}
			     );
    }, 500);
    setTimeout(function(){
	$('#tab1').remove();
	done();
    }, 1000);
});


QUnit.test("appendCol -- even/odd",postCreate(2, function(assert,done,csvname,csvdata){
    'use strict';
    CSV.begin(csvname).
	appendCol("parity", [1,0]).
	go(function(e,D){
	    var checkdata = JSON.parse(JSON.stringify(csvdata)); // deep copy
	    var i,l;
	    for(i=1,l=checkdata.length; i<l; ++i) checkdata[i].push(i%2);
	    checkdata[0].push('parity');
	    assert.ok(!e, "errors: "+e);
	    assert.deepEqual(D.rows, checkdata, "data matches alternate calculation");
	    done();
	});
}));

QUnit.test("appendCol -- sum function, !rowprops", postCreate(3, function(assert,done,csvname,csvdata){
    'use strict';
    CSV.begin(csvname).
	appendCol("sum", function(index,row){
	    for(var i=0,l=row.length,s=0;i<l;++i)
		s+=row[i];
	    return s;
	}, false).
	go(function(e,D){
	    var i,j,l,ll,s=0;
	    assert.ok(!e, "errors: "+e);
	    assert.ok(D.rows[0][csvdata[0].length]==='sum', "sets new colname 'sum'");
	    for(i=1,l=D.rows.length;i<l;++i){
		for(j=0,ll=D.rows[i].length-1;j<ll;++j)
		    s+=D.rows[i][j];
		s-=D.rows[i][ll];
	    }
	    assert.ok(s===0, "bad test sum, should be zero, got: "+s);
	    done();
	});
}));

QUnit.test("appendCol -- detect length mismatch", postCreate(2, function(assert,done,csvname,csvdata){
    'use strict';
    CSV.begin(csvname).
	appendCol("parity", [1,0], "strict").
	go(function(e,D){
	    assert.ok(e, "should report error: "+e);
	    assert.equal(D, null, "null data expected");
	    done();
	});
    
}));

QUnit.test("editor -- do nothing", postCreate(6, function(assert,done,csvname,csvdata){
    'use strict';
    CSV.begin(csvname).
	editor("ed1",true).
	go(function(e,D){
	    assert.ok(!e, "errors: "+e); 
	    assert.ok(D, "D not null");
	    assert.ok(D.rows, "D.rows not null");
	    assert.ok(D.rows.length, "D.rows.length not zero");
	    assert.equal(D.rows.length, csvdata.length, "D.rows.length == csvdata.length");
	    assert.equal(JSON.stringify(csvdata), 
		  JSON.stringify(D.rows),
		  'data unchanged');
	    done();
	});
    setTimeout(
	function(){
	    $('.editorDoneButton').click();
	},
	1000);
}));

QUnit.test("editor -- change 2nd b to 8.5", postCreate(3, function(assert,done,csvname,csvdata){
    'use strict';
    var old = csvdata[2][1];
    CSV.begin(csvname).
	editor("ed1",true).
	go(function(e,D){
	    assert.ok(!e, "errors: "+e); 
	    assert.equal(D.rows[2][1], 8.5, "new value set correctly");
	    D.rows[2][1] = old;
	    assert.equal(JSON.stringify(csvdata), 
			 JSON.stringify(D.rows),
			 'data otherwise unchanged');
	    done();
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

QUnit.test("start editor from button using finalize -- then change 2nd b to 8.5", postCreate(4, function(assert,done,csvname,csvdata){
    'use strict';
    var old = csvdata[2][1];
    $(document.body).append('<div id="testFinalizeDiv"></div>');
    $('#testFinalizeDiv').html("<button id='startEditorButton'>start</button>");
    var workflow = 
	CSV.begin(csvname).
	    editor("ed1",true).
	    finalize(function(e,D){
		assert.ok(!e, "errors: "+e); 
		assert.equal(D.rows[2][1], 8.5, "new value set correctly");
		D.rows[2][1] = old;
		assert.equal(JSON.stringify(csvdata), 
		      JSON.stringify(D.rows),
		      'data otherwise unchanged');
		done();
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
	    assert.equal(workflow(), null, "handler returns null when work in progress");
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

QUnit.test("editor -- change 52nd b to 8.5 with b=50,e=60", postCreate(3, function(assert,done,csvname,csvdata){
    'use strict';
    var old = csvdata[52][1];
    CSV.begin(csvname).
	editor("ed1",true,50,60).
	go(function(e,D){
	    assert.ok(!e, "errors: "+e); 
	    assert.equal(D.rows[52][1], 8.5, "new value set correctly");
	    D.rows[52][1] = old;
	    assert.equal(JSON.stringify(csvdata), 
			 JSON.stringify(D.rows),
			 'data otherwise unchanged');
	    done();
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


QUnit.test("editor -- change last a to 23, scrollable", postCreate(4, function(assert,done,csvname,csvdata){
    'use strict';
    var lastRow = csvdata.length-1;
    var old = csvdata[lastRow][0];
    CSV.begin(csvname).
	editor("edscrollable",true).
	go(function(e,D){
	    assert.ok(!e, "errors: "+e); 
	    assert.equal(D.rows.length, lastRow+1, "lengths equal");
	    assert.equal(D.rows[lastRow][0], 23, "new value set correctly");
	    D.rows[lastRow][0] = old;
	    assert.equal(JSON.stringify(csvdata), 
			 JSON.stringify(D.rows),
		  'data otherwise unchanged');
	    done();
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

QUnit.test("editor -- change last a to 23 -- header off", postCreate(3, function(assert,done,csvname,csvdata){
    'use strict';
    var lastRow = csvdata.length-1;
    var old = csvdata[lastRow][0];
    CSV.begin(csvname).
	editor("ed1",false).
	go(function(e,D){
	    assert.ok(!e, "errors: "+e); 
	    assert.equal(D.rows[lastRow][0], 23, "new value set correctly");
	    D.rows[lastRow][0] = old;
	    assert.equal(JSON.stringify(csvdata), 
		  JSON.stringify(D.rows),
		  'data otherwise unchanged');
	    done();
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

function postLM(coeff, ntests, func){
    'use strict';
    var M = randomData(postLMlength, 4);
    var i,l;
    M[0][4] = 'z';
    for(i=1,l=M.length;i<l;++i) M[i][4] = coeff[0]*M[i][0]+coeff[1]*M[i][1]+coeff[2]*M[i][2]+coeff[3]*M[i][3]+((coeff[4])? coeff[4]: 0)+((coeff[5])? coeff[5]*(Math.random()-0.5): 0.0);
    return postCreate(ntests, func, null, M);
}

QUnit.test("appendCol, function with rowprop, compare with postLM",
	   postLM([100,200,300,-400], postLMlength+1, function(assert,done,csvname, csvdata){ 
	      'use strict';
	      CSV.begin(csvname).
		  appendCol("y", 
			    function(i,r){ 
				return 100*r.a+200*r.b+300*r.c-400*r.d;
			    },
			    true).
		  go(function(e,D){
		      var i,l;
		      assert.ok(!e, "errors: "+e);
		      for(i=1,l=D.rows.length;i<l;++i) 
			  assert.equal(D.rows[i][4],D.rows[i][5],"z===y row"+i);
		      done();
		  }
		    );
	   }));



QUnit.test("ols, no intercept", postLM([100,200,300,-400], 10, function(assert,done,csvname, csvdata){
    'use strict';
    CSV.begin(csvname).
	ols([["fit1","z",["a","b","c","d"]]]).
	go(function(e,D){
	    assert.ok(!e, "errors: "+e);
	    assert.ok(D.fit, "D.fit exists");
	    assert.ok(D.fit.fit1, "D.fit.fit1 exists");
	    assert.equal(D.fit.fit1.dep, 'z', "D.fit.fit1.dep set to z");
	    assert.deepEqual(D.fit.fit1.indep, ['a','b','c','d'], "D.fit.fit1.indep correct");
	    assert.ok(D.fit.fit1.beta, "beta exists ["+D.fit.fit1.beta.join(',')+"]");
	    assert.ok(Math.abs(D.fit.fit1.beta[0]-100)<1, "beta[0] between 99,101");
	    assert.ok(Math.abs(D.fit.fit1.beta[1]-200)<2, "beta[1] between 198,202");
	    assert.ok(Math.abs(D.fit.fit1.beta[2]-300)<3, "beta[2] between 297,303");
	    assert.ok(Math.abs(D.fit.fit1.beta[3]+400)<4, "beta[3] between -404,-396");
	    done();
	});
}));

QUnit.test("ols, estimate intercept, check zero",  postLM([100,200,300,-400], 11, function(assert,done,csvname, csvdata){
    'use strict';
    CSV.begin(csvname).
	ols([["fit1","z",["a","b","c","d", 1]]]).
	go(function(e,D){
	    assert.ok(!e, "errors: "+e); 
	    assert.ok(D.fit, "D.fit exists");
	    assert.ok(D.fit.fit1, "D.fit.fit1 exists");
	    assert.equal(D.fit.fit1.dep, 'z', "D.fit.fit1.dep set to z");
	    assert.deepEqual(D.fit.fit1.indep, ['a','b','c','d', 1], "D.fit.fit1.indep correct");
	    assert.ok(D.fit.fit1.beta, "beta exists ["+D.fit.fit1.beta.join(',')+"]");
	    assert.ok(Math.abs(D.fit.fit1.beta[0]-100)<1, "beta[0] between 99,101");
	    assert.ok(Math.abs(D.fit.fit1.beta[1]-200)<2, "beta[1] between 198,202");
	    assert.ok(Math.abs(D.fit.fit1.beta[2]-300)<3, "beta[2] between 297,303");
	    assert.ok(Math.abs(D.fit.fit1.beta[3]+400)<4, "beta[3] between -404,-396");
	    assert.ok(Math.abs(D.fit.fit1.beta[4])<1.0, "beta[4] (intercept) between -1,1");
	    done();
	}
	  );
}));

QUnit.test("ols, estimate intercept, check -2.5", postLM([100,200,300,-400,-2.5], 11, function(assert,done,csvname, csvdata){
    'use strict';
    CSV.begin(csvname).
	ols([["fit1","z",["a","b","c","d", 1]]]).
	go(function(e,D){
	    assert.ok(!e, "errors: "+e); 
	    assert.ok(D.fit, "D.fit exists");
	    assert.ok(D.fit.fit1, "D.fit.fit1 exists");
	    assert.equal(D.fit.fit1.dep, 'z', "D.fit.fit1.dep set to z");
	    assert.deepEqual(D.fit.fit1.indep, ['a','b','c','d', 1], "D.fit.fit1.indep correct");
	    assert.ok(D.fit.fit1.beta, "beta exists ["+D.fit.fit1.beta.join(',')+"]");
	    assert.ok(Math.abs(D.fit.fit1.beta[0]-100)<1, "beta[0] between 99,101");
	    assert.ok(Math.abs(D.fit.fit1.beta[1]-200)<2, "beta[1] between 198,202");
	    assert.ok(Math.abs(D.fit.fit1.beta[2]-300)<3, "beta[2] between 297,303");
	    assert.ok(Math.abs(D.fit.fit1.beta[3]+400)<4, "beta[3] between -404,-396");
	    assert.ok(Math.abs(D.fit.fit1.beta[4]+2.5)<0.01, "beta[4] (intercept) between -2.51,-2.49");
	    done();
	}
	  );
}));

QUnit.test("numerically invalid ols, identical columns", postLM([100,200,300,-400,-2.5], 7, function(assert,done,csvname, csvdata){
    'use strict';
    CSV.begin(csvname).
	ols([["fit1","z",["a","b","c","d", 1, 1]]]).
	go(function(e,D){
	    assert.ok(!e, "errors: "+e); 
	    assert.ok(D.fit, "D.fit exists");
	    assert.ok(D.fit.fit1, "D.fit.fit1 exists");
	    assert.equal(D.fit.fit1.dep, 'z', "D.fit.fit1.dep set to z");
	    assert.deepEqual(D.fit.fit1.indep, ['a','b','c','d', 1, 1], "D.fit.fit1.indep correct");
	    assert.ok(!D.fit.fit1.beta, "beta absent");
	    assert.ok(D.fit.fit1.error, "error string present, e:"+D.fit.fit1.error);
	    done();
	}
	  );
}));

QUnit.test("multiple ols",  postLM([100,200,300,-400,-2.5], 38, function(assert,done,csvname, csvdata){
    'use strict';
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
	    assert.ok(!e, "errors: "+e); 
	    assert.ok(D.fit, "D.fit exists");
	    assert.ok(D.fit.fit1, "D.fit.fit1 exists");
	    assert.ok(D.fit.fit2, "D.fit.fit2 exists");
	    assert.ok(D.fit.fit3, "D.fit.fit3 exists");
	    assert.ok(D.fit.fit4, "D.fit.fit4 exists");
	    assert.ok(D.fit.fit5, "D.fit.fit5 exists");
	    assert.ok(D.fit.fit6, "D.fit.fit6 exists");
	    assert.ok(D.fit.fit7, "D.fit.fit7 exists");
	    assert.equal(D.fit.fit1.dep, 'z', "D.fit.fit1.dep set to z");
	    assert.equal(D.fit.fit2.dep, 'z', "D.fit.fit2.dep set to z");
	    assert.equal(D.fit.fit3.dep, 'z', "D.fit.fit3.dep set to z");
	    assert.equal(D.fit.fit4.dep, 'z', "D.fit.fit4.dep set to z");
	    assert.equal(D.fit.fit5.dep, 'z', "D.fit.fit5.dep set to z");
	    assert.equal(D.fit.fit6.dep, 'z', "D.fit.fit6.dep set to z");
	    assert.equal(D.fit.fit7.dep, 'z', "D.fit.fit7.dep set to z");
	    assert.deepEqual(D.fit.fit1.indep, ['a','b','c','d', 1, 1], "D.fit.fit1.indep correct");
	    assert.deepEqual(D.fit.fit2.indep, ['a', 1], "D.fit.fit2.indep correct");
	    assert.deepEqual(D.fit.fit3.indep, ['b', 1], "D.fit.fit3.indep correct");
	    assert.deepEqual(D.fit.fit4.indep, ['c', 1], "D.fit.fit4.indep correct");
	    assert.deepEqual(D.fit.fit5.indep, ['d', 1], "D.fit.fit5.indep correct");
	    assert.deepEqual(D.fit.fit6.indep, ['a','b', 1], "D.fit.fit6.indep correct");
	    assert.deepEqual(D.fit.fit7.indep, ['a','b','c', 1], "D.fit.fit7.indep correct");
	    assert.ok(!D.fit.fit1.beta, "fit1.beta absent");
	    assert.ok(D.fit.fit1.error, "fit1 error string present, e:"+D.fit.fit1.error);
	    function okfit(n,m,v,tol){
		var x = D.fit['fit'+n].beta[m];
		assert.ok(Math.abs(x-v)<tol, 
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
	    done();
	}
	  );
}));
