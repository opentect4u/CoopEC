define("ace/snippets/velocity", ["require", "exports", "module"], function (
  e,
  t,
  n,
) {
  "use strict";
  (t.snippetText =
    '# macro\nsnippet #macro\n	#macro ( ${1:macroName} ${2:\\$var1, [\\$var2, ...]} )\n		${3:## macro code}\n	#end\n# foreach\nsnippet #foreach\n	#foreach ( ${1:\\$item} in ${2:\\$collection} )\n		${3:## foreach code}\n	#end\n# if\nsnippet #if\n	#if ( ${1:true} )\n		${0}\n	#end\n# if ... else\nsnippet #ife\n	#if ( ${1:true} )\n		${2}\n	#else\n		${0}\n	#end\n#import\nsnippet #import\n	#import ( "${1:path/to/velocity/format}" )\n# set\nsnippet #set\n	#set ( $${1:var} = ${0} )\n'),
    (t.scope = "velocity"),
    (t.includeScopes = ["html", "javascript", "css"]);
});
(function () {
  window.require(["ace/snippets/velocity"], function (m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
