// src/db/seeds/base-seeder.ts
import { Client } from '@libsql/client';

export abstract class BaseSeeder {
  constructor(protected db: Client) {}
  
  abstract seed(): Promise<void>;
  
  protected async executeWithTransaction(statements: string[]) {
    try {
      await this.db.execute('BEGIN TRANSACTION');
      
      for (const statement of statements) {
        await this.db.execute(statement);
      }
      
      await this.db.execute('COMMIT');
    } catch (error) {
      await this.db.execute('ROLLBACK');
      throw error;
    }
  }

  protected async insertWithRelations<T extends Record<string, any>>(
    table: string,
    data: T[],
    uniqueKey: keyof T = 'id' as keyof T
  ) {
    const chunks = this.chunkArray(data, 100); // Process in chunks of 100
    
    for (const chunk of chunks) {
      if (chunk.length === 0) continue;
      
      const columns = Object.keys(chunk[0]);
      const values = chunk.map(item => 
        `(${columns.map(col => this.formatValue(item[col])).join(', ')})`
      ).join(',\n');
      
      const sql = `
        INSERT OR REPLACE INTO ${table} (${columns.join(', ')})
        VALUES ${values};
      `;
      
      await this.db.execute(sql);
    }
  }

  private formatValue(value: any): string {
    if (value === null) return 'NULL';
    if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
    if (typeof value === 'boolean') return value ? '1' : '0';
    if (value instanceof Date) return `'${value.toISOString()}'`;
    if (typeof value === 'object') return `'${JSON.stringify(value)}'`;
    return value.toString();
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  protected generateRandomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  protected generateRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  protected generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}