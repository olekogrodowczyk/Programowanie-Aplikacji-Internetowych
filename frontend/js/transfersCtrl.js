app.controller('TransfersCtrl', [ 'common', function(common) {
    let ctrl = this
    
    ctrl.transfer = { amount: 0, recipient: null }
    
    ctrl.deposit = function() {
        let options = { 
            title: 'Dane transferu',
            ok: true,
            cancel: true,
            data: ctrl.transfer
        }
        common.dialog('makeTransfer.html', 'MakeTransferCtrl', options, function(answer) {
            common.alert.show('Teraz wpłać ' + ctrl.transfer.amount + ' PLN dla ' + ctrl.transfer.recipient)
        })
    }

}])