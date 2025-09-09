import psycopg2
import hashlib

# configurazione database
DB_URL = "postgresql://neondb_owner:npg_4LvK9InoaSuE@ep-late-fog-a2nuw1fo-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def create_team_if_not_exists(name, color):
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO teams (name, color) VALUES (%s, %s) ON CONFLICT (name) DO NOTHING RETURNING id",
            (name, color)
        )
        conn.commit()
        cur.execute("SELECT id FROM teams WHERE name = %s", (name,))
        team_id = cur.fetchone()[0]
        cur.close()
        conn.close()
        return team_id
    except Exception as e:
        print(f"Errore creando squadra '{name}': {e}")
        return None

def create_user(username, password, role, team_id=None):
    password_hash = hash_password(password)

    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO users (username, password_hash, role, team_id) VALUES (%s, %s, %s, %s) ON CONFLICT (username) DO NOTHING",
            (username, password_hash, role, team_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        print(f"Utente '{username}' creato con ruolo '{role}'")
    except Exception as e:
        print(f"Errore creando utente '{username}': {e}")

if __name__ == "__main__":
    # crea squadre se non esistono
    rossi_id = create_team_if_not_exists("rossi", "red")
    blu_id = create_team_if_not_exists("blu", "blue")

    # crea utenti
    create_user("admin", "admin123", "admin")
    create_user("animatore_rossi", "pass123", "accoglienza", team_id=rossi_id)
    create_user("animatore_blu", "pass123", "accoglienza", team_id=blu_id)
    create_user("arbitro1", "arb123", "arbitro")