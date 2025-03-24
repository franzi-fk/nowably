/* Manage all Firestore-related operations */

import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  setDoc,
  arrayUnion,
} from 'firebase/firestore'
import { db } from './firebaseConfig'

/*_______________________________________*/
/*________ TASK STORE OPERATIONS ________*/
/*____ corresponds with taskStore.js ____*/
/*_______________________________________*/

// addTaskFs
// Store a new task in the user's tasks sub-collection
export async function storeTaskForUserFs(task) {
  try {
    const userRef = doc(db, 'users', task.userId)
    const userTasksRef = collection(userRef, 'tasks')

    const docRef = await addDoc(userTasksRef, task)
    return { ...task, id: docRef.id }
  } catch (e) {
    console.error('Error storing task in user sub-collection:', e)
    throw e
  }
}

/*________________________*/
// getTasksFromFirestore
// Fetch all tasks for a specific user
export async function getTasksForUserFs(userId) {
  try {
    const userRef = doc(db, 'users', userId)
    const userTasksRef = collection(userRef, 'tasks')

    const taskQuery = query(userTasksRef, where('userId', '==', userId))
    const taskSnapshot = await getDocs(taskQuery)

    return taskSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (e) {
    console.error('Error fetching user tasks:', e)
    throw e
  }
}

/*________________________*/

// Delete a task from Firestore by its ID
export async function deleteTaskFs(taskId) {
  try {
    // Get the document reference from Firestore using the task's ID
    const taskRef = doc(db, 'tasks', taskId)

    // Delete the document from Firestore
    await deleteDoc(taskRef)

    // Fetch the updated list of tasks (excluding the deleted one)
    const tasksCollectionRef = collection(db, 'tasks')
    const querySnapshot = await getDocs(tasksCollectionRef)
    const updatedTasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Return the updated list of tasks
    return updatedTasks
  } catch (e) {
    // Log any errors during the delete operation
    console.error('Error deleting document: ', e)
  }
}

/*________________________*/

// Update an existing task in Firestore by its ID
export async function updateTaskFs(taskId, updatedProperties) {
  if (updatedProperties.successAt) {
    updatedProperties.successAt = new Date(updatedProperties.successAt).toISOString() // Store as ISO string
  }

  const taskRef = doc(db, 'tasks', taskId)

  try {
    // Update the task with the new properties
    await updateDoc(taskRef, updatedProperties)
    // Fetch the updated task after the update
    const updatedTaskSnap = await getDoc(taskRef)
    const updatedTask = updatedTaskSnap.data()

    // Return the updated task
    return { id: taskId, ...updatedTask } // Include the task ID in the returned data
  } catch (e) {
    console.error('Error updating document: ', e)
  }
}

/*________________________*/

// Delete all tasks that are marked as doneState: true in Firestore
export async function deleteAllDoneTasksFs() {
  try {
    // Get a reference to the 'tasks' collection
    const tasksCollectionRef = collection(db, 'tasks')

    // Create a query to find tasks that are marked as done
    const q = query(tasksCollectionRef, where('doneState', '==', true))

    // Get all the tasks that match the query
    const querySnapshot = await getDocs(q)

    // Collect delete promises
    const deletePromises = querySnapshot.docs.map((docSnap) => {
      const taskRef = doc(db, 'tasks', docSnap.id) // Get the reference to the task document
      return deleteDoc(taskRef) // Return the promise
    })
    // Wait for all deletion operations to finish
    await Promise.all(deletePromises)

    // Retrieve the updated list of tasks
    const updatedTasksSnapshot = await getDocs(tasksCollectionRef)
    const updatedTasks = updatedTasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Return the updated tasks list
    return updatedTasks
  } catch (e) {
    console.error('Error deleting tasks: ', e)
  }
}

/*________________________*/

// Temporarily store deleted tasks in Firestore under the user's collection (cleared after 48h)
export async function storeDeletedCompletedTaskFs(task) {
  try {
    const userRef = doc(db, 'users', task.userId)
    const deletedTasksRef = collection(userRef, 'deletedCompletedTasks')

    const docRef = await addDoc(deletedTasksRef, task)
    return { ...task, id: docRef.id }
  } catch (e) {
    console.error('Error storing deleted completed task in Firestore:', e)
    throw e
  }
}

/*________________________*/

// Function to clear deleted tasks older than 48 hours from Firestore
export async function clearDeletedCompletedTasksFs() {
  const twoDaysAgo = new Date(new Date() - 48 * 60 * 60 * 1000) // 48 hours ago

  try {
    // Get reference to the deletedCompletedTasksTemp collection
    const deletedTasksRef = collection(db, 'deletedCompletedTasksTemp')

    // Query to find tasks older than 48 hours
    const q = query(deletedTasksRef, where('deletedAt', '<', twoDaysAgo.toISOString())) // Compare ISO string

    // Get tasks older than 48 hours
    const querySnapshot = await getDocs(q)

    // Loop through and delete tasks from Firestore
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref))

    // Wait for all deletion operations to finish
    await Promise.all(deletePromises)

    // Fetch the remaining tasks from Firestore (i.e., tasks that are not older than 48 hours)
    const remainingTasksSnapshot = await getDocs(deletedTasksRef)
    const remainingTasks = remainingTasksSnapshot.docs.map((doc) => doc.data())
    // Return the updated list of deleted tasks
    return remainingTasks
  } catch (e) {
    console.error('Error clearing deleted tasks from Firestore:', e)
    throw e
  }
}

