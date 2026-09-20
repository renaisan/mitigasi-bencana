import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URI = os.environ['MONGODB_URI']
DB_NAME = os.environ.get('DB_NAME', 'langkah_siaga')

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]