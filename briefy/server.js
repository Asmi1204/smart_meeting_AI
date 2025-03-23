import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

// Fetch all meetings
app.get('/meetings', async (req, res) => {
  const meetings = await prisma.meeting.findMany()
  res.json(meetings)
})

// Add a new meeting
app.post('/meetings', async (req, res) => {
  const { title, transcript, summary } = req.body
  const newMeeting = await prisma.meeting.create({
    data: { title, transcript, summary }
  })
  res.json(newMeeting)
})

app.listen(5000, () => console.log('Server running on port 5000'))
