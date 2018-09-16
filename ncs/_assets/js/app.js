var app = new Vue({
    el: '#app',
    data: {
        greeting: 'Welcome to Shareit/Sharespace/Not Reddit',
        categories: {
            dog: 1,
            cat: 2,
        },
        data: []
    },

    created: function() {
        this.fetchData()
    },    
    
    methods: {
        fetchData: function() {
            console.log("hey")
			var xhr = new XMLHttpRequest()
			var self = this
			xhr.open('GET', 'https://c5102e1b.ngrok.io/api/posts')
			xhr.onload = function() {
				self.data = JSON.parse(xhr.responseText)
                console.log(self.data)
			    }
			xhr.send()
		    }
	    }
  })