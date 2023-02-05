import { getSession } from "next-auth/react"

const Dashboard = async (req, res) => {
  const session = await getSession({ req })
  res.send(JSON.stringify(session, null, 2))
}

export default Dashboard
