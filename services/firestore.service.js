/**
 * @fileoverview CRUD operations for Firestore (Cloud Firestore)
 * @description This module provides functions to create, read, update, and delete documents
 *              in a Firestore database. It uses the Firebase Firestore SDK to interact with
 *              the database and handles common operations such as setting, getting, updating,
 *              and deleting documents, as well as querying collections.
 * @module services/firestore.service
 */

import { db } from "../config/firebase.config.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
} from "firebase/firestore";

/**
 * Creates or updates a document in a Firestore collection.
 * Uses merge to avoid overwriting existing fields.
 *
 * @param {string} collectionName - The name of the collection (e.g., "users", "tasks")
 * @param {string} docId - The document ID
 * @param {Object} data - The data to set
 * @returns {Promise<void>}
 * @throws {Error} - Throws error if write operation fails
 */
async function setDocument(collectionName, docId, data) {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error(
      `Error writing document ${docId} to ${collectionName}:`,
      error,
    );
    throw error;
  }
}

/**
 * Gets a single document from a Firestore collection.
 *
 * @param {string} collectionName - The name of the collection
 * @param {string} docId - The document ID
 * @returns {Promise<Object|null>} - The document data with ID or null if not found
 * @throws {Error} - Throws error if read operation fails
 */
async function getDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }

    return null;
  } catch (error) {
    console.error(
      `Error getting document ${docId} from ${collectionName}:`,
      error,
    );
    throw error;
  }
}

/**
 * Gets all documents from a Firestore collection.
 *
 * @param {string} collectionName - The name of the collection
 * @returns {Promise<Array>} - Array of documents with IDs
 * @throws {Error} - Throws error if read operation fails
 */
async function getAllDocuments(collectionName) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = [];

    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    return documents;
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Updates specific fields in a document.
 * Only updates the fields provided, leaves other fields unchanged.
 *
 * @param {string} collectionName - The name of the collection
 * @param {string} docId - The document ID
 * @param {Object} data - The fields to update
 * @returns {Promise<void>}
 * @throws {Error} - Throws error if update operation fails
 */
async function updateDocument(collectionName, docId, data) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error(
      `Error updating document ${docId} in ${collectionName}:`,
      error,
    );
    throw error;
  }
}

/**
 * Deletes a document from a Firestore collection.
 *
 * @param {string} collectionName - The name of the collection
 * @param {string} docId - The document ID
 * @returns {Promise<void>}
 * @throws {Error} - Throws error if delete operation fails
 */
async function deleteDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(
      `Error deleting document ${docId} from ${collectionName}:`,
      error,
    );
    throw error;
  }
}

/**
 * Adds a new document with auto-generated ID.
 *
 * @param {string} collectionName - The name of the collection
 * @param {Object} data - The data to add
 * @returns {Promise<string>} - The new document ID
 * @throws {Error} - Throws error if add operation fails
 */
async function addDocument(collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Queries documents with a single field filter.
 *
 * @param {string} collectionName - The name of the collection
 * @param {string} field - The field to filter on
 * @param {string} operator - The comparison operator (==, !=, <, <=, >, >=)
 * @param {any} value - The value to compare
 * @returns {Promise<Array>} - Array of matching documents with IDs
 * @throws {Error} - Throws error if query fails
 */
async function queryDocuments(collectionName, field, operator, value) {
  try {
    const q = query(
      collection(db, collectionName),
      where(field, operator, value),
    );
    const querySnapshot = await getDocs(q);
    const documents = [];

    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    return documents;
  } catch (error) {
    console.error(`Error querying ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Checks if a document exists in a collection.
 *
 * @param {string} collectionName - The name of the collection
 * @param {string} docId - The document ID
 * @returns {Promise<boolean>} - True if document exists, false otherwise
 */
async function documentExists(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error(`Error checking if document ${docId} exists:`, error);
    return false;
  }
}

export {
  setDocument,
  getDocument,
  getAllDocuments,
  updateDocument,
  deleteDocument,
  addDocument,
  queryDocuments,
  documentExists,
};
