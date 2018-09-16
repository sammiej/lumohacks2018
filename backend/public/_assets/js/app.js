feather.replace();

var apiURL= "https://c5102e1b.ngrok.io/api/posts"
var app = new Vue({
    router,
    data: {
        greeting: 'Shareit',
        categories: [
                        {id:1, name:'Veterans'}, 
                        {id:2, name:'First responders'},
                        {id:0, name:'Show All'}
                    ],
        navigation: 0,
        data: [],
        kudos:[],
        arrowToggle: false,
        misc: []
    },

    created: function() {
        this.grabData()
    },    
    watch: {
        navigation: 'grabData',
    },
    methods: {
        grabData: function() {
            var xhr = new XMLHttpRequest()
            var self = this
            if(self.navigation == 0) {
                apiURL = "https://c5102e1b.ngrok.io/api/posts"
            } 
            if(self.navigation == 1 ){
                apiURL = "https://c5102e1b.ngrok.io/api/posts?CategoryId=" + self.navigation
            }
            if(self.navigation == 2){
                apiURL = "https://c5102e1b.ngrok.io/api/posts?CategoryId=" + self.navigation
            }
			xhr.open('GET', apiURL)
			xhr.onload = function() {
                self.data = JSON.parse(xhr.responseText)
			    }
            xhr.send()
            },
        updateKudo: function(){
                if(this.arrowToggle == true){
                    this.arrowToggle = false;
                }else{
                    this.arrowToggle = true;
                }
        }
        }
    
        
  }).$mount('#app')

var router = new VueRouter({
    mode: 'history'
});
  