/*________________________*/

// Function to get deleted tasks from the user's sub-collection
export async function getDeletedCompletedTasksFs(userId) {
  try {
    // Reference to the user's 'deletedCompletedTasks' sub-collection
    const userRef = doc(db, 'users', userId) // Get the user document reference
    const deletedTasksRef = collection(userRef, 'deletedCompletedTasks') // Reference to the sub-collection

    // Get all tasks in the deletedCompletedTasks sub-collection
    const querySnapshot = await getDocs(deletedTasksRef)
    const deletedTasks = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))

    return deletedTasks
  } catch (error) {
    console.error('Error fetching deleted tasks from Firestore:', error)
    throw error
  }
}

/*_______________________________________*/
/*________ MEBO STORE OPERATIONS ________*/
/*____ corresponds with meboStore.js ____*/
/*_______________________________________*/

const mebosCollection = collection(db, 'mebos')

// Fetch all unpublished mebos (for moderation purposes)
export async function getUnpublishedMebosFs() {
  try {
    const mebosQuery = query(mebosCollection, where('published', '==', false))
    const snapshot = await getDocs(mebosQuery)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (e) {
    console.error('Error fetching unpublished mebos:', e)
    throw e
  }
}

// Fetch all published mebos (for admin purposes)
export async function getPublishedMebosFs() {
  try {
    const mebosQuery = query(mebosCollection, where('published', '==', true))
    const snapshot = await getDocs(mebosQuery)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (e) {
    console.error('Error fetching all published mebos:', e)
    throw e
  }
}

// Fetch all published mebos, excluding mebos written by current user
export async function getPublishedMebosExcludingUserFs(userId) {
  try {
    const mebosQuery = query(mebosCollection, where('published', '==', true))
    const snapshot = await getDocs(mebosQuery)
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((mebo) => mebo.author !== userId)
  } catch (e) {
    console.error('Error fetching published mebos:', e)
    throw e
  }
}

// Add a new mebo
export async function addMeboFs(message, userId) {
  try {
    // Check if a mebo with the same text already exists (case-insensitive)
    const existingMeboQuery = query(mebosCollection, where('text', '==', message.toLowerCase()))
    const existingMeboSnapshot = await getDocs(existingMeboQuery)

    if (!existingMeboSnapshot.empty) return

    // Add the new mebo
    await addDoc(mebosCollection, {
      author: userId,
      text: message,
      published: false,
    })
    return
  } catch (error) {
    console.error('Error adding mebo:', error)
  }
}

// Delete a mebo
export async function deleteMeboFs(meboId) {
  try {
    await deleteDoc(doc(mebosCollection, meboId))
    return await getUnpublishedMebosFs()
  } catch (e) {
    console.error('Error deleting mebo:', e)
    throw e
  }
}

// Publish a mebo
export async function publishMeboFs(meboId) {
  try {
    await updateDoc(doc(mebosCollection, meboId), { published: true })
    return await getUnpublishedMebosFs()
  } catch (e) {
    console.error('Error publishing mebo:', e)
    throw e
  }
}

/*_______________________________________*/
/*________ USER STORE OPERATIONS ________*/
/*____ corresponds with userStore.js ____*/
/*_______________________________________*/
// Reference to the 'users' collection
export const userDocRef = (userId) => doc(db, 'users', userId)

// Get user data from Firestore
export async function getUserFs(userId) {
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    console.error('Invalid userId provided.')
    return null // or handle it gracefully
  }

  try {
    const userRef = userDocRef(userId) // This line was causing the error
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      console.warn('User not found in Firestore.')
      return null
    }

    return userSnap.data()
  } catch (error) {
    console.error('Error getting user data:', error)
    return null
  }
}

