# ============================================================
# app.py - Main Flask Backend File
# This file contains all the API routes and database logic
# ============================================================

# Import required libraries
from flask import Flask, request, jsonify, render_template  # Flask web framework
import sqlite3  # Built-in Python module for SQLite database
import os       # Used to handle file paths

# Create the Flask application instance
app = Flask(__name__)

# Define the database file name
DATABASE = 'contacts.db'


# ============================================================
# DATABASE HELPER FUNCTIONS
# ============================================================

def get_db_connection():
    """
    Opens a connection to the SQLite database.
    Returns the connection object.
    """
    conn = sqlite3.connect(DATABASE)           # Connect to contacts.db
    conn.row_factory = sqlite3.Row            # Rows behave like dictionaries
    return conn


def init_db():
    """
    Creates the 'contacts' table if it doesn't already exist.
    Called once when the app starts.
    """
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            name    TEXT    NOT NULL,
            phone   TEXT    NOT NULL,
            email   TEXT    NOT NULL
        )
    ''')
    conn.commit()   # Save changes
    conn.close()    # Close the connection


# ============================================================
# ROUTE: Home Page
# ============================================================

@app.route('/')
def index():
    """
    Renders the main HTML page (index.html from templates/).
    This is what users see when they open the browser.
    """
    return render_template('index.html')


# ============================================================
# ROUTE: GET /contacts — Fetch all contacts
# ============================================================

@app.route('/contacts', methods=['GET'])
def get_contacts():
    """
    Returns a JSON list of all contacts in the database.
    The frontend calls this to display the contact table.
    """
    search = request.args.get('search', '').strip()  # Optional search query

    conn = get_db_connection()

    if search:
        # Search by name, phone, or email (case-insensitive)
        query = "SELECT * FROM contacts WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?"
        rows = conn.execute(query, (f'%{search}%', f'%{search}%', f'%{search}%')).fetchall()
    else:
        # Return all contacts
        rows = conn.execute("SELECT * FROM contacts").fetchall()

    conn.close()

    # Convert rows to a list of dictionaries (JSON-serializable)
    contacts = [dict(row) for row in rows]
    return jsonify(contacts)


# ============================================================
# ROUTE: POST /add_contact — Add a new contact
# ============================================================

@app.route('/add_contact', methods=['POST'])
def add_contact():
    """
    Receives contact details from the frontend (as JSON),
    validates them, and inserts into the database.
    """
    data = request.get_json()  # Parse incoming JSON body

    # Extract fields from the request
    name  = data.get('name', '').strip()
    phone = data.get('phone', '').strip()
    email = data.get('email', '').strip()

    # Basic validation — all fields must be filled
    if not name or not phone or not email:
        return jsonify({'error': 'All fields are required!'}), 400

    conn = get_db_connection()
    conn.execute(
        "INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?)",
        (name, phone, email)
    )
    conn.commit()
    conn.close()

    return jsonify({'message': 'Contact added successfully!'}), 201


# ============================================================
# ROUTE: DELETE /delete_contact/<id> — Delete a contact
# ============================================================

@app.route('/delete_contact/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    """
    Deletes the contact with the given ID from the database.
    The ID is passed in the URL (e.g., /delete_contact/3).
    """
    conn = get_db_connection()

    # Check if the contact exists before deleting
    contact = conn.execute("SELECT * FROM contacts WHERE id = ?", (contact_id,)).fetchone()

    if not contact:
        conn.close()
        return jsonify({'error': 'Contact not found!'}), 404

    conn.execute("DELETE FROM contacts WHERE id = ?", (contact_id,))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Contact deleted successfully!'})


# ============================================================
# START THE APP
# ============================================================

if __name__ == '__main__':
    init_db()               # Create table if not exists
    app.run(debug=True)     # Run Flask in debug mode (auto-reload on changes)
