import sqlite3
from pathlib import Path


DATABASE_FILE = Path(__file__).resolve().parent / "guardian_ai.db"


def column_exists(cursor, table_name, column_name):
    cursor.execute(
        f"PRAGMA table_info({table_name})"
    )

    columns = cursor.fetchall()

    return any(
        column[1] == column_name
        for column in columns
    )


def add_column(cursor, table_name, column_name, definition):
    if column_exists(
        cursor,
        table_name,
        column_name,
    ):
        print(
            f"Already exists: {table_name}.{column_name}"
        )
        return

    cursor.execute(
        f"""
        ALTER TABLE {table_name}
        ADD COLUMN {column_name} {definition}
        """
    )

    print(
        f"Added: {table_name}.{column_name}"
    )


def main():
    if not DATABASE_FILE.exists():
        print(
            f"Database not found: {DATABASE_FILE}"
        )
        print(
            "Make sure guardian_ai.db exists inside the backend folder."
        )
        return

    print(
        f"Using database: {DATABASE_FILE}"
    )

    connection = sqlite3.connect(
        DATABASE_FILE
    )

    cursor = connection.cursor()

    try:
        print("\nChecking users table...\n")

        add_column(
            cursor,
            "users",
            "role",
            "TEXT NOT NULL DEFAULT 'user'",
        )

        add_column(
            cursor,
            "users",
            "email_verified",
            "INTEGER NOT NULL DEFAULT 0",
        )

        add_column(
            cursor,
            "users",
            "verification_token",
            "TEXT",
        )

        add_column(
            cursor,
            "users",
            "verification_token_expires",
            "DATETIME",
        )

        add_column(
            cursor,
            "users",
            "password_reset_token",
            "TEXT",
        )

        add_column(
            cursor,
            "users",
            "password_reset_token_expires",
            "DATETIME",
        )

        connection.commit()

        print(
            "\nDatabase migration completed successfully."
        )

        print(
            "\nCurrent users table columns:"
        )

        cursor.execute(
            "PRAGMA table_info(users)"
        )

        columns = cursor.fetchall()

        for column in columns:
            print(
                f"  - {column[1]} ({column[2]})"
            )

    except Exception as error:
        connection.rollback()

        print(
            "\nDatabase migration failed:"
        )
        print(error)

    finally:
        connection.close()


if __name__ == "__main__":
    main()