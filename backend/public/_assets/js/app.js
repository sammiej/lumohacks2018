feather.replace();


var app = new Vue({
    router,
    data: {
        greeting: 'Shareit',
        categories: ['veterans', 'first responders'],
        navigation: 'veterans',
        titles: [
            'Mauris maximus massa sit amet condimentum faucibus.',
            'Cras ultricies dolor id augue scelerisque, a cursus justo egestas.',
            'Maecenas tempor lorem fringilla massa tempor, quis sollicitudin erat rutrum.', 
            'Lorem fringilla massa tempor, quis sollicitudin erat rutrum.TITLE4', 
            'Massa tempor, quis sollicitudin erat rutrum.',
            'Cras ultricies dolor id augue scelerisque, a cursus justo egestas.',
            'Maecenas tempor lorem fringilla massa tempor, quis sollicitudin erat rutrum.', 
            'Lorem fringilla massa tempor, quis sollicitudin erat rutrum.TITLE4', 
            'Massa tempor, quis sollicitudin erat rutrum.']
    },

    created: function() {
        this.grabData()
    },    
    watch: {
        navigation: 'grabData',
    },
    methods: {
        grabData: function() {
			/*var xhr = new XMLHttpRequest()
			var self = this
			xhr.open('GET', 'https://c5102e1b.ngrok.io/api/posts')
			xhr.onload = function() {
				self.data = JSON.parse(xhr.responseText)
                console.log(self.data)
			    }
			xhr.send()
            }*/
            console.log(this.navigation)
            return 'hello'
        },
        
    }
  }).$mount('#app')

var router = new VueRouter({
    mode: 'history'
});
  