import { Student } from '../models/student.model';
import { StudentRepositoryInterface } from './student.repository.interface';
import { Collection, Document } from 'mongodb';
import { getMongoDb } from '../config/mongo';
/**
 * TÍNH ĐA HÌNH (POLYMORPHISM) - HÌNH THÁI 2:
 * Class này thực thi interface theo cơ chế của MongoDB (NoSQL Document BSON)
 */
interface StudentDocument extends Document {
  _id: string; // Sử dụng rollNumber làm _id (Primary Key) trong MongoDB
  email: string;
  fullName: string;
  phone: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class MongoStudentRepository implements StudentRepositoryInterface {
  private collectionName = 'students';

  /**
   * Phương thức hỗ trợ lấy Collection 'students' từ Mongo Client Pool
   */
  private async getCollection(): Promise<Collection<StudentDocument>> {
    const db = await getMongoDb();
    return db.collection<StudentDocument>(this.collectionName);
  }

  /**
   * Tạo mới sinh viên vào MongoDB Atlas
   */
  public async create(student: Student): Promise<Student> {
    const collection = await this.getCollection();

    // Chuẩn bị BSON Document để chèn
    const newDoc: StudentDocument = {
      _id: student.rollNumber, // Map rollNumber làm Khóa chính _id
      email: student.email,
      fullName: student.fullName,
      phone: student.phone,
      createdAt: new Date(),
    };

    console.log(`[MongoDB Atlas] ─── Executing: db.students.insertOne({ _id: "${student.rollNumber}" })`);
    
    // Thao tác chèn 1 document
    await collection.insertOne(newDoc);

    return student;
  }

  /**
   * Truy vấn toàn bộ danh sách sinh viên từ MongoDB Atlas
   */
  public async findAll(): Promise<Student[]> {
    const collection = await this.getCollection();

    console.log('[MongoDB Atlas] ─── Executing: db.students.find({})');

    // Lấy toàn bộ documents và chuyển về dạng Array
    const docs = await collection.find().toArray();

    // Convert BSON Document về lại Model Student domain
    return docs.map(
      (doc) => new Student(doc._id, doc.email, doc.fullName, doc.phone)
    );
  }

  /**
   * Tìm kiếm sinh viên theo email trên MongoDB Atlas
   */
  public async findByEmail(email: string): Promise<Student | null> {
    const collection = await this.getCollection();

    console.log(`[MongoDB Atlas] ─── Executing: db.students.findOne({ email: "${email}" })`);

    // Lấy 1 document thỏa mãn điều kiện
    const doc = await collection.findOne({ email: email });

    if (!doc) {
      return null;
    }

    // Convert BSON Document về Model Student domain
    return new Student(doc._id, doc.email, doc.fullName, doc.phone);
  }

  public async update(rollNumber: string, data: Partial<Student>): Promise<Student | null> {
    const collection = await this.getCollection();

    console.log('[MongoDB] ─── Executing BSON: db.students.updateOne(...)');
    const { rollNumber: _rollNumber, ...studentData } = data;
    const result = await collection.updateOne(
      { _id: rollNumber },
      { $set: { ...studentData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return null;

    const doc = await collection.findOne({ _id: rollNumber });
    if (!doc) return null;

    return new Student(doc._id, doc.email, doc.fullName, doc.phone);
  }

  public async delete(rollNumber: string): Promise<boolean> {
    const collection = await this.getCollection();

    console.log('[MongoDB] ─── Executing BSON: db.students.deleteOne(...)');
    const result = await collection.deleteOne({ _id: rollNumber });
    return result.deletedCount > 0;
 }
}