let app = angular.module('pai2021', [])

app.controller('Ctrl', [ '$http', function($http) {
    console.log('Ctrl started')
    let ctrl = this

    ctrl.persons = []
    
    ctrl.person = {
        firstName: '',
        lastName: '',
        rokur: 2000
    }

    ctrl.sendData = function() {
        console.log('Sending ' + JSON.stringify(ctrl.person))
        $http.post('/rest', ctrl.person).then(
            function(res) {
                ctrl.persons = res.data
            },
            function(err) {
                console.error('Error ' + err.status)
            }
        )
    }

    $http.get('/rest').then(
        function(res) { ctrl.persons = res.data },
        function(err) {}
    )

}])