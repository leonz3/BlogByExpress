console.log(requirejs,require)
requirejs.config({
    baseUrl:'../../public/',
    paths:{
        jquery:'libs/jquery/dist/jquery',
        avalon:'libs/avalon/min/avalon.min'
    }
});
require(['jquery','avalon'],function($,avalon){
    console.log($);
    console.log(avalon);
})