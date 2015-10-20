"use strict";

var CounterManager = (function() {
    if (JsDbg.GetCurrentExtension() == "counter-manager") {
        DbgObjectTree.AddRoot("Counter Manager", function() {
            return MSHTML.GetCDocs().f("_pWindowPrimary._pCWindow._pMarkup._pCounterManager")
                .filter(function (counterManager) { return !counterManager.isNull(); })
        });

        DbgObjectTree.AddType(null, MSHTML.Module, "CCounterManager", null, function (object) {
            return Promise.join([object.f("_scopeArray"), object.f("_arrayCounterTextNode")]);
        })

        DbgObjectTree.AddType("nodes", MSHTML.Module, "Tree::CArrayTextNodeCounter", null, function(object) {
            return object.array();
        })

        DbgObjectTree.AddType("counters", MSHTML.Module, "CCPIndexedArray<CElementCounter>", null, function(object) {
            return new PromisedDbgObject.Array(object.f("_aItems").array()).f("data");
        })

        DbgObjectTree.AddType(null, MSHTML.Module, "CCPIndexedArray<CElementCounter>::SArrayItem", null, function (object) {
            return object.f("data");
        });

        DbgObjectTree.AddType(null, MSHTML.Module, "CElementCounter", null, function (object) {
            return object.f("_pCounterValues");
        }, function (object) { return object.f("_bstrName").string(); });

        DbgObjectTree.AddType("mutations", MSHTML.Module, "CCPIndexedArray<CCounterValue>", null, function(object) {
            return new PromisedDbgObject.Array(object.f("_aItems").array()).f("data");
        })

        DbgObjectTree.AddType(null, MSHTML.Module, "CCounterValue", null, null, function (object) {
            return Promise.join([object.f("_fIsReset").val(), object.f("_lValue").val(), object.f("_lIncrement").val()])
            .then(function (args) {
                return (args[0] ? "reset" : "increment") + " " + args[2] + " -> " + args[1];
            });
        });
    }

    return {
        Name: "CounterManager",
        BasicType: "CCounterManager",
        DefaultFieldType: {
            module: "edgehtml",
            type: "CCounterManager"
        },
        BuiltInFields: []
    };
})();