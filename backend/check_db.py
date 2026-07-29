from core.database import SessionLocal
from models.roadmap import Roadmap
from models.user import User

def check_database_contents():
    db = SessionLocal()
    try:
        print("\n=== USERS IN DATABASE ===")
        users = db.query(User).all()
        for u in users:
            print(f"User ID: {u.id} | Email: {u.email}")

        print("\n=== ROADMAPS IN DATABASE ===")
        roadmaps = db.query(Roadmap).all()
        if not roadmaps:
            print("❌ ZERO roadmaps found! You need to generate one first.")
        else:
            for r in roadmaps:
                print(f"✅ Roadmap ID: {r.id} | Belongs to User ID: {r.user_id} | Career: {r.target_career}")
        print("============================\n")
    finally:
        db.close()

if __name__ == "__main__":
    check_database_contents()