// Add a new user to Firestore
export async function addUserFs(userId, userData) {
  try {
    // Set the user document with the provided data
    await setDoc(userDocRef(userId), userData)

    // Return the user data after it has been added
    return await getUserFs(userId)
  } catch (e) {
    console.error('Error adding user:', e)
    throw e
  }
}

// Generalized function to update multiple fields for a user
// used to update totalSuccessCount, dailyMeboCreation, lastMeboReceived and allReceivedMebos
export async function updateUserFieldsFs(userId, updatedFields) {
  try {
    // Special handling for 'external' user (temporary solution until authentication is added)
    if (userId === 'external') {
      const defaultFields = {
        totalSuccessCount: 0, // default value
        role: 'user', // default value
        lastMeboReceived: null, // default value
        dailyMeboCreation: { currentDay: new Date().toISOString().split('T')[0], meboCount: 0 }, // default mebo count
      }

      // Check if the user document exists, if not create it for the 'external' user (temporary solution until authentication is added)
      const userDoc = await getDoc(userDocRef(userId))
      if (!userDoc.exists()) {
        console.log(`User document not found for ${userId}, creating document...`)
        await setDoc(userDocRef(userId), defaultFields)
      }
    }

    // Check if allReceivedMebos is being updated and handle it with arrayUnion
    if (updatedFields.allReceivedMebos) {
      updatedFields.allReceivedMebos = arrayUnion(...updatedFields.allReceivedMebos)
    }

    // Update the user document with the provided fields
    await updateDoc(userDocRef(userId), updatedFields)

    // Return the updated user data
    return await getUserFs(userId)
  } catch (e) {
    console.error('Error updating user fields:', e)
    throw e
  }
}

// Fetch all received mebos for a user
export async function getAllReceivedMebosForUserFs(userId) {
  try {
    const userRef = doc(db, 'users', userId)
    const receivedMebosRef = collection(userRef, 'receivedMebos')

    const snapshot = await getDocs(receivedMebosRef)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (e) {
    console.error('Error fetching received mebos:', e)
    throw e
  }
}

// Store a received mebo in the user's receivedMebos sub-collection
export async function storeReceivedMeboForUserFs(userId, meboId) {
  try {
    const userRef = doc(db, 'users', userId)
    const receivedMebosRef = collection(userRef, 'receivedMebos')

    const docRef = await addDoc(receivedMebosRef, meboId)
    return { ...meboId, id: docRef.id }
  } catch (e) {
    console.error('Error storing received mebo in Firestore:', e)
    throw e
  }
}
