define("ace/snippets/clojure", ["require", "exports", "module"], function (
  e,
  t,
  n,
) {
  "use strict";
  (t.snippetText =
    'snippet comm\n	(comment\n	  ${1}\n	  )\nsnippet condp\n	(condp ${1:pred} ${2:expr}\n	  ${3})\nsnippet def\n	(def ${1})\nsnippet defm\n	(defmethod ${1:multifn} "${2:doc-string}" ${3:dispatch-val} [${4:args}]\n	  ${5})\nsnippet defmm\n	(defmulti ${1:name} "${2:doc-string}" ${3:dispatch-fn})\nsnippet defma\n	(defmacro ${1:name} "${2:doc-string}" ${3:dispatch-fn})\nsnippet defn\n	(defn ${1:name} "${2:doc-string}" [${3:arg-list}]\n	  ${4})\nsnippet defp\n	(defprotocol ${1:name}\n	  ${2})\nsnippet defr\n	(defrecord ${1:name} [${2:fields}]\n	  ${3:protocol}\n	  ${4})\nsnippet deft\n	(deftest ${1:name}\n	    (is (= ${2:assertion})))\n	  ${3})\nsnippet is\n	(is (= ${1} ${2}))\nsnippet defty\n	(deftype ${1:Name} [${2:fields}]\n	  ${3:Protocol}\n	  ${4})\nsnippet doseq\n	(doseq [${1:elem} ${2:coll}]\n	  ${3})\nsnippet fn\n	(fn [${1:arg-list}] ${2})\nsnippet if\n	(if ${1:test-expr}\n	  ${2:then-expr}\n	  ${3:else-expr})\nsnippet if-let \n	(if-let [${1:result} ${2:test-expr}]\n		(${3:then-expr} $1)\n		(${4:else-expr}))\nsnippet imp\n	(:import [${1:package}])\n	& {:keys [${1:keys}] :or {${2:defaults}}}\nsnippet let\n	(let [${1:name} ${2:expr}]\n		${3})\nsnippet letfn\n	(letfn [(${1:name) [${2:args}]\n	          ${3})])\nsnippet map\n	(map ${1:func} ${2:coll})\nsnippet mapl\n	(map #(${1:lambda}) ${2:coll})\nsnippet met\n	(${1:name} [${2:this} ${3:args}]\n	  ${4})\nsnippet ns\n	(ns ${1:name}\n	  ${2})\nsnippet dotimes\n	(dotimes [_ 10]\n	  (time\n	    (dotimes [_ ${1:times}]\n	      ${2})))\nsnippet pmethod\n	(${1:name} [${2:this} ${3:args}])\nsnippet refer\n	(:refer-clojure :exclude [${1}])\nsnippet require\n	(:require [${1:namespace} :as [${2}]])\nsnippet use\n	(:use [${1:namespace} :only [${2}]])\nsnippet print\n	(println ${1})\nsnippet reduce\n	(reduce ${1:(fn [p n] ${3})} ${2})\nsnippet when\n	(when ${1:test} ${2:body})\nsnippet when-let\n	(when-let [${1:result} ${2:test}]\n		${3:body})\n'),
    (t.scope = "clojure");
});
(function () {
  window.require(["ace/snippets/clojure"], function (m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
