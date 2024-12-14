import { db } from 'lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Function to save content to Firebase
export const saveToFirebase = async (type, content) => {
    try {
        // Add a new document to the 'content' collection
        const docRef = await addDoc(collection(db, 'content'), {
            type,
            content,
            createdAt: serverTimestamp(),
            // You can add more fields here later if needed
        });
        
        console.log('Saved successfully!');
        return docRef.id;
    } catch (error) {
        console.error('Error saving to Firebase:', error);
        throw error; // This will help us handle the error in our component
    }
};