/* eslint-disable */

'use strict';

var $ = Rx.Observable;
var app = document.querySelector('#app');
var button = document.querySelector('#button');
var userURL = 'https://jsonplaceholder.typicode.com/users';
var random10 = function random10() {
  return Math.floor(Math.random() * 10) + 1;
};

var request = $.fromEvent(button, 'click')
.startWith(userURL)
.mapTo(userURL)
.map(function (url) {
  return url + '/' + random10();
})
.flatMap(function (url) {
  return $.fromPromise(fetch(url));
})
.share();

var response = request.delay(300) // emulate fetching data from server
.flatMap(function (data) {
  return data.json();
})
.map(function (user) {
  return '<h1>' + user.name + '</h1>' +
   '<p>Email: ' + user.email + '</p>' +
   '<p>Tel: ' + user.phone + '</p>';
})
.share()
.startWith(null);

var loadingState = request.mapTo(true).merge(response.mapTo(false));

var event = $.combineLatest(loadingState, response, function (loading, data) {
  console.log(loading, data)
  return !loading ? data : '<h1>loading data...<h1>';
});

event.subscribe(function (html) {
  app.innerHTML = html;
});
