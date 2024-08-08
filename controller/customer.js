$(document).ready(function() {
    // Save customer
    document.getElementById('submitCustomer').addEventListener('click', function() {
        const customerName = document.getElementById('customerName').value;
        const customerAddress = document.getElementById('customerAddress').value;
        const customerMobile = document.getElementById('customerMobile').value;

        const customerData = {
            name: customerName,
            address: customerAddress,
            mobile: customerMobile
        };

        const customerJSON = JSON.stringify(customerData);

        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend_war_exploded/customer",
            type: "POST",
            data: customerJSON,
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                console.log("Result :", response);
                const customerId = response.id;
                document.getElementById('customerId').value = customerId;
            },
            error: function (xhr, status, error) {
                console.error("Error:", status, error);
            }
        });
    });

    // Update customer
    document.getElementById('updateCustomer').addEventListener('click', function() {
        const customerId = document.getElementById('customerId').value;
        const customerName = document.getElementById('customerName').value;
        const customerAddress = document.getElementById('customerAddress').value;
        const customerMobile = document.getElementById('customerMobile').value;

        const customerData = {
            name: customerName,
            address: customerAddress,
            mobile: customerMobile
        };

        const customerJSON = JSON.stringify(customerData);

        $.ajax({
            url: `http://localhost:8080/Web_Pos_Backend_war_exploded/customer?id=${customerId}`,
            type: "PUT",
            data: customerJSON,
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                console.log("Customer updated successfully:", response);
                // Optionally, refresh the customer list or provide feedback to the user
            },
            error: function (xhr, status, error) {
                console.error("Error:", status, error);
            }
        });
    });

    // Fetch and display customer data
    function loadCustomers() {
        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend_war_exploded/customer",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var customerTable = $('#customerTable');
                customerTable.empty(); // Clear existing data
                response.forEach(function(customer) {
                    var row = '<tr class="new-row">' +
                        '<td>' + customer.id + '</td>' +
                        '<td>' + customer.name + '</td>' +
                        '<td>' + customer.address + '</td>' +
                        '<td>' + customer.mobile + '</td>' +
                        '</tr>';
                    customerTable.append(row);
                });
            },
            error: function (xhr, status, error) {
                console.error("Error:", status, error);
            }
        });
    }

    // Load customers on page load
    loadCustomers();

    // Poll for new data every 5 seconds
    setInterval(loadCustomers, 5000);

    // Search customer
    $("#searchCustomer").on("input", function () {
        var searchValue = $(this).val().toLowerCase();
        $("#customerTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(searchValue) > -1);
        });
    });

    $("#searchCustomer").keypress(function (event) {
        if (event.which == 13) {
            var firstVisibleRow = $("#customerTable tr:visible").first();
            if (firstVisibleRow.length > 0) {
                var id = firstVisibleRow.find("td:nth-child(1)").text();
                var customerName = firstVisibleRow.find("td:nth-child(2)").text();
                var customerAddress = firstVisibleRow.find("td:nth-child(3)").text();
                var customerMobile = firstVisibleRow.find("td:nth-child(4)").text();
                $("#customerId").val(id);
                $("#customerName").val(customerName);
                $("#customerAddress").val(customerAddress);
                $("#customerMobile").val(customerMobile);
                $("#updateCustomer").data("id", id); // Store customer ID for update
            }
        }
    });

    // Delete customer
    document.getElementById('deleteCustomer').addEventListener('click', function() {
        const customerId = document.getElementById('customerId').value;
        
        if (!customerId) {
            console.error("Customer ID is required for deletion");
            return;
        }

        $.ajax({
            url: `http://localhost:8080/Web_Pos_Backend_war_exploded/customer?id=${customerId}`,
            type: "DELETE",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                console.log("Customer deleted successfully:", response);
                // Optionally, clear the form and refresh the customer list
                $('#customerForm')[0].reset();
                document.getElementById('customerId').value = '';
                loadCustomers();
            },
            error: function (xhr, status, error) {
                console.error("Error:", status, error);
            }
        });
    });
    
    // Reset form
    document.getElementById('resetCustomer').addEventListener('click', function() {
        $('#customerForm')[0].reset();
        document.getElementById('customerId').value = '';
    });
    
});