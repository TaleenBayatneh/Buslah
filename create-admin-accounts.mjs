#!/usr/bin/env node

/**
 * Script to create admin accounts in Supabase
 * Usage: node create-admin-accounts.mjs
 * 
 * This script creates auth accounts for admin users defined in the admin_emails table
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Read environment variables from .env file
function loadEnv() {
  const envPath = path.resolve('.env')
  if (!fs.existsSync(envPath)) {
    throw new Error('.env file not found')
  }

  const envContent = fs.readFileSync(envPath, 'utf-8')
  const env = {}

  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return

    const [key, ...valueParts] = trimmed.split('=')
    let value = valueParts.join('=').trim()

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    env[key.trim()] = value
  })

  return env
}

async function createAdminAccounts() {
  const env = loadEnv()

  const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL
  const SUPABASE_ANON_KEY = env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env')
  }

  console.log('📦 Connecting to Supabase...')
  console.log(`URL: ${SUPABASE_URL}`)

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  // Fetch admin emails from the table
  console.log('\n📋 Fetching admin emails...')
  const { data: adminEmails, error: fetchError } = await supabase
    .from('admin_emails')
    .select('email, password, name')

  if (fetchError) {
    throw new Error(`Failed to fetch admin emails: ${fetchError.message}`)
  }

  if (!adminEmails || adminEmails.length === 0) {
    console.log('⚠️  No admin emails found in the database')
    return
  }

  console.log(`✅ Found ${adminEmails.length} admin(s)`)

  // For each admin, check if they exist in auth
  for (const admin of adminEmails) {
    console.log(`\n👤 Processing: ${admin.email}`)

    // Try to sign in to check if account exists
    const { error: signInError, data: session } = await supabase.auth.signInWithPassword({
      email: admin.email,
      password: admin.password,
    })

    if (signInError?.message?.includes('Invalid login credentials')) {
      console.log(`   ⚠️  Account doesn't exist. Cannot create via this method.`)
      console.log(`   💡 Please create the account in Supabase Dashboard:`)
      console.log(`      1. Go to https://app.supabase.com`)
      console.log(`      2. Select your project`)
      console.log(`      3. Go to Authentication > Users`)
      console.log(`      4. Create a new user with:`)
      console.log(`         Email: ${admin.email}`)
      console.log(`         Password: ${admin.password}`)
      continue
    }

    if (signInError) {
      console.log(`   ❌ Error: ${signInError.message}`)
      continue
    }

    if (session?.user) {
      console.log(`   ✅ Account exists`)

      // Ensure the admin role is set
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({ user_id: session.user.id, role: 'admin' }, { onConflict: 'user_id' })

      if (roleError) {
        console.log(`   ⚠️  Failed to set admin role: ${roleError.message}`)
      } else {
        console.log(`   ✅ Admin role set`)
      }
    }
  }

  console.log('\n✨ Done!')
}

createAdminAccounts().catch((err) => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
