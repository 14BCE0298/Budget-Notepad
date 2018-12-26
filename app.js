var budgetController = (function() {

})();

var uiController = (function() {

    var domString = {
        inputBtn:'.add__btn'
    };

    return {
        getDOMstrings: function() {
            return domString;
        }
    };

})();

var appController = (function(budgetCtrl, uiCtrl) {

    var addItem = function() {
        console.log('Item added');
    }

    var setupApp = function() {
        console.log('App has started');
        var domItems = uiCtrl.getDOMstrings();
        document.querySelector(domItems.inputBtn).addEventListener('click', addItem);
        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                addItem();
            }
        });
    }

    return {
        init: function() {
            return setupApp();
        }
    }
})(budgetController, uiController);

appController.init();