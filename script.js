'use strict';

var $ = Rx.Observable;
var app = document.querySelector('#app');
var button = document.querySelector('#button');
var userURL = 'https://jsonplaceholder.typicode.com/users';
var genRandomNum = function genRandomNum(num) {
  return Math.floor(Math.random() * num) + 1;
};

var request = $.fromEvent(button, 'click').mapTo(userURL).map(function (url) {
  return url + '/' + genRandomNum(10);
}).share();

var response = request.delay(300) // emulate fetching data from server
.flatMap(function (url) {
  return $.fromPromise(fetch(url));
}).flatMap(function (data) {
  return data.json();
}).map(function (user) {
  return '\n    <h1>' + user.name + '</h1>\n    <p>Email: ' + user.email + '</p>\n    <p>Tel: ' + user.phone + '</p>\n  ';
}).share();

var loadingState = request.mapTo(true).merge(response.mapTo(false));

var event = $.combineLatest(loadingState, response, function (loading, data) {
  return loading ? '<h1>loading data...<h1>' : data;
});

event.subscribe(function (html) {
  return app.innerHTML = html;
});
