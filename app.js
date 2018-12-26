var budgetController = (function() {

})();

var uiController = (function() {

    var domString = {
        inputType: '.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn'
    };

    return {
        getDOMstrings: function() {
            return domString;
        },
        inputData: function() {
            return {
                type: document.querySelector(domString.inputType).value,
                description: document.querySelector(domString.inputDescription).value,
                value: parseFloat(document.querySelector(domString.inputValue).value)
            };
        }
    };

})();

var appController = (function(budgetCtrl, uiCtrl) {

    var addItem = function() {
        var userInput = uiCtrl.inputData();
        console.log(userInput);
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
    };
})(budgetController, uiController);

appController.init();