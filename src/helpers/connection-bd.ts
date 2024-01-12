import mysql from 'mysql';

export function createDatabase() {
    const pool = mysql.createPool({
        user: 'root',
        password: 'userTest',
        database: 'userPOC',
        host: '127.0.0.1',
        port: 3306,
        localAddress: '127.0.0.1:3306',
    })
    return pool;
}