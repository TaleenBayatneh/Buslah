import { createServerFn } from '@tanstack/react-start/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

// Create a Supabase client for server-side operations
const createSupabaseClient = () => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase configuration')
  }

  return createClient<Database>(url, key)
}

export const sendUniversityDataToN8n = createServerFn()
  .validator((data: { uploadId: string; filePath: string; fileName: string; universityName: string; fileSize: number }) => data)
  .handler(async ({ data }) => {
    const webhookUrl = process.env.VITE_N8N_UNIVERSITY_WEBHOOK_URL || process.env.N8N_UNIVERSITY_WEBHOOK_URL

    if (!webhookUrl) {
      throw new Error('N8N webhook URL not configured')
    }

    const supabase = createSupabaseClient()

    // Get public URL for the file from Supabase Storage
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const fileUrl = `${supabaseUrl}/storage/v1/object/public/university-data/${data.filePath.split('/university-data/')[1]}`

    // Prepare payload to send to n8n
    const payload = {
      upload_id: data.uploadId,
      file_name: data.fileName,
      file_path: data.filePath,
      file_url: fileUrl,
      university_name: data.universityName,
      file_size: data.fileSize,
      timestamp: new Date().toISOString(),
    }

    // Send to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`N8N webhook returned status ${response.status}: ${await response.text()}`)
    }

    // Update the upload status to 'processing' in the database
    const { error: updateError } = await supabase
      .from('university_uploads')
      .update({
        status: 'processing',
        notes: 'تم إرسال البيانات إلى معالج البيانات — وتجهيزها لإضافتها إلى قاعدة البيانات',
      })
      .eq('id', data.uploadId)

    if (updateError) {
      console.error('Failed to update status:', updateError)
    }

    return {
      success: true,
      message: 'Data sent to n8n successfully',
      uploadId: data.uploadId,
    }
  })

