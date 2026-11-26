const {test}=require("node:test");const assert=require("node:assert/strict");const {createStore}=require("../cart.js");const s=createStore();
test("catalogue and filters",()=>{assert.equal(s.products.length,7);assert.equal(s.filter("","Audio","low")[0].id,"speaker");assert.equal(s.filter("camera","Cameras").length,1);});
test("integer totals and quantities",()=>{let c=s.change([],"phone",2);assert.deepEqual(s.totals(c),{count:2,subtotal:139998,shipping:999,tax:11200,total:152197});assert.equal(s.change(c,"phone",-2).length,0);assert.equal(s.totals([]).total,0);});
test("normalize invalid or excessive entries",()=>{assert.deepEqual(s.normalize([{id:"phone",qty:200},{id:"bad",qty:1},{id:"watch",qty:-2}]),[{id:"phone",qty:99}]);assert.deepEqual(s.normalize(null),[]);});
