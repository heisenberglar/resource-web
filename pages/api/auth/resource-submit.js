const API_URL = process.env.NEXT_PUBLIC_API_URL
import { useSession } from "next-auth/react"

const ResourceSubmit = async (req, res) => {
  const { data: session } = useSession()

  if (req.method === "POST") {
    const res = await fetch(`${API_URL}/api/resources`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: resourceBody,
      }),
    })
    const response = await res.json()
    console.log(response)
  }

  res.end()
}

export default ResourceSubmit
