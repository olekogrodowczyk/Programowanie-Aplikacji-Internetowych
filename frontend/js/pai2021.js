let app = angular.module('pai2021', ['ngRoute', 'ngSanitize', 'ngAnimate', 'ui.bootstrap'])

// router menu
app.constant('routes', [
	{ route: '/', templateUrl: 'homeView.html', controller: 'HomeCtrl', controllerAs: 'ctrl', menu: '<i class="fa fa-lg fa-home"></i>' },
	{ route: '/persons', templateUrl: 'personsView.html', controller: 'PersonsCtrl', controllerAs: 'ctrl', menu: 'Osoby', roles: [ "admin" ] },
    { route: '/transfers', templateUrl: 'transfersView.html', controller: 'TransfersCtrl', controllerAs: 'ctrl', menu: 'Transfery', roles: [ "admin", "user" ] }
])

// instalacja routera
app.config(['$routeProvider', '$locationProvider', 'routes', function($routeProvider, $locationProvider, routes) {
    $locationProvider.hashPrefix('')
	for(var i in routes) {
		$routeProvider.when(routes[i].route, routes[i])
	}
	$routeProvider.otherwise({ redirectTo: '/' })
}])

// usługi wspólne
app.service('common', [ '$uibModal', function($uibModal) {
    let common = this

    common.login = common.roles = null

    common.alert = {
        text: '',
        type: 'alert-success',
        show: function(text, type = 'alert-success') {
            common.alert.type = type
            common.alert.text = text
            console.log(type, ':', text)
        },
        close: function() { common.alert.text = '' }
    }
    
    // general modal dialog
    common.dialog = function(templateUrl, controllerName, options, nextTick) {

        let modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: templateUrl,
            controller: controllerName,
            controllerAs: 'ctrl',
            resolve: {
                options: function () {
                    return options
                }
            }
        })

        modalInstance.result.then(
            function(answer) { nextTick(answer) },
            function() { nextTick(null) }
        )
    }

    // confirmation dialog function
    common.confirm = function(options, nextTick) {
        common.dialog('confirmDialog.html', 'ConfirmDialog', options, nextTick)
    }

}])

// confirmation dialog controller
app.controller('ConfirmDialog', [ '$uibModalInstance', 'options', function($uibModalInstance, options) {
    let ctrl = this
    ctrl.options = options

    ctrl.submit = function(answer) { $uibModalInstance.close(answer) }
    ctrl.cancel = function() { $uibModalInstance.dismiss('cancel') }
}])

app.controller('ContainerCtrl', [ '$http', '$location', '$scope', '$uibModal', 'common', 'routes', function($http, $location, $scope, $uibModal, common, routes) {
    let ctrl = this
    ctrl.alert = common.alert

    // budowanie menu
    ctrl.menu = []

    let rebuildMenu = function() {
        ctrl.menu.length = 0
        // kim jestem
        $http.get('/auth').then(
            function(res) {
                common.login = res.data.login
                common.roles = res.data.roles
                for(let i in routes) {
                    let intersection = []
                    if(routes[i].roles && common.roles) {
                        routes[i].roles.forEach(function(role) { if(common.roles.includes(role)) intersection.push(role) })
                    }
                    if(!routes[i].roles || intersection.length > 0) {
                        ctrl.menu.push({ route: routes[i].route, title: routes[i].menu })
                    }
                }
                $location.path('/')
            },
            function(err) { 
                common.login = null
                ctrl.menu.length = 0
            }
        )    
    }

    // kontrola nad menu zwiniętym i rozwiniętym
    ctrl.isCollapsed = true
    $scope.$on('$routeChangeSuccess', function () {
        ctrl.isCollapsed = true
    })
    
    // sprawdzenie która pozycja menu jest wybrana
    ctrl.navClass = function(page) {
        return page === $location.path() ? 'active' : ''
    }    

    // ikona login/logout
    ctrl.loginIcon = function() {
        return common.login ? common.login + '&nbsp;<span class="fa fa-lg fa-sign-out"></span>' : '<span class="fa fa-lg fa-sign-in"></span>'
    }
    
    // logowanie/wylogowanie
    ctrl.login = function() {
        if(common.login) {
            // log out
            common.confirm({ title: 'Uwaga!', body: 'Czy na pewno chcesz się wylogować?', ok: true, cancel: true }, function(answer) {
                if(answer) {
                    $http.delete('/auth').then(
                        function(rep) {
                            rebuildMenu()
                        },
                        function(err) {}
                    )
                }
            })    
        } else {
            // log in
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title-top',
                ariaDescribedBy: 'modal-body-top',
                templateUrl: 'loginDialog.html',
                controller: 'LoginCtrl',
                controllerAs: 'ctrl',
            })
    
            modalInstance.result.then(
                function(ret) { 
                    if(ret) {
                        rebuildMenu()
                        common.alert.show('Witaj na pokładzie, ' + ret, 'alert-success')
                    } else {
                        common.alert.show('Logowanie nieudane', 'alert-danger')
                    }
                },
                function() {}
            )
        }
    }
    
    rebuildMenu()
}])