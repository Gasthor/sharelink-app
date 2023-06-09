import { initializeApp } from 'firebase/app'
import { deleteObject, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { getFirestore, addDoc, Timestamp, collection, getDoc, doc, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAOVp6Kft7v_HHoIWfN_9WJ2NtiQVuXymw',
  authDomain: 'sharelink-9e2db.firebaseapp.com',
  projectId: 'sharelink-9e2db',
  storageBucket: 'sharelink-9e2db.appspot.com',
  messagingSenderId: '880571270027',
  appId: '1:880571270027:web:084ed109fd908f005f258e',
  measurementId: 'G-GX7LQS91BE'
}

const firebase = initializeApp(firebaseConfig)
const auth = getAuth(firebase)

const db = getFirestore()
const storage = getStorage()

const userFirebase = (user) => {
  // sacar esta funcion!!!!
  return user
}
export const onAuthStateChange = (onChange) => {
  auth.onAuthStateChanged(user => {
    const normalizeUser = user ? userFirebase(user) : null
    onChange(normalizeUser)
  })
}
export const logOut = () => {
  signOut(auth)
  // falta desarrollar!!
}
export const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider).then(
    (res) => {
      return res.user
    }
  )
}
export const addLink = async (description, imgURL, user) => {
  try {
    console.log(user)
    const doc = await addDoc(collection(db, 'sharelink'), {
      user,
      description,
      createdAt: Timestamp.fromDate(new Date()),
      downloadsCount: 0,
      pathFiles: imgURL
    })
    console.log(doc.id)
    return doc.id
  } catch (e) {
    console.log(e)
  }
}
export const uploadFiles = (file) => {
  const refFile = ref(storage, 'images/' + file.name)
  const task = uploadBytesResumable(refFile, file)
  return task
}
export const getLink = async (link) => {
  const docRef = doc(db, 'sharelink', link)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.log('El documento no existe')
  }
}
export const getLinksUser = async (uid) => {
  const response = []
  const req = query(collection(db, 'sharelink'), where('user', '==', uid))
  const querySnapshot = await getDocs(req)
  querySnapshot.forEach((doc) => {
    const id = doc.id
    const data = doc.data()
    data.createdAt = data.createdAt.toDate()
    data.id = id
    response.push(data)
  })
  return response
}
export const deleteLinkUser = (id, file) => {
  return Promise.all([
    deleteDoc(doc(db, 'sharelink', id)),
    deleteObject(ref(storage, file))
  ]).then(() => {
    return 200
  })
    .catch(() => {
      return 400
    })
}
export const updateDownload = async (id, count) => {
  const docRef = doc(db, 'sharelink', id)
  try {
    await updateDoc(docRef, {
      downloadsCount: count
    })
    return 200
  } catch {
    return 400
  }
}
export const reportLink = async (idLink, message) => {
  try {
    const doc = await addDoc(collection(db, 'reportLink'), {
      idLink,
      message,
      createdAt: Timestamp.fromDate(new Date())
    })
    console.log(doc.id)
    return {
      idReport: doc.id,
      status: 200
    }
  } catch (e) {
    console.log(e)
    return { status: 400 }
  }
}
