define("ace/snippets/jsoniq", ["require", "exports", "module"], function (
  e,
  t,
  n,
) {
  "use strict";
  (t.snippetText =
    'snippet for\n	for $${1:item} in ${2:expr}\nsnippet return\n	return ${1:expr}\nsnippet import\n	import module namespace ${1:ns} = "${2:http://www.example.com/}";\nsnippet some\n	some $${1:varname} in ${2:expr} satisfies ${3:expr}\nsnippet every\n	every $${1:varname} in ${2:expr} satisfies ${3:expr}\nsnippet if\n	if(${1:true}) then ${2:expr} else ${3:true}\nsnippet switch\n	switch(${1:"foo"})\n	case ${2:"foo"}\n	return ${3:true}\n	default return ${4:false}\nsnippet try\n	try { ${1:expr} } catch ${2:*} { ${3:expr} }\nsnippet tumbling\n	for tumbling window $${1:varname} in ${2:expr}\n	start at $${3:start} when ${4:expr}\n	end at $${5:end} when ${6:expr}\n	return ${7:expr}\nsnippet sliding\n	for sliding window $${1:varname} in ${2:expr}\n	start at $${3:start} when ${4:expr}\n	end at $${5:end} when ${6:expr}\n	return ${7:expr}\nsnippet let\n	let $${1:varname} := ${2:expr}\nsnippet group\n	group by $${1:varname} := ${2:expr}\nsnippet order\n	order by ${1:expr} ${2:descending}\nsnippet stable\n	stable order by ${1:expr}\nsnippet count\n	count $${1:varname}\nsnippet ordered\n	ordered { ${1:expr} }\nsnippet unordered\n	unordered { ${1:expr} }\nsnippet treat \n	treat as ${1:expr}\nsnippet castable\n	castable as ${1:atomicType}\nsnippet cast\n	cast as ${1:atomicType}\nsnippet typeswitch\n	typeswitch(${1:expr})\n	case ${2:type}  return ${3:expr}\n	default return ${4:expr}\nsnippet var\n	declare variable $${1:varname} := ${2:expr};\nsnippet fn\n	declare function ${1:ns}:${2:name}(){\n	${3:expr}\n	};\nsnippet module\n	module namespace ${1:ns} = "${2:http://www.example.com}";\n'),
    (t.scope = "jsoniq");
});
(function () {
  window.require(["ace/snippets/jsoniq"], function (m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
