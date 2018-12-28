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
        },
        totals: {
            income: 0,
            expense: 0
        }
    };

    var budgetData = {
        income: 0,
        expense: 0,
        savings: 0,
        percentageSpent: 0
    };

    var budgetCalculate = function(type) {
        budgetData[type] = data.totals[type];
        budgetData.savings = budgetData.income - budgetData.expense;
        if(budgetData.income === 0) {
            budgetData.percentageSpent = '---';
        } else {
        budgetData.percentageSpent = Math.round((budgetData.expense/budgetData.income) * 100);
        }
        console.log(budgetData);
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
            data.totals[type] += newItem.value;
            data.items[type].push(newItem);
            console.log(data);
            return newItem;
        },
        budgetUpdate: function(type) {
            budgetCalculate(type);
        },
        budgetUpdatedValues: function() {
            return budgetData;
        }
    };

})();

var uiController = (function() {

    var domString = {
        inputType: '.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        incomeList:'.income__list',
        expenseList:'.expenses__list',
        totalBudget: '.budget__value',
        incomeTotal: '.budget__income--value',
        expenseTotal: '.budget__expenses--value',
        expensePercentage: '.budget__expenses--percentage',
        inputBtn:'.add__btn',
        container:'.container'
    };

    return {
        getDOMstrings: function() {
            return domString;
        },
        listItem :function(newItem, type) {
            var html, newHtml, element;
            if(type === 'income') {
                element = domString.incomeList;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                element = domString.expenseList;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            newHtml = html.replace('%id%', newItem.id);
            newHtml = newHtml.replace('%description%', newItem.description);
            newHtml = newHtml.replace('%value%', newItem.value);
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        resetFields: function() {
            var feilds, feildsArray;
            feilds = document.querySelectorAll(domString.inputDescription + ',' + domString.inputValue);
            feildsArray = Array.prototype.slice.call(feilds);
            feildsArray.forEach(function(current) {
                current.value = '';
            });
            feildsArray[0].focus();
        },
        inputData: function() {
            return {
                type: document.querySelector(domString.inputType).value,
                description: document.querySelector(domString.inputDescription).value,
                value: parseFloat(document.querySelector(domString.inputValue).value)
            };
        },
        setBudgetValues: function(obj) {
            document.querySelector(domString.totalBudget).innerHTML = obj.savings;
            document.querySelector(domString.incomeTotal).innerHTML = obj.income;
            document.querySelector(domString.expenseTotal).innerHTML = obj.expense;
            if(obj.percentageSpent === '---') {
                document.querySelector(domString.expensePercentage).innerHTML = obj.percentageSpent; 
            } else {
                document.querySelector(domString.expensePercentage).innerHTML = obj.percentageSpent + '%'; 
            }
        }
    };

})();

var appController = (function(budgetCtrl, uiCtrl) {

    var addItem = function() {
        var userInput = uiCtrl.inputData();
        console.log(userInput);
        if(userInput.description !== '' && userInput.value !== 0 && !(isNaN(userInput.value))) {
        var newItem = budgetCtrl.newEntry(userInput.type, userInput.description, userInput.value);
        uiCtrl.listItem(newItem, userInput.type);
        console.log('Item added');
        uiCtrl.resetFields();
        budgetCtrl.budgetUpdate(userInput.type);
        var budgetDetails = budgetCtrl.budgetUpdatedValues();
        uiCtrl.setBudgetValues(budgetDetails);
        }
    }

    var deleteEntry = function(event) {
        var itemIdArray, itemId, type, id;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemId) {
            itemIdArray = itemId.split('-');
            type = itemIdArray[0];
            id = itemIdArray[1];
            console.log(id, type);
        }
    }

    var setupApp = function() {
        console.log('App has started');
        var domItems = uiCtrl.getDOMstrings();
        uiCtrl.setBudgetValues(budgetCtrl.budgetUpdatedValues());
        document.querySelector(domItems.inputBtn).addEventListener('click', addItem);
        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                addItem();
            }
        });

        document.querySelector(domItems.container).addEventListener('click', deleteEntry);
    }

    return {
        init: function() {
            return setupApp();
        }
    };
})(budgetController, uiController);

appController.init();