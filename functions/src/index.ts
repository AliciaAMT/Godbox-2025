/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import * as admin from 'firebase-admin';
import sharp from 'sharp';
import { Request, Response } from 'express';
import Busboy from 'busboy';
import * as functions from 'firebase-functions';
import { Readable } from 'stream';

admin.initializeApp();

// Set global options for all functions
setGlobalOptions({
  maxInstances: 10,
});

// uploadImage as 1st Gen function
export const uploadImage = functions.https.onRequest(async (req: Request, res: Response) => {
  // Set CORS headers FIRST, before any other processing
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.set('Access-Control-Max-Age', '86400');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    console.log('=== UPLOAD REQUEST START ===');
    const busboy = Busboy({ headers: req.headers });
    let fileBuffer: Buffer[] = [];
    let fileSize = 0;
    let userId = 'anonymous';

    // Auth
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decodedToken = await admin.auth().verifyIdToken(token);
        userId = decodedToken.uid;
        console.log('Authenticated user:', userId);
      } catch (error) {
        console.log('Auth error:', error);
      }
    }

    busboy.on('file', (fieldname: string, file: NodeJS.ReadableStream, filename: string, encoding: string, mimetype: string) => {
      console.log('File received:', filename, mimetype);
      file.on('data', (data: Buffer) => {
        fileBuffer.push(data);
        fileSize += data.length;
      });
      file.on('limit', () => {
        console.log('File size limit reached');
      });
    });

    busboy.on('finish', async () => {
      try {
        const buffer = Buffer.concat(fileBuffer);
        console.log('File size:', buffer.length);
        if (buffer.length === 0) {
          res.status(400).json({ error: 'No file uploaded' });
          return;
        }
        if (buffer.length > 25 * 1024 * 1024) {
          res.status(400).json({ error: 'File size exceeds 25MB limit' });
          return;
        }
        // Optimize image
        let optimizedBuffer: Buffer;
        try {
          const image = sharp(buffer);
          const metadata = await image.metadata();
          if (metadata.width && metadata.height && (metadata.width > 1920 || metadata.height > 1080)) {
            image.resize(1920, 1080, { fit: 'inside', withoutEnlargement: true });
          }
          optimizedBuffer = await image.jpeg({ quality: 80 }).toBuffer();
        } catch (err) {
          console.log('Sharp error, using original buffer:', err);
          optimizedBuffer = buffer;
        }
        // Upload
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const outFile = `${timestamp}_${randomString}.jpg`;
        const filePath = `public/uploads/${userId}/${outFile}`;
        const bucket = admin.storage().bucket();
        const fileRef = bucket.file(filePath);
        await fileRef.save(optimizedBuffer, {
          metadata: {
            contentType: 'image/jpeg',
            cacheControl: 'public, max-age=31536000'
          }
        });
        await fileRef.makePublic();
      } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload file' });
      }
    });

    // Remove or comment out the line that uses req.rawBody, as it causes a TS error and is not needed for the ESV audio proxy
    // busboy.end(req.rawBody);

  } catch (error) {
    console.error('Error handling upload request:', error);
    res.status(500).json({ error: 'Failed to process upload request' });
  }
});

// ESV Audio Proxy as 1st Gen function
export const esvAudio = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  const q = req.query.q as string;
  if (!q) {
    res.status(400).json({ error: 'Missing q parameter' });
    return;
  }
  const apiKey = process.env.ESV_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'ESV API key not configured in environment variable ESV_API_KEY' });
    return;
  }
  try {
    // Fetch the ESV audio endpoint
    const apiUrl = `https://api.esv.org/v3/passage/audio/?q=${encodeURIComponent(q)}`;
    const response = await fetch(apiUrl, {
      headers: { 'Authorization': `Token ${apiKey}` },
      redirect: 'follow',
    });
    if (!response.ok) {
      res.status(response.status).json({ error: 'Failed to fetch ESV audio' });
      return;
    }
    // Set content type to audio/mpeg
    res.set('Content-Type', 'audio/mpeg');
    // Stream the audio
    if (response.body) {
      Readable.fromWeb(response.body as any).pipe(res);
    } else {
      res.status(500).json({ error: 'No audio stream returned from ESV API' });
    }
  } catch (e) {
    res.status(500).json({ error: 'Proxy error', details: (e as Error).message });
  }
});
