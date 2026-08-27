import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI || '';
const dbName = process.env.MONGO_DB_NAME || 'school_db';

if (!mongoUri) {
  throw new Error('Chưa cấu hình biến môi trường MONGO_URI trong file .env');
}

// Khởi tạo đối tượng MongoClient kết nối tới Atlas
const client = new MongoClient(mongoUri);

let dbInstance: Db | null = null;

/**
 * Khởi tạo và lấy đối tượng Database kết nối tới MongoDB
 */
export async function getMongoDb(): Promise<Db> {
  if (!dbInstance) {
    // Mở kết nối nếu chưa kết nối
    await client.connect();
    dbInstance = client.db(dbName);
    console.log(`[MongoDB Atlas] Kết nối thành công tới Database: "${dbName}"`);
  }
  return dbInstance;
}