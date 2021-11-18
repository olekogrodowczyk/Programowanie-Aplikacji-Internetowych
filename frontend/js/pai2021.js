let app = angular.module('pai2021', ['ngRoute', 'ngSanitize', 'ngAnimate', 'ui.bootstrap'])

// router menu
app.constant('routes', [
	{ route: '/', templateUrl: 'homeView.html', controller: 'HomeCtrl', controllerAs: 'ctrl', menu: '<i class="fa fa-lg fa-home"></i>' },
	{ route: '/persons', templateUrl: 'personsView.html', controller: 'PersonsCtrl', controllerAs: 'ctrl', menu: 'Osoby' }
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

app.controller('ContainerCtrl', [ '$http', '$location', '$scope', 'common', 'routes', function($http, $location, $scope, common, routes) {
    let ctrl = this
    ctrl.alert = common.alert

    // budowanie menu
    ctrl.menu = []

    let rebuildMenu = function() {
        for(var i in routes) {
            ctrl.menu.push({ route: routes[i].route, title: routes[i].menu })
        }
        $location.path('/')
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

    rebuildMenu()
}])