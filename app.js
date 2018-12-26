var budgetController = (function() {

    var Expense = function(description, value, id) {
        this.description = description;
        this.value = value;
        this.id = id;
    }
    
    var Income = function(description, value, id) {
        this.description = description;
        this.value = value;
        this.id = id;
    }

    var data = {
        items: {
            income : [],
            expense : []
        }
    };

    return {
        newEntry: function(type, description, value) {
            var id, newItem;
            if(data.items[type].length > 0) {
                id = data.items[type][data.items[type].length - 1].id + 1;
            } else {
                id = 0;
            }
            if(type === 'income') {
                newItem = new Income(description, value, id);
            } else {
                newItem = new Expense(description, value, id);
            }

            data.items[type].push(newItem);
            console.log(data);
        }
    };

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
        budgetCtrl.newEntry(userInput.type, userInput.description, userInput.value);
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