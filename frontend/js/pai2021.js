let app = angular.module('pai2021', [])

app.controller('Ctrl', [ '$http', function($http) {
    console.log('Ctrl started')
    let ctrl = this

    ctrl.person = {
        firstName: '',
        lastName: '',
        rokur: 2000
    }

    ctrl.sendData = function() {
        console.log('Sending ' + JSON.stringify(ctrl.person))
        $http.post('/rest', '?' + ctrl.person).then(
            function(res) {},
            function(err) {
                console.error('Error ' + err.status)
            }
        )
    }

}])