let app = angular.module('pai2021', ['ngSanitize', 'ngAnimate', 'ui.bootstrap'])

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

// editPerson controller
app.controller('EditPersonCtrl', [ '$uibModalInstance', 'options', function($uibModalInstance, options) {
    let ctrl = this
    ctrl.options = options

    ctrl.submit = function(answer) { $uibModalInstance.close(answer) }
    ctrl.cancel = function() { $uibModalInstance.dismiss(null) }

}])

app.controller('ContainerCtrl', [ '$http', 'common', function($http, common) {
    let ctrl = this
    ctrl.alert = common.alert

    ctrl.persons = []
    ctrl.person = {}
    
    const personDefaults = {
        firstName: '',
        lastName: '',
        year: 2000
    }

    ctrl.edit = function(index) {
        Object.assign(ctrl.person, index >= 0 ? ctrl.persons[index] : personDefaults)
        let options = { 
            title: index >= 0 ? 'Edytuj dane' : 'Nowe dane ',
            ok: true,
            delete: index >= 0,
            cancel: true,
            data: ctrl.person
        }
        common.dialog('editPerson.html', 'EditPersonCtrl', options, function(answer) {
            switch(answer) {
                case 'ok':
                    if(index >= 0) {
                        $http.put('/person', ctrl.person).then(
                            function(res) { 
                                ctrl.persons = res.data
                                common.alert.show('Dane zmienione')
                            },
                            function(err) {}
                        )
                    } else {
                        delete ctrl.person._id
                        $http.post('/person', ctrl.person).then(
                            function(res) { 
                                ctrl.persons = res.data
                                common.alert.show('Dane dodane')
                            },
                            function(err) {}
                        )
                    }
                    break
                case 'delete':
                    let options = {
                        title: 'Usunąć obiekt?',
                        body: ctrl.persons[index].firstName + ' ' + ctrl.persons[index].lastName,
                        ok: true,
                        cancel: true
                    }
                    common.confirm(options, function(answer) {
                        if(answer == 'ok') {
                            $http.delete('/person?_id=' + ctrl.persons[index]._id).then(
                                function(res) { 
                                    ctrl.persons = res.data 
                                    common.alert.show('Dane usunięte')
                                },
                                function(err) {}
                            )
                        }
                    })
                    break
            }
        })
    }

    $http.get('/person').then(
        function(res) { ctrl.persons = res.data },
        function(err) {}
    )

}])