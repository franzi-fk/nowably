/* Manage all Firestore-related operations */

import { db } from './firebaseConfig'
import { collection, addDoc } from 'firebase/firestore' // collection is like a table, addDoc adds a row to the collection
import { doc, deleteDoc, getDoc } from 'firebase/firestore'
import { updateDoc } from 'firebase/firestore'
import { query, where, getDocs } from 'firebase/firestore'
import { setDoc } from 'firebase/firestore'

// Add a new task to the Firestore database
async function addTaskFs(task) {
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

export { addTaskFs }

/*________________________*/

// Get tasks from Firestore
async function getTasksFromFirestore() {
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

export { getTasksFromFirestore }

/*________________________*/

// Delete a task from Firestore by its ID
async function deleteTaskFs(taskId) {
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

export { deleteTaskFs }

/*________________________*/

// Update an existing task in Firestore by its ID
async function updateTaskFs(taskId, updatedProperties) {
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

export { updateTaskFs }

/*________________________*/

// Delete all tasks that are marked as doneState: true in Firestore
async function deleteAllDoneTasksFs() {
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

export { deleteAllDoneTasksFs } // Export deleteAllDoneTasks function

/*________________________*/

// Temporarily store deleted tasks in Firestore (cleared after 48h)
async function storeDeletedCompletedTaskFs(task) {
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

export { storeDeletedCompletedTaskFs }

/*________________________*/

// Function to clear deleted tasks older than 48 hours from Firestore
async function clearDeletedCompletedTasksFs() {
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

export { clearDeletedCompletedTasksFs }

/*________________________*/

// Function to get deleted tasks from Firestore
async function getDeletedCompletedTasksFromFirestore() {
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

export { getDeletedCompletedTasksFromFirestore }
