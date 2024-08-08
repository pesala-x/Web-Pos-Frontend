function generateOrderId() {
    const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
    document.getElementById('orderId').value = orderId;
}

// Auto-fill Order Date with the current date
function fillOrderDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('orderDate').value = today;
}

// Call the functions when the page loads
window.onload = function() {
    generateOrderId();
    fillOrderDate();
};

$(document).ready(function() {
    // Load customers and populate the dropdown
    function loadCustomers() {
        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend_war_exploded/customer",
            type: "GET",
            contentType: "application/json",
            success: function (response) {
                var customerDropdown = $('#orderCustomerId');
                customerDropdown.empty();
                customerDropdown.append('<option selected>Select Customer ID</option>');
                response.forEach(function(customer) {
                    customerDropdown.append(`<option value="${customer.id}">${customer.id}</option>`);
                });

                // When customer is selected, fill in the name
                customerDropdown.change(function() {
                    var selectedCustomerId = $(this).val();
                    var selectedCustomer = response.find(c => c.id === selectedCustomerId);
                    $('#orderCustomerName').val(selectedCustomer ? selectedCustomer.name : '');
                });
            },
            error: function (xhr, status, error) {
                console.error("Error:", status, error);
            }
        });
    }

    // Load items and populate the dropdown
    function loadItems() {
        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend_war_exploded/item",
            type: "GET",
            contentType: "application/json",
            success: function (response) {
                var itemDropdown = $('#selectItemCode');
                itemDropdown.empty();
                itemDropdown.append('<option selected>Select Item Code</option>');
                response.forEach(function(item) {
                    itemDropdown.append(`<option value="${item.code}">${item.code}</option>`);
                });

                // When item is selected, fill in the name and price
                itemDropdown.change(function() {
                    var selectedItemCode = $(this).val();
                    var selectedItem = response.find(i => i.code === selectedItemCode);
                    $('#selectItemName').val(selectedItem ? selectedItem.description : '');
                    $('#selectItemPrice').val(selectedItem ? selectedItem.price : '');
                });
            },
            error: function (xhr, status, error) {
                console.error("Error:", status, error);
            }
        });
    }

    loadCustomers();
    loadItems();
});

// Function to add selected item to the table
function addItemToTable() {
    var itemCode = $('#selectItemCode').val();
    var itemName = $('#selectItemName').val();
    var itemPrice = $('#selectItemPrice').val();
    var itemQty = $('#selectItemQty').val();

    if (itemCode && itemName && itemPrice && itemQty) {
        var table = $('#selectedItemsTable');
        var newRow = `
            <tr>
                <td>${itemCode}</td>
                <td>${itemName}</td>
                <td>${itemPrice}</td>
                <td>${itemQty}</td>
            </tr>
        `;
        table.append(newRow);
    } else {
        alert('Please fill out all fields.');
    }
}

// Event listener for the "Add" button
$('#addItem').click(function() {
    addItemToTable();
});


// Function to reset the selected item fields
function resetSelectedItemFields() {
    $('#selectItemCode').val('Select Item Code');
    $('#selectItemName').val('');
    $('#selectItemPrice').val('');
    $('#selectItemQty').val('');
}

// Event listener for the "Reset" button
$('#resetSelectedItem').click(function() {
    resetSelectedItemFields();
});

var selectedRow = null; 

// Function to handle row selection
$(document).on('click', '#selectedItemsTable tr', function() {
    if (selectedRow) {
        $(selectedRow).removeClass('table-active');
    }
    
    // Select the clicked row
    selectedRow = this;
    $(selectedRow).addClass('table-active');
});

// Function to remove the selected row
function removeSelectedItem() {
    if (selectedRow) {
        $(selectedRow).remove(); 
        selectedRow = null; 
    } else {
        alert('Please select an item to remove.');
    }
}

// Event listener for the "Remove" button
$('#removeSelectedItem').click(function() {
    removeSelectedItem();
});

$(document).ready(function() {
    // Function to calculate and update total
    function updateTotal() {
        const itemPrice = parseFloat($('#selectItemPrice').val()) || 0;
        const itemQty = parseFloat($('#selectItemQty').val()) || 0;
        const total = itemPrice * itemQty;
        $('#orderTotal').val(total.toFixed(2));
        updateSubTotal(); // Update subtotal whenever total changes
    }

    // Function to calculate and update subtotal
    function updateSubTotal() {
        const total = parseFloat($('#orderTotal').val()) || 0;
        const discountPercentage = parseFloat($('#orderDiscount').val()) || 0;
        const discountAmount = (discountPercentage / 100) * total;
        const subTotal = total - discountAmount;
        $('#orderSubTotal').val(subTotal.toFixed(2));
        updateBalance(); // Update balance whenever subtotal changes
    }

    // Function to calculate and update balance
    function updateBalance() {
        const subTotal = parseFloat($('#orderSubTotal').val()) || 0;
        const cash = parseFloat($('#orderCash').val()) || 0;
        const balance = cash - subTotal;
        $('#orderBalance').val(balance.toFixed(2));
    }

    // Event listeners for input changes
    $('#selectItemQty, #selectItemPrice').on('input', function() {
        updateTotal();
    });

    $('#orderDiscount').on('input', function() {
        updateSubTotal();
    });

    $('#orderCash').on('input', function() {
        updateBalance();
    });
});



