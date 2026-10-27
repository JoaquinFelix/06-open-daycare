'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signIn(_prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string | null
  const password = formData.get('password') as string | null

  if (!email?.trim() || !password) {
    return { error: 'Email o contraseña incorrectos' }
  }

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (error) {
    return { error: 'Email o contraseña incorrectos' }
  }

  redirect('/')
}
