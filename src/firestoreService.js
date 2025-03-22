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

// Add a new task to the Firestore database
export async function addTaskFs(task) {
  try {
    // `addDoc` adds a new document to the "tasks" collection in Firestore
    const docRef = await addDoc(collection(db, 'tasks'), task)
    // Use Firestore's doc.id as the task id
    task.id = docRef.id
    return task // Return the Firestore doc ID to use it as task id
  } catch (e) {
    // Logs any errors that occur during the add operation
    console.error('Error adding document: ', e)
    throw e
  }
}

/*________________________*/

// Get tasks from Firestore
export async function getTasksFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'tasks'))
    const tasks = []
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() }) // Add the Firestore document ID to the task object
    })
    return tasks // Return tasks array with Firestore doc ids
  } catch (e) {
    console.error('Error getting documents: ', e)
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
  // If you want to update a date or other timestamp, handle it here (without Firestore Timestamp)
  if (updatedProperties.successAt) {
    updatedProperties.successAt = new Date(updatedProperties.successAt).toISOString() // Store as ISO string
  }

  // Get the document reference for the task we want to update
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

// Temporarily store deleted tasks in Firestore (cleared after 48h)
export async function storeDeletedCompletedTaskFs(task) {
  try {
    const deletedCompletedTaskRef = doc(collection(db, 'deletedCompletedTasksTemp'))

    // Remove fields that are not needed anymore
    const taskData = { ...task }
    delete taskData.doneState
    delete taskData.id

    // Add the task with the deletedAt date (as ISO string, not Firestore Timestamp)
    await setDoc(deletedCompletedTaskRef, {
      ...taskData, // Use cleaned-up data
      deletedAt: new Date(task.deletedAt).toISOString(), // Store as ISO string
    })

    return { ...taskData, id: deletedCompletedTaskRef.id } // Return updated task with Firestore-generated ID
  } catch (e) {
    console.error('Error adding deleted task to Firestore:', e)
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

// Function to get deleted tasks from Firestore
export async function getDeletedCompletedTasksFromFirestore() {
  try {
    const deletedTasksRef = collection(db, 'deletedTasksTemp')

    // Get all tasks in the deletedTasksTemp collection
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

// Fetch all mebos
export async function getMebosFromFirestore() {
  try {
    const snapshot = await getDocs(mebosCollection)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (e) {
    console.error('Error fetching mebos:', e)
    throw e
  }
}

// Add a new mebo
export async function addMeboFs(mebo) {
  try {
    await addDoc(mebosCollection, mebo)
    return await getMebosFromFirestore()
  } catch (e) {
    console.error('Error adding mebo:', e)
    throw e
  }
}

// Delete a mebo
export async function deleteMeboFs(meboId) {
  try {
    await deleteDoc(doc(mebosCollection, meboId))
    return await getMebosFromFirestore()
  } catch (e) {
    console.error('Error deleting mebo:', e)
    throw e
  }
}

// Publish a mebo
export async function publishMeboFs(meboId) {
  try {
    await updateDoc(doc(mebosCollection, meboId), { published: true })
    return await getMebosFromFirestore()
  } catch (e) {
    console.error('Error publishing mebo:', e)
    throw e
  }
}

/*_______________________________________*/
/*________ USER STORE OPERATIONS ________*/
/*____ corresponds with userStore.js ____*/
/*_______________________________________*/

export const userDocRef = (userId) => doc(db, 'users', userId)

// Get user data from Firestore
export async function getUserFromFirestore(userId) {
  try {
    const userDoc = await getDoc(userDocRef(userId))
    return userDoc.exists() ? userDoc.data() : null
  } catch (e) {
    console.error('Error getting user data:', e)
    throw e
  }
}

// Add a new user to Firestore
export async function addUserFs(userId, userData) {
  try {
    // Set the user document with the provided data
    await setDoc(userDocRef(userId), userData)

    // Return the user data after it has been added
    return await getUserFromFirestore(userId)
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
        allReceivedMebos: [], // empty array to start
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
    return await getUserFromFirestore(userId)
  } catch (e) {
    console.error('Error updating user fields:', e)
    throw e
  }
}
