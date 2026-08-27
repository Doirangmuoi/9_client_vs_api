import dbPool from '../config/database'; // Kết nối MySQL Pool
import { Student } from '../models/student.model';
import { StudentRepositoryInterface } from './student.repository.interface';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

/**
 * TÍNH ĐA HÌNH (POLYMORPHISM) - HÌNH THÁI 1:
 * Class này thực thi interface theo cơ chế của MySQL (Quan hệ - Relational SQL)
 */
export class MySqlStudentRepository implements StudentRepositoryInterface {
  public async create(student: Student): Promise<Student> {
    console.log('[MySQL] ─── Executing SQL: INSERT INTO students...');
    const sql = `
      INSERT INTO students (roll_number, email, full_name, phone)
      VALUES (?, ?, ?, ?)
    `;
    const values = [student.rollNumber, student.email, student.fullName, student.phone];
    
    await dbPool.execute<ResultSetHeader>(sql, values);
    return student;
  }

  public async findAll(): Promise<Student[]> {
    console.log('[MySQL] ─── Executing SQL: SELECT * FROM students...');
    const sql = `SELECT roll_number AS rollNumber, email, full_name AS fullName, phone FROM students`;
    const [rows] = await dbPool.query<RowDataPacket[]>(sql);
    return rows as Student[];
  }

  public async findByEmail(email: string): Promise<Student | null> {
    console.log(`[MySQL] ─── Executing SQL: SELECT WHERE email = '${email}'...`);
    const sql = `SELECT roll_number AS rollNumber, email, full_name AS fullName, phone FROM students WHERE email = ?`;
    const [rows] = await dbPool.query<RowDataPacket[]>(sql, [email]);

    if (rows.length === 0) return null;
    return rows[0] as Student;
  }

  public async update(rollNumber: string, data: Partial<Student>): Promise<Student | null> {
    console.log('[MySQL] ─── Executing SQL: UPDATE students...');
    const fields: string[] = [];
    const values: string[] = [];

    if (data.email !== undefined) {
      fields.push('email = ?');
      values.push(data.email);
    }
    if (data.fullName !== undefined) {
      fields.push('full_name = ?');
      values.push(data.fullName);
    }
    if (data.phone !== undefined) {
      fields.push('phone = ?');
      values.push(data.phone);
    }

    if (fields.length > 0) {
      const sql = `UPDATE students SET ${fields.join(', ')} WHERE roll_number = ?`;
      values.push(rollNumber);
      const [result] = await dbPool.execute<ResultSetHeader>(sql, values);
      if (result.affectedRows === 0) return null;
    }

    const sql = `SELECT roll_number AS rollNumber, email, full_name AS fullName, phone FROM students WHERE roll_number = ?`;
    const [rows] = await dbPool.query<RowDataPacket[]>(sql, [rollNumber]);
    return rows.length === 0 ? null : rows[0] as Student;
  }

 public async delete(rollNumber: string): Promise<boolean> {
   console.log('[MySQL] ─── Executing SQL: DELETE FROM students...');
   const sql = `DELETE FROM students WHERE roll_number = ?`;
   const [result] = await dbPool.execute<ResultSetHeader>(sql, [rollNumber]);
   return result.affectedRows > 0;
 }  
}