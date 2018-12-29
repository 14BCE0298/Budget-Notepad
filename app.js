var budgetController = (function() {

    var Expense = function(description, value, id) {
        this.description = description;
        this.value = value;
        this.id = id;
        this.percentage = 0;
    }
    Expense.prototype.percentageCalculate = function(income) {
        if(income !== 0){
            this.percentage = Math.round(this.value/income * 100);
        }
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

    var updatePercentages = function(currentIncome) {
        data.items.expense.forEach(function(current) {
            current.percentageCalculate(currentIncome);
        });
    }
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
                updatePercentages(data.totals.income + newItem.value);
            } else {
                newItem = new Expense(description, value, id);
                newItem.percentageCalculate(budgetData.income);
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
        },
        deleteObject: function(type, id) {
            var idArray, indexObject;

            idArray = data.items[type].map(function(current) {
                return current.id;
            });

            indexObject = idArray.indexOf(id);
            
            data.totals[type] -= data.items[type][indexObject].value;
            if(type === 'income') {
                updatePercentages(data.totals.income);
            }
            if(indexObject !== -1) {
                data.items[type].splice(indexObject, 1);
            }
            budgetCalculate(type);
        },
        getPercentage: function() {
            var percentagesArray;
            percentagesArray = data.items.expense.map(function(current) {
                return current.percentage;
            });
            return percentagesArray;
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
        container:'.container',
        monthAndYear:'.budget__title--month',
        percentageEachEntry:'.item__percentage'
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
                html = html.replace('21', newItem.percentage);
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
        },
        deleteEntry: function(selectorId) {
            var element;
            element = document.getElementById(selectorId);
            element.parentNode.removeChild(element);
        },
        setDate: function() {
            var currentDate, months;
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            currentDate = new Date;
            document.querySelector(domString.monthAndYear).innerHTML = months[currentDate.getMonth()] + ',' + currentDate.getFullYear();
        },
        updateClass: function() {
            var feildsArray, feilds;
            feilds = document.querySelectorAll(
                domString.inputType + ','
                + domString.inputDescription + ','
                + domString.inputValue
            );
            
            feildsArray = Array.prototype.slice.call(feilds);
            feildsArray.forEach(function(current) {
                current.classList.toggle('red-focus');
            });

            document.querySelector(domString.inputBtn).classList.toggle('red');
        },
        updateEachPercentage: function(percentagesArray) {
            var feilds, feildsArray, i;
            i=0;
            feilds  = document.querySelectorAll(domString.percentageEachEntry);
            feildsArray = Array.prototype.slice.call(feilds);
            feildsArray.forEach(function(current) {
                current.innerHTML = percentagesArray[i++];
            });
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
        uiCtrl.updateEachPercentage(budgetCtrl.getPercentage());
        console.log('Item added');
        uiCtrl.resetFields();
        settingTotals(userInput.type);
        }
    }

    var deleteEntry = function(event) {
        var itemIdArray, itemId, type, id;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemId) {
            itemIdArray = itemId.split('-');
            type = itemIdArray[0];
            id = parseInt(itemIdArray[1]);
            console.log(id, type);
            budgetCtrl.deleteObject(type, id);
            uiCtrl.deleteEntry(itemId);
            settingTotals(type);
            uiCtrl.updateEachPercentage(budgetCtrl.getPercentage());
        }
    }

    var settingTotals = function(type) {
        budgetCtrl.budgetUpdate(type);
        var budgetDetails = budgetCtrl.budgetUpdatedValues();
        uiCtrl.setBudgetValues(budgetDetails);
    }
    var setupApp = function() {
        console.log('App has started');
        var domItems = uiCtrl.getDOMstrings();
        uiCtrl.setDate();
        uiCtrl.setBudgetValues(budgetCtrl.budgetUpdatedValues());
        document.querySelector(domItems.inputBtn).addEventListener('click', addItem);
        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                addItem();
            }
        });

        document.querySelector(domItems.container).addEventListener('click', deleteEntry);
        document.querySelector(domItems.inputType).addEventListener('change', uiCtrl.updateClass);
    }

    return {
        init: function() {
            return setupApp();
        }
    };
})(budgetController, uiController);

appController.init();