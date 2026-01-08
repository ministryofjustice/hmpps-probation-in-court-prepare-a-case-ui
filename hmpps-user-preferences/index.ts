/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
import express, { Request, Response } from 'express'

import SQLite3 from 'sqlite3'

const app = express()
const port = process.env.PORT || 3000

SQLite3.verbose()
const { Database } = SQLite3
const db = new Database('./preferences.db', (err: Error) => {
  if (err) {
    console.error(err.message)
  }
  console.log('Connected to the preferences database.')
})

app.use(express.json())

type Preference = {
  id: number
  hmpps_user_id: string
  name: string
  value: string
}

app.get('/users/:userId/preferences/:preferenceName', (req: Request, res: Response) => {
  const { userId, preferenceName } = req.params
  db.all(
    'SELECT * FROM preference WHERE hmpps_user_id = ? and name = ?',
    [userId, preferenceName],
    (err: Error, rows: Preference[]) => {
      if (err) {
        console.error(err.message)
        res.status(500).send('Internal server error')
      } else if (!rows) {
        res.status(404).send('Preference not found')
      } else {
        res.send({ items: rows.map(row => row.value) })
      }
    },
  )
})

app.put('/users/:userId/preferences/:preferenceName', (req: Request, res: Response) => {
  const { userId, preferenceName } = req.params
  const { items } = req.body
  if (!items) {
    res.status(400).send('Items are required')
  } else {
    const deleteSql = 'DELETE FROM preference WHERE hmpps_user_id = ? and name = ?'

    db.run(deleteSql, [userId, preferenceName], function deleteCallback(deleteError: Error) {
      if (deleteError) {
        console.error(deleteError.message)
        res.status(500).send('Internal server error')
      } else {
        const placeholders = items.map(() => '(?, ?, ?)').join(', ')
        const putSql = `INSERT INTO preference (hmpps_user_id, name, value) VALUES ${placeholders}`
        const params = items.flatMap((item: string[]) => [userId, preferenceName, item])
        db.run(putSql, params, function writeCallback(writeError: Error) {
          if (writeError) {
            console.error(writeError.message)
            res.status(500).send('Internal server error')
          } else {
            res.status(200).send('Preferences updated')
          }
        })
      }
    })
  }
})

app.delete('/users/:userId/preferences/:preferenceName', (req: Request, res: Response) => {
  const { userId, preferenceName } = req.params

  const deleteSql = 'DELETE FROM preference WHERE hmpps_user_id = ? and name = ?'

  db.run(deleteSql, [userId, preferenceName], function deleteCallback(err: Error) {
    if (err) {
      console.error(err.message)
      res.status(500).send('Internal server error')
    } else {
      res.status(200).send('Courts deleted')
    }
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`)
})
