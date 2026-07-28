from core.database import SessionLocal
from models.user import User

def test_database_connection():
    db = SessionLocal()
    try:
        # Create a dummy user
        new_user = User(
            email="test@student.com",
            password_hash="fake_hashed_password",
            full_name="Test Student"
        )
        
        # Add and save to database
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        print(f"✅ Success! Inserted user: {new_user.full_name} with ID: {new_user.id}")
        
        # Clean up (delete the user so the database stays clean)
        db.delete(new_user)
        db.commit()
        print("🧹 Cleaned up test user.")
        
    except Exception as e:
        print(f"❌ Database test failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_database_connection()