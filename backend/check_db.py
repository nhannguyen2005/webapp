import sqlite3, os

db_path = 'app.db'
if not os.path.exists(db_path):
    print('DATABASE NOT FOUND!')
else:
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    tables = c.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
    print('Tables:', [t[0] for t in tables])
    try:
        users = c.execute('SELECT id, email, username, role, is_active FROM users').fetchall()
        print(f'Users ({len(users)}):')
        for u in users:
            print(f'  {u[1]} | {u[2]} | role={u[3]} | active={u[4]}')
    except Exception as e:
        print('Error reading users:', e)
    conn.close()
