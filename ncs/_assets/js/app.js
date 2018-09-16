var app = new Vue({
    el: '#app',
    data: {
      greeting: 'Welcome to Shareit/Sharespace/Not Reddit',
    },
    methods: {
      humanizeURL: function (url) {
        return url
          .replace(/^https?:\/\//, '')
          .replace(/\/$/, '')
      }
    }
  })