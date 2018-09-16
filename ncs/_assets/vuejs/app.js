/*
 * Display posts from Explore UBC with the option to filter categories
 *
*/
/* URL variables for GET request*/
var pageURL = '/archives/'
var baseURL = '/archives/json-request.php?query='
var apiURL = baseURL+'request&page='
var apiTags = baseURL+'tags'
var apiURLTags = 'tags='
var routeTag = ''
var request = ''

function getRequestTags(obj) {
        return new Promise( resolve => {
            var tempData
            var xhrTags = new XMLHttpRequest()
            xhrTags.open('GET', apiTags)
            xhrTags.onload = function() {
                tempData = JSON.parse(xhrTags.responseText)
                for (var i in tempData) {
                    obj.push({'id': tempData[i].id, 'name': tempData[i].name })
                }
                resolve()
            }
            xhrTags.send()
        })        
}

var posts = new Vue({
    router, 
    
    data: {
        tags: [],
        tagParams: [],
        tagResults: '',
        currentTag: [],
        pageNumber: 1,
        totalPages: 1,
        maxTags: 3,
        posts: [],
        totalPosts: 0,
        loading: 0,
        paginateArr: [],
        isActive: true,
        filterToggle: true,
        filterArrow: false,
        publishMonth: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        publishInfo: '',
    },

    created: function() {
        this.grabTags()
    },    
    
    watch: {
        currentTag: 'fetchData',
    },

    methods: {
        grabTags: async function() {
            await getRequestTags(this.tags)
            this.onPageLoad()
        },
        makePostRequest: function(req){
            return new Promise(resolve => {
                var self = this
                var xhr = new XMLHttpRequest()
                xhr.open('GET', req)
                xhr.onload = function() {
                    self.posts = JSON.parse(xhr.responseText)
                    self.totalPages = xhr.getResponseHeader('X-WP-TotalPages')
                    self.totalPosts = xhr.getResponseHeader('X-WP-Total')
                    resolve()
                }
                xhr.send()
            })
        },
        /** On page load, check for parameters in URL */
        onPageLoad: function() {
            /** Search for existing page number parameter */
            var searchParams = new URLSearchParams(window.location.search);
            var pageParam = parseInt(searchParams.get('page'))
            
            
            /** Assign page parameter to URL if specified */
            if (isNaN(pageParam)) {
                this.pageNumber = 1
            } else {
                this.pageNumber = pageParam
            }

            /** Check for tags parameters, pre-check boxes if tags exist */
            var onLoadURL = decodeURIComponent(window.location.href)
            var splitStr = onLoadURL.indexOf(apiURLTags)
            var tagsText = onLoadURL.slice(splitStr + apiURLTags.length)
            var splitTagsText = tagsText.toLowerCase().split(',')

            for (i = 0; i < this.tags.length ; i++) {
                if (splitTagsText.includes(this.tags[i]['name'].toLowerCase())) {
                    this.currentTag.push(this.tags[i]['id'])
                    this.tagParams.push(this.tags[i]['name'].toLowerCase())
                }
            }

            if (this.currentTag.length == 0) {
                this.fetchData();
            }

            this.updateRouter()
        },
        /** GET Request to display posts from UBC CMS Archive Site */
        fetchData: function() {
            var self = this
            self.loading = 1
            
            /** If no filters are selected, show all posts */
            if (self.currentTag.length == 0) {
                request = apiURL + self.pageNumber
            }

            /** If filters are selected, append tag IDs to GET request */
            if (self.currentTag.length > 0) {
                request = apiURL + self.pageNumber + "&" + apiURLTags + self.currentTag
            }     
            
            self.makePostRequest(request).then(function(){
                /** Load page numbers to paginateArr for pagination */
                self.paginateArr = []
                for ( i = 1; i <= self.totalPages; i++ ) {
                    self.paginateArr.push(i)
                }
                self.loading = 0
            })
            
            this.tagResultsStr();
        },
        resetFilters: function(){
            this.currentTag = []
            this.tagParams = []
            this.pageNumber = 1
            this.updateRouter()
        },
        /** Pagination functions */
        getPageUpdate: function(num){
            /** Update pageNumber on click event of pagination bar */
            this.pageNumber = num
            this.fetchData();
            this.updateRouter();
        },
        nextPage: function() {    
            if (this.pageNumber < this.totalPages) {
                this.pageNumber += 1
                this.fetchData();
            } else {
                this.pageNumber = this.totalPages
            }
            
            this.updateRouter()
        },
        prevPage: function() {
            if (this.pageNumber > 1) {
                this.pageNumber -= 1                
            } else {
                this.resetPage();
            }

            this.fetchData();
            this.updateRouter()
        },
        /** Reset pages when new filter is selected */
        resetPage: function() {
            this.pageNumber = 1
        },
        /** Add tags to tagParams array to define path when tags are used, triggers from on-click event of checkbox */
        addTag: function(str) {
            var self = this.tagParams
            str = str.toLowerCase();

            if (self.includes(str)) {
                var index = self.indexOf(str)
                self.splice(index, 1)
            } else {
                self.push(str)
            }
          
            this.updateRouter();
        },
        updateRouter: function(){
            var self = this.tagParams

            if ((self === undefined) || (self.length == 0)) {
                routeTag = ''
            } else {
                routeTag = '&tags='
            }
            router.push({ path: pageURL + '?page=' + this.pageNumber + routeTag + this.tagParams })
        },
        /** Toggle category filters for mobile view */
        filterCategory: function(){
            this.filterToggle = !this.filterToggle;
            this.filterArrow = !this.filterArrow;
        },
        /** Displaying tag results */
        tagResultsStr: function(){
            var tempStr
            
            if ((this.tagParams.length == 0) || (this.tagParams.length == this.tags.length)) {
                this.tagResults = 'All'
            } else {
                tempStr = this.tagParams.toString();
                this.tagResults = tempStr.replace( /,/g , ' OR ' )
            }
        },
        /** Adding published Month and Year from post published date */
        parsePublishDate: function(dte){
            var date = new Date(dte)
            var tempMonth;
            var tempYear;
            
            tempYear = date.getFullYear().toString();
            tempMonth = this.publishMonth[date.getMonth()];
            return tempMonth + ' ' + tempYear;
        },
        disableSelection: function(tagid) {
            if (this.currentTag.length >= this.maxTags) {
                return !this.currentTag.includes(tagid);
            } else {
                return false;
            }
        }
    }
}).$mount('#app')


var router = new VueRouter({
    mode: 'history'
});
