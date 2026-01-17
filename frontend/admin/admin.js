const API = 'http://localhost:5000/api/admin';

document.addEventListener('DOMContentLoaded', () => {
  const contentDiv = document.getElementById('content');
  const viewPendingFoodsBtn = document.getElementById('viewPendingFoods');
  const viewOrdersBtn = document.getElementById('viewOrders');

  // Fetch & Render Pending Foods
  async function fetchPendingFoods() {
    try {
      const res = await fetch(`${API}/foods?status=pending`, {
        headers: { 'x-user-role': 'admin' }
      });
      const foods = await res.json();
      renderPendingFoods(foods);
    } catch (err) {
      console.error(err);
      contentDiv.innerHTML = '<p>Error loading pending foods</p>';
    }
  }

  function renderPendingFoods(foods) {
    if (!foods.length) {
      contentDiv.innerHTML = '<p>No pending food items.</p>';
      return;
    }

    let html = `
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${foods.map(food => `
            <tr>
              <td>${food.name}</td>
              <td>${food.category}</td>
              <td>${food.description}</td>
              <td>
                <button class="approve-btn" data-id="${food._id}">Approve</button>
                <button class="reject-btn" data-id="${food._id}">Reject</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    contentDiv.innerHTML = html;

    document.querySelectorAll('.approve-btn').forEach(btn => {
      btn.onclick = () => updateFoodStatus(btn.dataset.id, 'approved');
    });
    document.querySelectorAll('.reject-btn').forEach(btn => {
      btn.onclick = () => updateFoodStatus(btn.dataset.id, 'rejected');
    });
  }

  async function updateFoodStatus(id, status) {
    try {
      const res = await fetch(`${API}/foods/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      console.log(data.message);
      fetchPendingFoods(); 
    } catch (err) {
      console.error(err);
    }
  }

  // Fetch & Render Orders
  async function fetchOrders() {
    try {
      const res = await fetch(`${API}/orders`, {
        headers: { 'x-user-role': 'admin' }
      });
      const orders = await res.json();
      renderOrders(orders);
    } catch (err) {
      console.error(err);
      contentDiv.innerHTML = '<p>Error loading orders</p>';
    }
  }

  function renderOrders(orders) {
    if (!orders.length) {
      contentDiv.innerHTML = '<p>No orders placed yet.</p>';
      return;
    }

    let html = `
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(order => `
            <tr>
              <td>${order._id}</td>
              <td>${order.userId.name} (${order.userId.email})</td>
              <td>${order.items.map(i => `${i.foodId.name} x${i.quantity}`).join(', ')}</td>
              <td>${order.status}</td>
              <td>
                <button class="update-status-btn" data-id="${order._id}">Update Status</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    contentDiv.innerHTML = html;

    document.querySelectorAll('.update-status-btn').forEach(btn => {
      btn.onclick = () => updateOrderStatus(btn.dataset.id);
    });
  }

  async function updateOrderStatus(id) {
    const newStatus = prompt("Enter new status (e.g., pending, completed, canceled):");
    if (!newStatus) return;

    try {
      const res = await fetch(`${API}/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      console.log(data.message);
      fetchOrders(); 
    } catch (err) {
      console.error(err);
    }
  }

  // Button 
  viewPendingFoodsBtn.onclick = fetchPendingFoods;
  viewOrdersBtn.onclick = fetchOrders;

  contentDiv.innerHTML = '<p>Click a button above to manage foods or orders.</p>';
});