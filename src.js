const $ = Rx.Observable;
const app = document.querySelector('#app');
const button = document.querySelector('#button');
const userURL = 'https://jsonplaceholder.typicode.com/users';
const random10 = () => Math.floor(Math.random() * 10) + 1;

const request = $.fromEvent(button, 'click')
  .startWith(userURL)
  .mapTo(userURL)
  .map(url => `${url}/${random10()}`)
  .flatMap(url => $.fromPromise(fetch(url)))
  .share();

const response = request
  .delay(300) // emulate fetching data from server
  .flatMap(data => data.json())
  .map(user =>
    `<h1>${user.name}</h1>
   <p>Email: ${user.email}</p>
   <p>Tel: ${user.phone}</p>`
  )
  .share()
  .startWith(null);


const loadingState = request.mapTo(true).merge(response.mapTo(false));

const event = $.combineLatest(loadingState, response, (loading, data) =>
  (loading ? '<h1>loading data...<h1>' : data)
);

event.subscribe(html => (app.innerHTML = html));
