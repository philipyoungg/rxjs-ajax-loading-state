((w, d, Rx) => {
  const application = document.querySelector('#app');
  const userURL = 'https://jsonplaceholder.typicode.com/users';
  const genRandomNum = num => Math.floor(Math.random() * num) + 1;

  const request = Rx.Observable.fromEvent(document, 'click')
  .mapTo(userURL)
  .map(url => `${url}/${genRandomNum(10)}`)
  .share();

  const response = request
  .switchMap(url =>
    fetch(url)
      .then(res => res.json())
  )
  .map(user => `
    <h1>${user.name}</h1>
    <p>Email: ${user.email}</p>
    <p>Tel: ${user.phone}</p>
  `);

  const event = request
  .mapTo('loading...')
  .merge(response);

  event.subscribe(html => (application.innerHTML = html));
})(window, document, Rx);
