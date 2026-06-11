import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5cm1qcWZ1eWd0bHRkY3d4bnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkyMDAwMDB9.test';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdminAccount(email, password, name) {
  try {
    // Sign up with password
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          username: name.toLowerCase().replace(/\s+/g, '_'),
          account_type: "admin",
        },
      },
    });

    if (error) {
      console.error(`Error creating account for ${email}:`, error.message);
      return null;
    }

    console.log(`✅ Created account for ${email}, user_id: ${data.user?.id}`);
    return data.user?.id;
  } catch (err) {
    console.error(`Exception:`, err.message);
    return null;
  }
}

async function main() {
  const admins = [
    { email: 'mysarjo306@gmail.com', password: 'mjfsh231', name: 'Miassar' },
    { email: 'omarazam138@gmail.com', password: 'omarpassword123', name: 'Omar' },
    { email: 'taleenbayatneh0320@gmail.com', password: 'taleenpassword123', name: 'Taleen' },
  ];

  for (const admin of admins) {
    await createAdminAccount(admin.email, admin.password, admin.name);
  }
}

main().catch(console.error);
