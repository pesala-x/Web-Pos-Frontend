$(document).ready(function() {
    // Function to load order details
    function loadOrderDetails() {
        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend_war_exploded/orders",
            type: "GET",
            contentType: "application/json",
            success: function(response) {
                var orderDetailsTable = $('#orderDetailsTable');
                orderDetailsTable.empty(); // Clear existing table data

                response.forEach(function(order) {
                    var newRow = `
                        <tr>
                            <td>${order.orderId}</td>
                            <td>${order.orderDate}</td>
                            <td>${order.customerId}</td>
                            <td>${order.total.toFixed(2)}</td>
                            <td>${order.discount.toFixed(2)}</td>
                            <td>${order.subTotal.toFixed(2)}</td>
                            <td>${order.cash.toFixed(2)}</td>
                            <td>${order.balance.toFixed(2)}</td>
                        </tr>
                    `;
                    orderDetailsTable.append(newRow);
                });
            },
            error: function(xhr, status, error) {
                console.error("Failed to load order details:", status, error);
            }
        });
    }

    // Load the order details when the page loads
    loadOrderDetails();

    // Optionally, you can refresh the order details table periodically
    // setInterval(loadOrderDetails, 60000); // Refresh every 60 seconds
});

$(document).ready(function() {
    // Function to load all orders and populate the table
    function loadOrderDetails() {
        $.ajax({
            url: "http://localhost:8080/Web_Pos_Backend_war_exploded/orders",
            type: "GET",
            contentType: "application/json",
            success: function(response) {
                var orderDetailsTable = $('#orderDetailsTable');
                orderDetailsTable.empty(); // Clear existing table data

                response.forEach(function(order) {
                    appendOrderToTable(orderDetailsTable, order);
                });
            },
            error: function(xhr, status, error) {
                console.error("Failed to load order details:", status, error);
            }
        });
    }

    function appendOrderToTable(orderDetailsTable, order) {
        var newRow = `
            <tr>
                <td>${order.orderId}</td>
                <td>${order.orderDate}</td>
                <td>${order.customerId}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>${order.discount.toFixed(2)}</td>
                <td>${order.subTotal.toFixed(2)}</td>
                <td>${order.cash.toFixed(2)}</td>
                <td>${order.balance.toFixed(2)}</td>
            </tr>
        `;
        orderDetailsTable.append(newRow);
    }

    // Load all orders when the page loads
    loadOrderDetails();

    // Event listener for the search input
    $('#searchOrder').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        $('#orderDetailsTable tr').each(function() {
            const orderId = $(this).find('td').eq(0).text().toLowerCase();
            if (orderId.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});