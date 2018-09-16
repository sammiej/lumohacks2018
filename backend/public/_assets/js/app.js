var apiURL= "https://c5102e1b.ngrok.io/api/posts"
var app = new Vue({
    router,
    data: {
        greeting: 'ShareIt',
        categories: [
                        {id:1, name:'Veterans'}, 
                        {id:2, name:'First responders'},
                        {id:0, name:'Show All'}
                    ],
        navigation: 0,
        data: [],
        arrowToggle: false,
    },

    created: function() {
        this.grabData()
    },    
    watch: {
        navigation: 'grabData',
    },
    methods: {
        grabData: function() {
            var request = ''
            var xhr = new XMLHttpRequest()
            var self = this
            if(self.navigation == 0) {
                request = apiURL
            } 
            if(self.navigation == 1 ){
                request = apiURL + "?CategoryId=" + self.navigation
            }
            if(self.navigation == 2){
                request = apiURL + "?CategoryId=" + self.navigation
            }

			xhr.open('GET', request)
			xhr.onload = function() {
                self.data = JSON.parse(xhr.responseText)
			    }
            xhr.send()
            }, 
        updateKudo:  function(param){
            var url = apiURL + '/kudos';
            var kudoData = {
                PostId: param,
            }
            var json = JSON.stringify(kudoData)
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, false);
            xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
            xhr.send(json);
            this.grabData()
        }
    }
    
}).$mount('#app')

var router = new VueRouter({
    mode: 'history'
});