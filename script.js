// ============================================================
// script.js — Frontend JavaScript
// Handles all communication between HTML page and Flask API
// Uses the fetch() API to call backend routes
// ============================================================


// ============================================================
// Load contacts when the page first opens
// ============================================================
window.onload = function () {
  loadContacts();  // Fetch and display all contacts on page load
};


// ============================================================
// FUNCTION: loadContacts()
// Calls GET /contacts and renders data into the table
// ============================================================
function loadContacts(searchTerm = '') {
  // Build the URL — add search query if provided
  let url = '/contacts';
  if (searchTerm) {
    url += '?search=' + encodeURIComponent(searchTerm);
  }

  // fetch() sends an HTTP GET request to Flask
  fetch(url)
    .then(response => response.json())    // Parse JSON response
    .then(contacts => {
      renderTable(contacts);              // Draw the table with the data
    })
    .catch(error => {
      console.error('Error loading contacts:', error);
    });
}


// ============================================================
// FUNCTION: renderTable(contacts)
// Takes an array of contact objects and fills the HTML table
// ============================================================
function renderTable(contacts) {
  const tbody       = document.getElementById('contactBody');
  const emptyState  = document.getElementById('emptyState');
  const countEl     = document.getElementById('contactCount');
  const table       = document.getElementById('contactTable');

  tbody.innerHTML = '';  // Clear existing rows

  if (contacts.length === 0) {
    // Show "no contacts" message, hide table
    table.style.display   = 'none';
    emptyState.classList.remove('hidden');
  } else {
    // Show table, hide empty message
    table.style.display   = 'table';
    emptyState.classList.add('hidden');

    // Trash SVG icon for delete button
    const trashSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/>
      <path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>`;

    // Create one table row per contact
    contacts.forEach(contact => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><span class="id-badge">${contact.id}</span></td>
        <td><strong>${escapeHtml(contact.name)}</strong></td>
        <td>${escapeHtml(contact.phone)}</td>
        <td>${escapeHtml(contact.email)}</td>
        <td>
          <button class="btn btn-delete" onclick="deleteContact(${contact.id})">
            ${trashSVG} Delete
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  // Update contact count badge
  countEl.textContent = contacts.length;
}


// ============================================================
// FUNCTION: addContact()
// Reads form inputs and sends POST /add_contact to Flask
// ============================================================
function addContact() {
  // Read values from the input fields
  const name  = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();

  // Basic frontend validation
  if (!name || !phone || !email) {
    showToast('Please fill in all fields!', 'error');
    return;
  }

  // Build the data object to send as JSON
  const contactData = { name, phone, email };

  // Send a POST request to Flask with JSON body
  fetch('/add_contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'   // Tell Flask we're sending JSON
    },
    body: JSON.stringify(contactData)       // Convert JS object → JSON string
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        showToast(data.error, 'error');
      } else {
        showToast('Contact added successfully!', 'success');
        clearForm();        // Reset input fields
        loadContacts();     // Refresh the contacts table
      }
    })
    .catch(error => {
      showToast('Something went wrong. Try again.', 'error');
      console.error('Add error:', error);
    });
}


// ============================================================
// FUNCTION: deleteContact(id)
// Sends DELETE /delete_contact/<id> to Flask
// ============================================================
function deleteContact(id) {
  // Ask the user to confirm before deleting
  if (!confirm('Are you sure you want to delete this contact?')) return;

  // Send a DELETE request with the contact ID in the URL
  fetch(`/delete_contact/${id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        loadContacts();  // Refresh the table after deletion
      }
    })
    .catch(error => {
      console.error('Delete error:', error);
    });
}


// ============================================================
// FUNCTION: searchContacts()
// Called every time user types in the search box
// ============================================================
function searchContacts() {
  const searchTerm = document.getElementById('searchInput').value.trim();
  loadContacts(searchTerm);  // Reload table with search filter
}


// ============================================================
// HELPER: showToast(message, type)
// Displays a temporary notification below the form
// ============================================================
function showToast(message, type) {
  const toast = document.getElementById('toast');

  // SVG icons for toast types
  const successIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
  const errorIcon   = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  const icon = type === 'success' ? successIcon : errorIcon;
  toast.innerHTML   = `${icon} ${escapeHtml(message)}`;
  toast.className   = `toast ${type}`;  // Apply 'success' or 'error' class

  // Auto-hide after 3 seconds
  setTimeout(() => {
    toast.className = 'toast hidden';
  }, 3000);
}


// ============================================================
// HELPER: clearForm()
// Clears all input fields after a contact is added
// ============================================================
function clearForm() {
  document.getElementById('name').value  = '';
  document.getElementById('phone').value = '';
  document.getElementById('email').value = '';
}


// ============================================================
// HELPER: escapeHtml(text)
// Prevents XSS by escaping special HTML characters in user data
// ============================================================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}
