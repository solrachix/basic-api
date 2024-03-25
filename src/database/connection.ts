import knex from 'knex'
import path from 'path'

let connection = knex({
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'database.sqlite'),
      charset: 'utf8'
    },
    useNullAsDefault: true
  })

export default connection
