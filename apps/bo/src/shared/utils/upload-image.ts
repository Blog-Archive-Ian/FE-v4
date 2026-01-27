import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from './firebase'

export async function uploadPostImage(postSeq: number, file: File, type: 'thumbnail' | 'content') {
  const fileName = `${Date.now()}-${file.name}`

  const storageRef = ref(storage, `posts/${postSeq}/${type}/${fileName}`)

  const snapshot = await uploadBytes(storageRef, file)
  const url = await getDownloadURL(snapshot.ref)

  return url
}
