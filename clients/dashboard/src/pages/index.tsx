import { signIn, signOut } from 'next-auth/react'


export default function Home() {
  return (
    <div className='flex flex-col'>
    <button onClick={() => signIn()}>Sign in</button>
    <button onClick={() => signOut()}>Sign Out</button>
  </div>
    
  )
}
