import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from './firebase'

export async function uploadImage(file: File, type: 'thumbnail' | 'content') {
  const fileName = `${Date.now()}-${file.name}`
  let storageRef = null
  if (type === 'thumbnail') {
    storageRef = ref(storage, `posts/thumbnails/${fileName}`)
  } else {
    storageRef = ref(storage, `posts/${fileName}`)
  }

  const snapshot = await uploadBytes(storageRef, file)
  const url = await getDownloadURL(snapshot.ref)

  return url
}
