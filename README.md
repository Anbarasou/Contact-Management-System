# 📋 Contact Management System

### A Beginner-Level Full Stack Mini Project | Python Flask + SQLite

\---

## 📁 Project Structure

```
contact-management/
│
├── app.py               ← Flask backend (API + database logic)
├── contacts.db          ← SQLite database (auto-created on first run)
├── requirements.txt     ← Python dependencies
│
├── templates/
│     └── index.html     ← Main HTML page (rendered by Flask)
│
└── static/
      ├── style.css      ← All CSS styling
      └── script.js      ← JavaScript (calls Flask APIs using fetch())
```

\---

## 🚀 Step-by-Step Setup \& Execution

### Step 1 — Make sure Python is installed

```bash
python --version
# Should show Python 3.7 or above
```

### Step 2 — Install Flask

```bash
pip install flask
# OR
pip install -r requirements.txt
```

### Step 3 — Run the application

```bash
cd contact-management
python app.py
```

### Step 4 — Open in browser

```
http://127.0.0.1:5000
```

You should see the Contact Management System UI!

\---

## 🧭 How the Project Works (Flow Diagram)

```
\[Browser / HTML Page]
       │
       │  User fills form → clicks "Save Contact"
       │
       ▼
\[JavaScript fetch()]
       │
       │  Sends HTTP POST request with JSON data
       │
       ▼
\[Flask Backend — app.py]
       │
       │  Route: POST /add\_contact
       │  Reads JSON → validates → runs SQL INSERT
       │
       ▼
\[SQLite Database — contacts.db]
       │
       │  Stores contact in "contacts" table
       │
       ▼
\[Flask sends JSON response back]
       │
       ▼
\[JavaScript updates the HTML table]
```

\---

## 🔌 How Frontend Connects with Backend

The frontend (HTML + JS) and backend (Flask) communicate using **REST API calls** via the JavaScript `fetch()` function.

|Action|JS calls|Flask route|DB operation|
|-|-|-|-|
|View contacts|GET /contacts|`get\_contacts()`|SELECT \*|
|Search contacts|GET /contacts?search=...|`get\_contacts()`|SELECT WHERE LIKE|
|Add contact|POST /add\_contact|`add\_contact()`|INSERT INTO|
|Delete contact|DELETE /delete\_contact/3|`delete\_contact(3)`|DELETE WHERE id|

**No page reload happens** — JavaScript updates the table dynamically using the JSON data returned by Flask.

\---

## 🐍 How Flask API Works

Flask is a **micro web framework** for Python. Each API route is a Python function decorated with `@app.route(...)`.

```python
@app.route('/contacts', methods=\['GET'])
def get\_contacts():
    # This runs when browser calls GET /contacts
    ...
    return jsonify(contacts)   # Returns JSON to JavaScript
```

* `@app.route` → maps a URL to a Python function
* `request.get\_json()` → reads JSON sent from JavaScript
* `jsonify()` → converts Python dict/list to JSON response

\---

## 🗄️ How Data is Stored in SQLite

SQLite is a **file-based database** — no separate server needed. The entire DB lives in `contacts.db`.

**Table structure:**

```sql
CREATE TABLE contacts (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL
);
```

**Sample data:**

```
id | name           | phone      | email
---+----------------+------------+------------------
1  | Arjun Sharma   | 9876543210 | arjun@email.com
2  | Priya Nair     | 8765432109 | priya@email.com
3  | Rahul Verma    | 7654321098 | rahul@email.com
```

\---

## 🖥️ Sample API Output

**GET /contacts**

```json
\[
  {"id": 1, "name": "Arjun Sharma", "phone": "9876543210", "email": "arjun@email.com"},
  {"id": 2, "name": "Priya Nair",   "phone": "8765432109", "email": "priya@email.com"}
]
```

**POST /add\_contact** (success)

```json
{"message": "Contact added successfully!"}
```

**DELETE /delete\_contact/1** (success)

```json
{"message": "Contact deleted successfully!"}
```

\---

## 🎯 Features Summary

|Feature|Implementation|
|-|-|
|Add Contact|HTML form + POST /add\_contact|
|View Contacts|Table + GET /contacts|
|Search Contact|Search input + GET /contacts?search=...|
|Delete Contact|Delete button + DELETE /delete\_contact/id|
|Responsive UI|CSS Flexbox + media query|
|Database|SQLite (contacts.db)|

\---

*Built with ❤️ using Python Flask — Beginner Mini Project*

