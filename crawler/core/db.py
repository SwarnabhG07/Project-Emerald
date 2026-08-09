import psycopg2
from pathlib import Path
from .config import DATABASE_URL

SQL_DIR = Path(__file__).resolve().parent.parent / "sql"


def get_conn():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except psycopg2.OperationalError as e:
        print(f"Could not connect to database: {e}")
        raise e


def init_db():
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            # Run ALL .sql files in alphabetical order (migrations)
            sql_files = sorted(SQL_DIR.glob("*.sql"))
            if not sql_files:
                print("No SQL files found in sql/ directory.")
                return

            for sql_file in sql_files:
                print(f"Applying migration: {sql_file.name}...")
                sql_script = sql_file.read_text()
                cur.execute(sql_script)

            conn.commit()
            print("Database initialized successfully.")
    except Exception as e:
        conn.rollback()
        print(f"Error initializing database: {e}")
        raise e
    finally:
        conn.close()
