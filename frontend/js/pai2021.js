let app = angular.module('pai2021', [])

app.controller('Ctrl', [ '$http', function($http) {
    console.log('Ctrl started')
    let ctrl = this

    ctrl.persons = []
    
    ctrl.person = {
        firstName: '',
        lastName: '',
        year: 2000
    }

    ctrl.sendData = function() {
        console.log('Sending ' + JSON.stringify(ctrl.person))
        $http.post('/person', ctrl.person).then(
            function(res) {
                ctrl.persons = res.data
            },
            function(err) {
                console.error('Error ' + err.status)
            }
        )
    }

    ctrl.id = function(_id) {
        $http.delete('/person?_id=' + _id).then(
            function(res) { ctrl.persons = res.data },
            function(err) {}
        )
    }

    $http.get('/person').then(
        function(res) { ctrl.persons = res.data },
        function(err) {}
    )

}])