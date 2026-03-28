from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "LinguaSwitch API"
    frontend_origin: str = "http://localhost:3000"


settings = Settings()

