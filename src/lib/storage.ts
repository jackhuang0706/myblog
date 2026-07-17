import { supabase } from './supabase'

const MEDIA_BUCKET = 'media'

// 只允許常見圖片與影片格式（副檔名與 MIME 都要符合）
const ALLOWED_UPLOAD_TYPES: Record<string, string[]> = {
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  png: ['image/png'],
  mp4: ['video/mp4'],
  mov: ['video/quicktime'],
}

export const UPLOAD_ACCEPT = '.jpg,.jpeg,.png,.mp4,.mov'

export class UploadTypeError extends Error {}
export class BucketMissingError extends Error {}

function fileExtension(fileName: string): string {
  const dot = fileName.lastIndexOf('.')
  return dot > 0 ? fileName.slice(dot + 1).toLowerCase() : ''
}

export function isAllowedUploadFile(file: File): boolean {
  const mimes = ALLOWED_UPLOAD_TYPES[fileExtension(file.name)]
  // 部分系統不會帶 MIME type（空字串），此時僅以副檔名判斷
  return !!mimes && (!file.type || mimes.includes(file.type))
}

/** 檔名只保留 ASCII 安全字元（Storage key 不接受中文等字元），並加上時間戳避免同名覆蓋 */
function buildStoragePath(fileName: string): string {
  const dot = fileName.lastIndexOf('.')
  const base = (dot > 0 ? fileName.slice(0, dot) : fileName)
    .replace(/[^A-Za-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${Date.now()}-${base || 'file'}.${fileExtension(fileName)}`
}

/** 上傳圖片／影片檔到 Supabase Storage（media bucket），回傳公開網址 */
export async function uploadMediaFile(file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured')
  if (!isAllowedUploadFile(file)) throw new UploadTypeError(file.name)
  const path = buildStoragePath(file.name)
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '3600',
    contentType: ALLOWED_UPLOAD_TYPES[fileExtension(file.name)][0],
  })
  if (error) {
    if (/bucket not found/i.test(error.message)) throw new BucketMissingError(error.message)
    throw new Error(error.message)
  }
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
