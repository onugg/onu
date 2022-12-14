import { signIn, signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'


export default function Test() {
    const { data: session } = useSession();
    const username = session?.user?.name || 'User'
  return (
    <div className='flex flex-col'>
You need to be logged in to see this
    {username}
  </div>
    
  )
}