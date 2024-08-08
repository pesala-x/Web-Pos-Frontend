$(document).ready(function () {
    // Save item
    document
      .getElementById("submitItem")
      .addEventListener("click", function () {
        const itemCode = document.getElementById("itemCode").value;
        const itemDescription = document.getElementById("itemDescription").value;
        const itemPrice = document.getElementById("itemPrice").value;
        const itemQty = document.getElementById("itemQty").value;
  
        const itemData = {
          code: itemCode,
          description: itemDescription,
          price: itemPrice,
          qty: itemQty,
        };
  
        const itemJSON = JSON.stringify(itemData);
  
        $.ajax({
          url: "http://localhost:8080/Web_Pos_Backend_war_exploded/item",
          type: "POST",
          data: itemJSON,
          contentType: "application/json; charset=utf-8",
          success: function (response) {
            console.log("Result:", response);
            const itemCode = response.code;
            document.getElementById("itemCode").value = itemCode;
          },
          error: function (xhr, status, error) {
            console.error("Error:", status, error);
          },
        });
      });
  });

 // Update item
document.getElementById('updateItem').addEventListener('click', function() {
  const itemCode = document.getElementById('itemCode').value;
  const itemDescription = document.getElementById('itemDescription').value;
  const itemPrice = document.getElementById('itemPrice').value;
  const itemQty = document.getElementById('itemQty').value;

  const itemData = {
      description: itemDescription,
      price: itemPrice,
      qty: itemQty
  };

  const itemJSON = JSON.stringify(itemData);

  $.ajax({
      url: `http://localhost:8080/Web_Pos_Backend_war_exploded/item?code=${itemCode}`,
      type: "PUT",
      data: itemJSON,
      contentType: "application/json; charset=utf-8",
      success: function (response) {
          console.log("Item updated successfully:", response);
          // Optionally, refresh the item list or provide feedback to the user
      },
      error: function (xhr, status, error) {
          console.error("Error:", status, error);
      }
  });
});

// Fetch and display item data
function loadItems() {
  $.ajax({
      url: "http://localhost:8080/Web_Pos_Backend_war_exploded/item",
      type: "GET",
      contentType: "application/json; charset=utf-8",
      success: function (response) {
          var itemTable = $('#itemTable');
          itemTable.empty(); // Clear existing data
          response.forEach(function(item) {
              var row = '<tr class="new-row">' +
                  '<td>' + item.code + '</td>' +
                  '<td>' + item.description + '</td>' +
                  '<td>' + item.price + '</td>' +
                  '<td>' + item.qty + '</td>' +
                  '</tr>';
              itemTable.append(row);
          });
      },
      error: function (xhr, status, error) {
          console.error("Error:", status, error);
      }
  });
}

// Load items on page load
loadItems();

// Poll for new data every 5 seconds
setInterval(loadItems, 5000);

// Search item
$("#searchItem").on("input", function () {
  var searchValue = $(this).val().toLowerCase();
  $("#itemTable tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(searchValue) > -1);
  });
});

$("#searchItem").keypress(function (event) {
  if (event.which == 13) {
      var firstVisibleRow = $("#itemTable tr:visible").first();
      if (firstVisibleRow.length > 0) {
          var code = firstVisibleRow.find("td:nth-child(1)").text();
          var description = firstVisibleRow.find("td:nth-child(2)").text();
          var price = firstVisibleRow.find("td:nth-child(3)").text();
          var qty = firstVisibleRow.find("td:nth-child(4)").text();
          $("#itemCode").val(code);
          $("#itemDescription").val(description);
          $("#itemPrice").val(price);
          $("#itemQty").val(qty);
          $("#updateItem").data("code", code); // Store item code for update
      }
  }
});

// Delete item
document.getElementById('deleteItem').addEventListener('click', function() {
  const itemCode = document.getElementById('itemCode').value;
  
  if (!itemCode) {
      console.error("Item Code is required for deletion");
      return;
  }

  $.ajax({
      url: `http://localhost:8080/Web_Pos_Backend_war_exploded/item?code=${itemCode}`,
      type: "DELETE",
      contentType: "application/json; charset=utf-8",
      success: function (response) {
          console.log("Item deleted successfully:", response);
          // Optionally, clear the form and refresh the item list
          $('#itemForm')[0].reset();
          document.getElementById('itemCode').value = '';
          loadItems();
      },
      error: function (xhr, status, error) {
          console.error("Error:", status, error);
      }
  });
});

// Reset form
document.getElementById('resetItem').addEventListener('click', function() {
  $('#itemForm')[0].reset();
  document.getElementById('itemCode').value = '';
});
  