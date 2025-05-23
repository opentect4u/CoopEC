define("ace/snippets/wollok", ["require", "exports", "module"], function (
  e,
  t,
  n,
) {
  "use strict";
  (t.snippetText =
    '##\n## Basic Java packages and import\nsnippet im\n	import\nsnippet w.l\n	wollok.lang\nsnippet w.i\n	wollok.lib\n\n## Class and object\nsnippet cl\n	class ${1:`Filename("", "untitled")`} ${2}\nsnippet obj\n	object ${1:`Filename("", "untitled")`} ${2:inherits Parent}${3}\nsnippet te\n	test ${1:`Filename("", "untitled")`}\n\n##\n## Enhancements\nsnippet inh\n	inherits\n\n##\n## Comments\nsnippet /*\n	/*\n	 * ${1}\n	 */\n\n##\n## Control Statements\nsnippet el\n	else\nsnippet if\n	if (${1}) ${2}\n\n##\n## Create a Method\nsnippet m\n	method ${1:method}(${2}) ${5}\n\n##  \n## Tests\nsnippet as\n	assert.equals(${1:expected}, ${2:actual})\n\n##\n## Exceptions\nsnippet ca\n	catch ${1:e} : (${2:Exception} ) ${3}\nsnippet thr\n	throw\nsnippet try\n	try {\n		${3}\n	} catch ${1:e} : ${2:Exception} {\n	}\n\n##\n## Javadocs\nsnippet /**\n	/**\n	 * ${1}\n	 */\n\n##\n## Print Methods\nsnippet print\n	console.println("${1:Message}")\n\n##\n## Setter and Getter Methods\nsnippet set\n	method set${1:}(${2:}) {\n		$1 = $2\n	}\nsnippet get\n	method get${1:}() {\n		return ${1:};\n	}\n\n##\n## Terminate Methods or Loops\nsnippet re\n	return'),
    (t.scope = "wollok");
});
(function () {
  window.require(["ace/snippets/wollok"], function (m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
