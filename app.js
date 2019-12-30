// Storage Controller
const StorageCtr = (function(){
  // public methdos
  return {
    storeItem: function(item){
      let items;
      // check if any items in ls 
      if(localStorage.getItem('items') === null){
        items = [];
        // push new items
        items.push(item);
        // Set ls & covert array to string
        localStorage.setItem('items', JSON.stringify(items))
      }else{
        //get all items in ls & back string item to Array
        items = JSON.parse(localStorage.getItem('items'));
        // push new item
        items.push(item);
        // Set ls
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
        return items;
    }else{
      //get all items in & back string item to Array
      items = JSON.parse(localStorage.getItem('items'));
      return items;
    }
  },
  updateItemStorage: function(updatedItem){
    let items = JSON.parse(localStorage.getItem('items'));
    items.forEach(function(item, index){
      if(item.id === updatedItem.id){
        items.splice(index, 1, updatedItem);
      }
    });
    // Set ls
    localStorage.setItem('items', JSON.stringify(items));
  },
  deleteItemFromStorage: function(id){
    let items = JSON.parse(localStorage.getItem('items'));
    items.forEach(function(item, index){
      if(item.id === id){
        items.splice(index, 1);
      }
    });
    // Set ls
    localStorage.setItem('items', JSON.stringify(items));
  },
  clearItemFromStorage: function(){
    localStorage.removeItem('items');
  }
}
}());
// Item Controller 
const ItemCtr = (function(){
  // Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }
  // Data Structure / State
  const data = {
    // items: [
    //   {id: 0, name: 'Steak Dinner', calories: 1200},
    //   {id: 1, name: 'Cookie', calories: 400},
    //   {id: 2, name: 'Eggs', calories: 300}
    // ],
    items : StorageCtr.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };
  // Public methods
  return {
    getItems: function(){
      return data.items;
    },
    getItemById: function(id){
      let found = null;
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        };
      });
      return found;
    },
    updateItem: function(name, calories){
      // Calories to number
      calories = parseInt(calories);
      let found = null;
      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        };
      });
      return found;
    },
    deleteItem: function(id){
      // Gets ids
      const ids = data.items.map(item => item.id);
      // Get index
      const index = ids.indexOf(id);
      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function(){
      data.items = [];
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    }
    ,
    addItem: function(name, calories){
      let ID;
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
        // Calories to number
        calories = parseInt(calories);
        // Create new item
        let newItem  = new Item(ID, name, calories);
        // Add new item to list data
        data.items.push(newItem);
        return newItem;
      }else{
        ID = 0;
        // Calories to number
        calories = parseInt(calories);
        // Create new item
        let newItem  = new Item(ID, name, calories);
        // Add new item to list data
        data.items.push(newItem);
        return newItem;
      }
    },
    logData: function(){
      return data;
    },
    getTotalCalories: function(){
      let total = 0;
      // loop through items and get the some fo total calories
      data.items.forEach(function(item){
        total+= item.calories;
      });
      // set data calories in data structure
      data.totalCalories = total;
      return data.totalCalories;
    }
  }
}());
// UI Controller
const UICtr = (function(){
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }
 // Public methods
 return {
  popultateItemList: function(items){
    let html = '';
    items.forEach(function(item){
      html += `<li class="collection-item" id="item-${item.id}">
      <strong>${item.name}: </strong>
      <em>${item.calories} Calories</em>
      <a href="#/" class="secondary-content">
        <i class="fa fa-pencil edit-item"></i>
      </a>
    </li>`;
    });
    // insert item list
    document.querySelector(UISelectors.itemList).innerHTML = html;
  },
  getItemInput: function(){
    return {
      name: document.querySelector(UISelectors.itemNameInput).value,
      calories: document.querySelector(UISelectors.itemCaloriesInput).value
    };
  },
  getSelectors : function(){ return UISelectors},
  addListItem: function(item){
    // Show the list
    document.querySelector(UISelectors.itemList).style.display = 'block';
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.id = `item-${item.id}`;
    li.innerHTML = `<strong>${item.name}: </strong>
    <em>${item.calories} Calories</em>
    <a href="#/" class="secondary-content">
      <i class="fa fa-pencil edit-item"></i>
    </a>`;
    document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
  },
  updateListItem: function(item){
    let listItems = document.querySelectorAll(UISelectors.listItems);
    // Turn Node list into array
    listItems = Array.from(listItems);
    listItems.forEach(function(listItem){
      const itemID = listItem.getAttribute('id');
      if(itemID === `item-${item.id}`){
        document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong>
        <em>${item.calories} Calories</em>
        <a href="#/" class="secondary-content">
          <i class="fa fa-pencil edit-item"></i>
        </a>`;
      };
    });
  },
  deleteListItem: function(id){
    const itemID = `#item-${id}`;
    const item = document.querySelector(itemID);
    item.remove();

  },
  clearInput: function(){
    document.querySelector(UISelectors.itemNameInput).value = '';
    document.querySelector(UISelectors.itemCaloriesInput).value = '';
  },
  addItemToForm: function(){
    document.querySelector(UISelectors.itemNameInput).value = ItemCtr.getCurrentItem().name;
    document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtr.getCurrentItem().calories;
  },
  removeItems: function(){
    let listItems = document.querySelectorAll(UISelectors.listItems);
    // Turn node list into array
    listItems = Array.from(listItems);
    listItems.forEach(function(item){
      item.remove();
    });

  },
  hideList : function(){
    document.querySelector(UISelectors.itemList).style.display = 'none';
  },
  showTotalCalories: function(totalCalories){
    document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
  },
  clearEditState: function(){
    UICtr.clearInput();
    document.querySelector(UISelectors.updateBtn).style.display = 'none';
    document.querySelector(UISelectors.deleteBtn).style.display = 'none';
    document.querySelector(UISelectors.backBtn).style.display = 'none';
    document.querySelector(UISelectors.addBtn).style.display = 'inline';

  },
  showEditState: function(){
    document.querySelector(UISelectors.updateBtn).style.display = 'inline';
    document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
    document.querySelector(UISelectors.backBtn).style.display = 'inline';
    document.querySelector(UISelectors.addBtn).style.display = 'none';

  }
 }
}());
// App Controller
const App = (function(ItemCtr, StorageCtr, UICtr){
  // Load event listeners
  const UISelectors = UICtr.getSelectors();
  const loadEventListeners = function(){
    //Add event item
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    // Disable submit on enter
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    })
     // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', backButton);
    // Clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemClick);
  };
  // Back button event
  const backButton = function(e){
    e.preventDefault();
    // Clear edit state / set inital state
    UICtr.clearEditState();
  }
  // Add item submit
  const itemAddSubmit = function(e){
    e.preventDefault();
    const input = UICtr.getItemInput();
    if(input.name !== '' && input.calories !== ''){
      const newItem = ItemCtr.addItem(input.name, input.calories);
      // Add item to UI list
      UICtr.addListItem(newItem);
      // Get total Calories
      const totalCalories = ItemCtr.getTotalCalories();
      // Add total calories to UI
      UICtr.showTotalCalories(totalCalories);
      // Store in localStorage
      StorageCtr.storeItem(newItem);
      // Clear Fields
      UICtr.clearInput();
    };
  };
  // Click edit item
  const itemEditClick = function(e){
    e.preventDefault();
    // event delegation
    if(e.target.classList.contains('edit-item')){
      // Get list item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;
      // Beark into an array
      const listIdArr = listId.split('-');
      // Get the the actual id
      const id = parseInt(listIdArr[1]);
      // Get item
      const itemToEdit = ItemCtr.getItemById(id);
      // Set current item
      ItemCtr.setCurrentItem(itemToEdit);
      // Add item to form
      UICtr.addItemToForm();
      UICtr.showEditState();
    }
    
  }
  // upddate item submit
  const itemUpdateSubmit = function(e){
    e.preventDefault();
    // Get item input
    const input = UICtr.getItemInput();
    // Update item
    const updateItem = ItemCtr.updateItem(input.name, input.calories);
    // Update UI
    UICtr.updateListItem(updateItem);
    // Get total Calories
    const totalCalories = ItemCtr.getTotalCalories();
    // Add total calories to UI
    UICtr.showTotalCalories(totalCalories);
    // Update ls
    StorageCtr.updateItemStorage(updateItem);
    // clear edit state
    UICtr.clearEditState();
  }

  // Delete Button event
  const itemDeleteSubmit = function(e){
    e.preventDefault();
    // Get current item
    const currentItem = ItemCtr.getCurrentItem();
    // Delete from data structure
    ItemCtr.deleteItem(currentItem.id);
    // Delete from UI
    UICtr.deleteListItem(currentItem.id);
    // Get total Calories
    const totalCalories = ItemCtr.getTotalCalories();
    // Add total calories to UI
    UICtr.showTotalCalories(totalCalories);
    // Delete From ls
    StorageCtr.deleteItemFromStorage(currentItem.id);
    // clear edit state
    UICtr.clearEditState();
  }
  const clearAllItemClick = function(e){
    e.preventDefault();
    // Delete All items from data structure
    ItemCtr.clearAllItems();
    // Remove from UI
    UICtr.removeItems();
    // Get total Calories
    const totalCalories = ItemCtr.getTotalCalories();
    // Add total calories to UI
    UICtr.showTotalCalories(totalCalories);
    // clear from ls
    StorageCtr.clearItemFromStorage();
    // Hide <ul>
    UICtr.hideList();

  }
      
  // Public methods
  return {
    init: function(){
      // Clear edit state / set inital state
      UICtr.clearEditState();
      // Fetch items from data structure
      const items = ItemCtr.getItems();
      // check if any items
      if(items.length === 0){
        UICtr.hideList();
      }else{
        // populate list with items
        UICtr.popultateItemList(items);
      }
      // Get totla Calories
      const totalCalories = ItemCtr.getTotalCalories();
      // Add total calories to UI
      UICtr.showTotalCalories(totalCalories);
      // Load event listeneners
      loadEventListeners();
    }
  }
}(ItemCtr, StorageCtr, UICtr));

// Initialize App
App.init();
