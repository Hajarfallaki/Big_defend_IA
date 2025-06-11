from pydantic import BaseModel, EmailStr
from fastapi_users import schemas

# Schéma de création d'utilisateur
class UserCreate(schemas.BaseUserCreate):
    nom: str
    email: EmailStr
    password: str
    role: str = "client_banque"  # Valeur par défaut

# Schéma de lecture d'utilisateur (pour renvoyer l'utilisateur à l'API)
class UserRead(schemas.BaseUser[int]):
    nom: str
    role: str

    class Config:
        from_attributes = True  # Assure-toi que la conversion SQLAlchemy -> Pydantic fonctionne
